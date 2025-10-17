import sys
print("=" * 50)
print("STARTING APPLICATION")
print(f"Python version: {sys.version}")
print("=" * 50)


from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import mediapipe as mp
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from tensorflow.keras.callbacks import TensorBoard
import os
import base64
from datetime import datetime
import json
import threading
from collections import deque
import time

app = Flask(__name__)
CORS(app)


mp_holistic = mp.solutions.holistic
mp_drawing = mp.solutions.drawing_utils


SEQUENCE_LENGTH = 30
MODEL_PATH = 'models/action_model.h5'
DATA_PATH = 'data/MP_Data'
ACTIONS_FILE = 'data/actions.json'


model = None
actions = []
prediction_cache = {}

def load_actions():
    """Load actions from JSON file or return default if not exists"""
    global actions
    try:
        if os.path.exists(ACTIONS_FILE):
            with open(ACTIONS_FILE, 'r') as f:
                actions_data = json.load(f)
                actions = actions_data.get('actions', ['hello', 'thanks', 'iloveyou'])
        else:
      
            actions = ['hello', 'thanks', 'iloveyou']
            save_actions()
        print(f"Loaded actions: {actions}")
        return actions
    except Exception as e:
        print(f"Error loading actions: {e}")
        actions = ['hello', 'thanks', 'iloveyou']
        return actions

def save_actions():
    """Save actions to JSON file"""
    try:
        os.makedirs('data', exist_ok=True)
        with open(ACTIONS_FILE, 'w') as f:
            json.dump({'actions': actions}, f, indent=2)
        print(f"Saved actions: {actions}")
    except Exception as e:
        print(f"Error saving actions: {e}")

def add_action(action_name):
    """Add a new action to the list"""
    global actions
    if action_name not in actions:
        actions.append(action_name)
        save_actions()
        return True
    return False

def get_actions():
    """Get current actions list"""
    global actions
    return actions

def mediapipe_detection(image, model):
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image.flags.writeable = False
    results = model.process(image)
    image.flags.writeable = True
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
    return image, results

def extract_keypoints(results):
    pose = np.array([[res.x, res.y, res.z, res.visibility] for res in results.pose_landmarks.landmark]).flatten() if results.pose_landmarks else np.zeros(33*4)
    face = np.array([[res.x, res.y, res.z] for res in results.face_landmarks.landmark]).flatten() if results.face_landmarks else np.zeros(468*3)
    lh = np.array([[res.x, res.y, res.z] for res in results.left_hand_landmarks.landmark]).flatten() if results.left_hand_landmarks else np.zeros(21*3)
    rh = np.array([[res.x, res.y, res.z] for res in results.right_hand_landmarks.landmark]).flatten() if results.right_hand_landmarks else np.zeros(21*3)
    return np.concatenate([pose, face, lh, rh])

def create_model(num_actions):
    """Create model dynamically based on number of actions"""
    model = Sequential()
    model.add(LSTM(64, return_sequences=True, activation='relu', input_shape=(SEQUENCE_LENGTH, 1662)))
    model.add(LSTM(128, return_sequences=True, activation='relu'))
    model.add(LSTM(64, return_sequences=False, activation='relu'))
    model.add(Dense(64, activation='relu'))
    model.add(Dense(32, activation='relu'))
    model.add(Dense(num_actions, activation='softmax'))
    
    model.compile(optimizer='Adam', loss='categorical_crossentropy', metrics=['categorical_accuracy'])
    return model

def load_model_if_exists():
    global model, actions
    if os.path.exists(MODEL_PATH):
        try:
            model = tf.keras.models.load_model(MODEL_PATH)
            print("Model loaded successfully")
            
    
            num_actions = model.layers[-1].output_shape[-1]
            print(f"Model expects {num_actions} actions")
            
            return True
        except Exception as e:
            print(f"Error loading model: {e}")
            return False
    return False

def predict_sequence(sequence):
    """Predict action for a sequence with caching for performance"""
    global model, actions
    
    if model is None:
        return None
    

    sequence_hash = hash(sequence.tobytes())
    

    current_time = time.time()
    if sequence_hash in prediction_cache:
        cached_pred, timestamp = prediction_cache[sequence_hash]
        if current_time - timestamp < 1.0:  
            return cached_pred
    
    try:
   
        if len(sequence) != SEQUENCE_LENGTH:
            return None
            

        sequence_reshaped = np.expand_dims(sequence, axis=0)
        
   
        res = model.predict(sequence_reshaped, verbose=0)[0]
        
  
        current_actions = get_actions()
        

        if len(res) != len(current_actions):
            print(f"Warning: Model expects {len(res)} actions but we have {len(current_actions)}")

            num_actions = min(len(res), len(current_actions))
            predicted_action = current_actions[np.argmax(res[:num_actions])]
            confidence = float(np.max(res[:num_actions]))
            probabilities = {action: float(prob) for action, prob in zip(current_actions[:num_actions], res[:num_actions])}
        else:
            predicted_action = current_actions[np.argmax(res)]
            confidence = float(np.max(res))
            probabilities = {action: float(prob) for action, prob in zip(current_actions, res)}
        
        prediction = {
            'action': predicted_action,
            'confidence': confidence,
            'probabilities': probabilities
        }
        

        prediction_cache[sequence_hash] = (prediction, current_time)
        

        for key in list(prediction_cache.keys()):
            if current_time - prediction_cache[key][1] > 2.0:  
                del prediction_cache[key]
        
        return prediction
        
    except Exception as e:
        print(f"Prediction error: {e}")
        return None


load_actions()

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'actions': get_actions()
    })

@app.route('/api/actions', methods=['GET'])
def api_get_actions():
    return jsonify({
        'actions': get_actions()
    })

@app.route('/api/actions', methods=['POST'])
def add_new_action():
  
    try:
        data = request.json
        action_name = data.get('action')
        
        if not action_name:
            return jsonify({'success': False, 'error': 'Action name is required'}), 400
        
        if add_action(action_name):
            return jsonify({
                'success': True, 
                'message': f'Action "{action_name}" added successfully',
                'actions': get_actions()
            })
        else:
            return jsonify({
                'success': False, 
                'error': f'Action "{action_name}" already exists'
            }), 400
            
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/actions/<action_name>', methods=['DELETE'])
def delete_action(action_name):

    try:
        global actions
        
        if action_name not in actions:
            return jsonify({'success': False, 'error': f'Action "{action_name}" not found'}), 404
        

        actions.remove(action_name)
        save_actions()
        

        action_path = os.path.join(DATA_PATH, action_name)
        if os.path.exists(action_path):
            import shutil
            shutil.rmtree(action_path)
            print(f"Deleted data for action: {action_name}")
        
        return jsonify({
            'success': True,
            'message': f'Action "{action_name}" deleted successfully',
            'actions': get_actions()
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/process-frame', methods=['POST'])
def process_frame():
    try:
        data = request.json
        frame_data = data['frame'].split(',')[1]
        frame_bytes = base64.b64decode(frame_data)
        nparr = np.frombuffer(frame_bytes, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        with mp_holistic.Holistic(min_detection_confidence=0.5, min_tracking_confidence=0.5) as holistic:
            image, results = mediapipe_detection(frame, holistic)
            keypoints = extract_keypoints(results)
            
            return jsonify({
                'success': True,
                'keypoints': keypoints.tolist(),
                'has_pose': results.pose_landmarks is not None,
                'has_face': results.face_landmarks is not None,
                'has_left_hand': results.left_hand_landmarks is not None,
                'has_right_hand': results.right_hand_landmarks is not None
            })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        sequence = np.array(data['sequence'])
        
        if len(sequence) != SEQUENCE_LENGTH:
            return jsonify({'success': False, 'error': f'Sequence must be {SEQUENCE_LENGTH} frames'}), 400
        
        prediction = predict_sequence(sequence)
        
        if prediction is None:
            return jsonify({'success': False, 'error': 'Prediction failed'}), 400
        
        return jsonify({
            'success': True,
            **prediction
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/train', methods=['POST'])
def train_model():
    global model
    
    try:

        if not os.path.exists(DATA_PATH):
            return jsonify({
                'success': False, 
                'error': 'No training data found. Please collect data first.'
            }), 400
        

        current_actions = get_actions()
        if len(current_actions) == 0:
            return jsonify({
                'success': False,
                'error': 'No actions defined. Please add actions first.'
            }), 400
        
  
        sequences, labels = [], []
        label_map = {label: num for num, label in enumerate(current_actions)}
        
        print("Loading training data...")
        print(f"Available actions: {current_actions}")
        
        for action in current_actions:
            action_path = os.path.join(DATA_PATH, action)
            if not os.path.exists(action_path):
                print(f"Warning: No data found for action: {action}")
                continue
            
       
            sequence_dirs = [d for d in os.listdir(action_path) if os.path.isdir(os.path.join(action_path, d))]
            
            if len(sequence_dirs) == 0:
                print(f"Warning: No sequences found for action: {action}")
                continue
            
            print(f"Found {len(sequence_dirs)} sequences for {action}")
            
            for sequence_num in sequence_dirs:
                window = []
                sequence_path = os.path.join(action_path, sequence_num)
                
  
                for frame_num in range(SEQUENCE_LENGTH):
                    frame_path = os.path.join(sequence_path, f'{frame_num}.npy')
                    if os.path.exists(frame_path):
                        keypoints = np.load(frame_path)
                        window.append(keypoints)
                    else:
                        print(f"Warning: Missing frame {frame_num} in {action}/{sequence_num}")
                        break
                

                if len(window) == SEQUENCE_LENGTH:
                    sequences.append(window)
                    labels.append(label_map[action])
        
        if len(sequences) == 0:
            return jsonify({
                'success': False,
                'error': 'No complete sequences found. Please collect data first.'
            }), 400
        
        print(f"Loaded {len(sequences)} sequences total")
        print(f"Number of actions: {len(current_actions)}")

        X = np.array(sequences)
        y = tf.keras.utils.to_categorical(labels, num_classes=len(current_actions))
        
        print(f"Training data shape: {X.shape}")
        print(f"Labels shape: {y.shape}")
        

        from sklearn.model_selection import train_test_split
        X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42, stratify=labels)
        

        model = create_model(len(current_actions))
        
 
        log_dir = os.path.join('logs', 'fit', datetime.now().strftime("%Y%m%d-%H%M%S"))
        os.makedirs(log_dir, exist_ok=True)
        
        tb_callback = TensorBoard(log_dir=log_dir)
        

        early_stop = tf.keras.callbacks.EarlyStopping(
            monitor='val_loss',
            patience=10,
            restore_best_weights=True
        )
        
        print("Starting training...")

        history = model.fit(
            X_train, y_train,
            validation_data=(X_val, y_val),
            epochs=200,
            batch_size=32,
            callbacks=[tb_callback, early_stop],
            verbose=1
        )
        

        os.makedirs('models', exist_ok=True)
        model.save(MODEL_PATH)
        print(f"Model saved to {MODEL_PATH}")
        

        train_acc = float(history.history['categorical_accuracy'][-1])
        val_acc = float(history.history['val_categorical_accuracy'][-1])
        train_loss = float(history.history['loss'][-1])
        val_loss = float(history.history['val_loss'][-1])
        
        return jsonify({
            'success': True,
            'message': 'Model trained successfully',
            'training_accuracy': train_acc,
            'validation_accuracy': val_acc,
            'training_loss': train_loss,
            'validation_loss': val_loss,
            'epochs_trained': len(history.history['loss']),
            'total_sequences': len(sequences),
            'actions_trained': current_actions
        })
    except Exception as e:
        import traceback
        error_msg = str(e)
        stack_trace = traceback.format_exc()
        print(f"Training error: {error_msg}")
        print(stack_trace)
        return jsonify({
            'success': False, 
            'error': error_msg,
            'details': stack_trace
        }), 400

@app.route('/api/collect-data', methods=['POST'])
def collect_data():
    try:
        data = request.json
        action = data['action']
        sequence_num = data['sequence']
        frame_num = data['frame']
        keypoints = np.array(data['keypoints'])
        
        current_actions = get_actions()
        if action not in current_actions:
        
            add_action(action)
            print(f"Auto-added new action: {action}")
        
        path = os.path.join(DATA_PATH, action, str(sequence_num))
        os.makedirs(path, exist_ok=True)
        
        npy_path = os.path.join(path, str(frame_num))
        np.save(npy_path, keypoints)
        
        return jsonify({'success': True, 'message': f'Saved frame {frame_num} for {action}'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/model-status', methods=['GET'])
def model_status():
    model_exists = os.path.exists(MODEL_PATH)
    return jsonify({
        'model_exists': model_exists,
        'model_loaded': model is not None,
        'model_path': MODEL_PATH,
        'actions': get_actions()
    })

@app.route('/api/data-status', methods=['GET'])
def data_status():

    try:
        current_actions = get_actions()
        status = {}
        total_sequences = 0
        
        for action in current_actions:
            action_path = os.path.join(DATA_PATH, action)
            if os.path.exists(action_path):
                sequence_dirs = [d for d in os.listdir(action_path) if os.path.isdir(os.path.join(action_path, d))]
                
                complete_sequences = 0
                for seq_dir in sequence_dirs:
                    seq_path = os.path.join(action_path, seq_dir)
                    frame_count = len([f for f in os.listdir(seq_path) if f.endswith('.npy')])
                    if frame_count == SEQUENCE_LENGTH:
                        complete_sequences += 1
                
                status[action] = {
                    'total_sequences': len(sequence_dirs),
                    'complete_sequences': complete_sequences,
                    'ready': complete_sequences >= 20  
                }
                total_sequences += complete_sequences
            else:
                status[action] = {
                    'total_sequences': 0,
                    'complete_sequences': 0,
                    'ready': False
                }
        
        all_ready = all(s['ready'] for s in status.values() if s['total_sequences'] > 0)
        min_sequences = 20 * len([a for a in current_actions if status[a]['total_sequences'] > 0])
        
        return jsonify({
            'success': True,
            'actions': status,
            'total_sequences': total_sequences,
            'ready_for_training': all_ready and total_sequences >= min_sequences
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400
    
@app.route('/api/collect-batch-data', methods=['POST'])
def collect_batch_data():

    try:
        data = request.json
        action = data['action']
        sequence_num = data['sequence']
        frames = data['frames'] 
        
        current_actions = get_actions()
        if action not in current_actions:

            add_action(action)
            print(f"Auto-added new action: {action}")
        
        path = os.path.join(DATA_PATH, action, str(sequence_num))
        os.makedirs(path, exist_ok=True)
        

        for frame_data in frames:
            frame_num = frame_data['frame']
            keypoints = np.array(frame_data['keypoints'])
            npy_path = os.path.join(path, str(frame_num))
            np.save(npy_path, keypoints)
        
        return jsonify({
            'success': True, 
            'message': f'Saved {len(frames)} frames for {action} sequence {sequence_num}'
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/collect-sequence-data', methods=['POST'])
def collect_sequence_data():

    try:
        data = request.json
        action = data['action']
        sequence_num = data['sequence']
        frames = data['frames'] 
        
        current_actions = get_actions()
        if action not in current_actions:
            add_action(action)
            print(f"Auto-added new action: {action}")
        
        path = os.path.join(DATA_PATH, action, str(sequence_num))
        os.makedirs(path, exist_ok=True)
        

        for frame_data in frames:
            frame_num = frame_data['frame']
            keypoints = np.array(frame_data['keypoints'])
            npy_path = os.path.join(path, str(frame_num))
            np.save(npy_path, keypoints)
        
        return jsonify({
            'success': True, 
            'message': f'Saved sequence {sequence_num} with {len(frames)} frames for {action}'
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/')
def index():
    """Root endpoint - API health check"""
    return jsonify({
        'status': 'running',
        'service': 'ASL Sequence Data Collection API',
        'version': '1.0',
        'endpoints': {
            'collect_sequence_data': {
                'url': '/api/collect-sequence-data',
                'method': 'POST',
                'description': 'Collect ASL sequence data with frames and keypoints'
            }
        }
    })

@app.route('/health')
def health():
    """Health check endpoint"""
    return jsonify({'status': 'healthy'}), 200

if __name__ == '__main__':
    print("Loading actions...")
    load_actions()
    print("Loading model if exists...")
    load_model_if_exists()
    
    port = int(os.environ.get('PORT', 10000))
    print(f"Starting Flask app on port {port}")
    
    app.run(host='0.0.0.0', port=port, debug=False)
else:
    # This runs when Gunicorn imports the module
    print("App module loaded by Gunicorn")
    load_actions()
    load_model_if_exists()
    print(f"Available routes: {[str(rule) for rule in app.url_map.iter_rules()]}")

    