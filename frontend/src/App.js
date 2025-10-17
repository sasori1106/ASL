import { Hands } from "@mediapipe/hands";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Pose } from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import {
  HAND_CONNECTIONS,
  FACEMESH_TESSELATION,
  FACEMESH_RIGHT_EYE,
  FACEMESH_LEFT_EYE,
  FACEMESH_LIPS,
  POSE_CONNECTIONS,
} from "@mediapipe/hands";
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Webcam from "react-webcam";
import axios from "axios";
import "./App.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";
const SEQUENCE_LENGTH = 30;

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const handsRef = useRef(null);
  const faceMeshRef = useRef(null);
  const poseRef = useRef(null);
  const cameraRef = useRef(null);

  const [mode, setMode] = useState("recognize");
  const [isRecording, setIsRecording] = useState(false);
  const [sequence, setSequence] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [actions, setActions] = useState([]);
  const [selectedAction, setSelectedAction] = useState("");
  const [newActionName, setNewActionName] = useState("");
  const [collectProgress, setCollectProgress] = useState({
    sequence: 0,
    frame: 0,
  });
  const [modelStatus, setModelStatus] = useState(null);
  const [status, setStatus] = useState("");
  const [trackingEnabled, setTrackingEnabled] = useState(true);
  const [detectionResults, setDetectionResults] = useState({
    hands: { left: false, right: false },
    face: false,
    pose: false,
  });
  const [realtimeEnabled, setRealtimeEnabled] = useState(false);
  const [latestKeypoints, setLatestKeypoints] = useState(null);
  const [predictionHistory, setPredictionHistory] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [frameCount, setFrameCount] = useState(0);


  const sequenceRef = useRef([]);
  const realtimeEnabledRef = useRef(false);
  const isProcessingRef = useRef(false);

  useEffect(() => {
    fetchActions();
    checkModelStatus();
    initializeMediaPipe();

    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
    };
  }, []);


  useEffect(() => {
    sequenceRef.current = sequence;
  }, [sequence]);

  useEffect(() => {
    realtimeEnabledRef.current = realtimeEnabled;
  }, [realtimeEnabled]);

  useEffect(() => {
    isProcessingRef.current = isProcessing;
  }, [isProcessing]);

  useEffect(() => {
    if (realtimeEnabled && latestKeypoints) {
      updateRealtimeSequence();
    }
  }, [latestKeypoints, realtimeEnabled]);

  const initializeMediaPipe = () => {
    initializeHands();
    initializeFaceMesh();
    initializePose();
  };

  const initializeHands = () => {
    handsRef.current = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      },
    });

    handsRef.current.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    handsRef.current.onResults(onHandsResults);
  };

  const initializeFaceMesh = () => {
    faceMeshRef.current = new FaceMesh({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
      },
    });

    faceMeshRef.current.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMeshRef.current.onResults(onFaceResults);
  };

  const initializePose = () => {
    poseRef.current = new Pose({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
      },
    });

    poseRef.current.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      smoothSegmentation: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    poseRef.current.onResults(onPoseResults);
  };

  const startCamera = () => {
    if (webcamRef.current && webcamRef.current.video) {
      console.log("Starting camera...");
      cameraRef.current = new Camera(webcamRef.current.video, {
        onFrame: async () => {
          if (trackingEnabled) {
            await processFrame();
          }
        },
        width: 640,
        height: 480,
      });
      cameraRef.current.start();
      console.log("Camera started");
    } else {
      console.error("Webcam not available");
    }
  };

  const processFrame = async () => {
    if (!webcamRef.current || !webcamRef.current.video) {
      console.log("Webcam or video not available");
      return;
    }

    const video = webcamRef.current.video;


    if (handsRef.current) {
      await handsRef.current.send({ image: video });
    }


    if (faceMeshRef.current) {
      await faceMeshRef.current.send({ image: video });
    }


    if (poseRef.current) {
      await poseRef.current.send({ image: video });
    }


    if (realtimeEnabledRef.current && !isProcessingRef.current) {
      await extractAndSendKeypoints();
    }
  };

  const extractAndSendKeypoints = async () => {
    if (!webcamRef.current || isProcessingRef.current) {
      console.log("Skipping frame extraction - busy or no webcam");
      return;
    }

    setIsProcessing(true);
    try {
      console.log("Taking screenshot...");
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) {
        console.log("No screenshot available");
        return;
      }

      console.log("Sending frame to backend...");
      const response = await axios.post(`${API_URL}/api/process-frame`, {
        frame: imageSrc,
      });

      if (response.data.success) {
        console.log(
          "Keypoints received, count:",
          response.data.keypoints.length
        );
        setLatestKeypoints(response.data.keypoints);
        setFrameCount((prev) => prev + 1);
      } else {
        console.error("Backend error:", response.data.error);
      }
    } catch (error) {
      console.error("Error processing frame:", error);
      setStatus("Error processing frame: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const updateRealtimeSequence = () => {
    setSequence((prev) => {
      const newSequence = [...prev, latestKeypoints];

      if (newSequence.length > SEQUENCE_LENGTH) {
        return newSequence.slice(-SEQUENCE_LENGTH);
      }
      return newSequence;
    });
  };

  const predictionHistoryRef = useRef([]);
  useEffect(() => {
    predictionHistoryRef.current = predictionHistory;
  }, [predictionHistory]);

  useEffect(() => {
    let predictionInterval;

    if (realtimeEnabled && sequence.length === SEQUENCE_LENGTH) {
      console.log("Starting real-time prediction interval with full sequence");

      predictionInterval = setInterval(() => {
        makePrediction();
      }, 500);
    } else {
      console.log("Real-time conditions:", {
        realtimeEnabled,
        sequenceLength: sequence.length,
        needed: SEQUENCE_LENGTH,
      });
    }

    return () => {
      if (predictionInterval) {
        console.log("Clearing prediction interval");
        clearInterval(predictionInterval);
      }
    };
  }, [realtimeEnabled, sequence.length]);

  const makePrediction = async () => {
    const currentSequence = sequenceRef.current;
    if (currentSequence.length !== SEQUENCE_LENGTH) {
      console.log(
        "Sequence not ready:",
        currentSequence.length,
        "needed:",
        SEQUENCE_LENGTH
      );
      return;
    }

    try {
      console.log(
        "Making prediction with sequence length:",
        currentSequence.length
      );
      const response = await axios.post(`${API_URL}/api/predict`, {
        sequence: currentSequence,
      });

      if (response.data.success) {
        console.log(
          "Prediction received:",
          response.data.action,
          "confidence:",
          response.data.confidence
        );
        setPrediction(response.data);


        setPredictionHistory((prev) => {
          const newHistory = [...prev, response.data];

          return newHistory.slice(-5);
        });


        const currentHistory = [
          ...predictionHistoryRef.current,
          response.data,
        ].slice(-5);
        if (currentHistory.length >= 3) {
          const actionCounts = {};
          currentHistory.forEach((pred) => {
            actionCounts[pred.action] = (actionCounts[pred.action] || 0) + 1;
          });

          const mostFrequentAction = Object.keys(actionCounts).reduce((a, b) =>
            actionCounts[a] > actionCounts[b] ? a : b
          );

          const smoothedPrediction = {
            ...response.data,
            action: mostFrequentAction,
            confidence:
              currentHistory
                .filter((p) => p.action === mostFrequentAction)
                .reduce((acc, p) => acc + p.confidence, 0) /
              actionCounts[mostFrequentAction],
          };

          setPrediction(smoothedPrediction);
        }
      } else {
        console.error("Prediction failed:", response.data.error);
      }
    } catch (error) {
      console.error("Prediction error:", error);
      setStatus(
        "Prediction error: " + (error.response?.data?.error || error.message)
      );
    }
  };

  const startRealtimeRecognition = async () => {
    console.log("=== STARTING REAL-TIME RECOGNITION ===");


    if (modelStatus && !modelStatus.model_exists) {
      setStatus("Error: Model not trained yet. Please train the model first.");
      return;
    }


    setRealtimeEnabled(true);
    setSequence([]);
    setSequence([]);
    setPrediction(null);
    setPredictionHistory([]);
    setFrameCount(0);
    setStatus("Real-time recognition started... Collecting frames...");

    console.log("Real-time enabled, reset sequence and prediction");


    if (!cameraRef.current) {
      console.log("Starting camera for real-time mode");
      startCamera();
    } else {
      console.log("Camera already running");
    }


    const progressInterval = setInterval(() => {
      console.log(
        "Progress check - Sequence length:",
        sequenceRef.current.length,
        "Frame count:",
        frameCount
      );
    }, 1000);


    setTimeout(() => {
      clearInterval(progressInterval);
      if (sequenceRef.current.length === 0) {
        console.error("No frames collected after 30 seconds");
        setStatus(
          "Error: No frames being collected. Check camera and backend."
        );
      }
    }, 30000);
  };

  const stopRealtimeRecognition = () => {
    console.log("=== STOPPING REAL-TIME RECOGNITION ===");
    setRealtimeEnabled(false);
    setStatus("Real-time recognition stopped");
  };

  const onHandsResults = (results) => {
    const canvas = canvasRef.current;
    const video = webcamRef.current?.video;

    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);


    setDetectionResults((prev) => ({
      ...prev,
      hands: {
        left:
          results.multiHandLandmarks &&
          results.multiHandLandmarks.some((hand) =>
            results.multiHandedness?.find(
              (h) =>
                h.label === "Left" &&
                h.index === results.multiHandLandmarks.indexOf(hand)
            )
          ),
        right:
          results.multiHandLandmarks &&
          results.multiHandLandmarks.some((hand) =>
            results.multiHandedness?.find(
              (h) =>
                h.label === "Right" &&
                h.index === results.multiHandLandmarks.indexOf(hand)
            )
          ),
      },
    }));


    if (results.multiHandLandmarks) {
      for (const landmarks of results.multiHandLandmarks) {
        drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
          color: "#00FF00",
          lineWidth: 2,
        });
        drawLandmarks(ctx, landmarks, {
          color: "#FF0000",
          lineWidth: 1,
          radius: 2,
        });
      }
    }

    ctx.restore();
  };

  const onFaceResults = (results) => {
    const canvas = canvasRef.current;
    if (!canvas || !results.multiFaceLandmarks) return;

    const ctx = canvas.getContext("2d");


    setDetectionResults((prev) => ({
      ...prev,
      face: results.multiFaceLandmarks.length > 0,
    }));


    for (const landmarks of results.multiFaceLandmarks) {
      drawConnectors(ctx, landmarks, FACEMESH_TESSELATION, {
        color: "#C0C0C070",
        lineWidth: 1,
      });
      drawConnectors(ctx, landmarks, FACEMESH_RIGHT_EYE, {
        color: "#FF3030",
        lineWidth: 1,
      });
      drawConnectors(ctx, landmarks, FACEMESH_LEFT_EYE, {
        color: "#30FF30",
        lineWidth: 1,
      });
      drawConnectors(ctx, landmarks, FACEMESH_LIPS, {
        color: "#E0E0E0",
        lineWidth: 1,
      });
    }
  };

  const onPoseResults = (results) => {
    const canvas = canvasRef.current;
    if (!canvas || !results.poseLandmarks) return;

    const ctx = canvas.getContext("2d");


    setDetectionResults((prev) => ({
      ...prev,
      pose: !!results.poseLandmarks,
    }));


    drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, {
      color: "#FFFFFF",
      lineWidth: 2,
    });
    drawLandmarks(ctx, results.poseLandmarks, {
      color: "#FF0000",
      lineWidth: 1,
      radius: 2,
    });
  };

  const captureFrame = async () => {
    if (!webcamRef.current) return null;

    try {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) return null;

      const response = await fetch(`${API_URL}/api/process-frame`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ frame: imageSrc }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.keypoints;
      }
      return null;
    } catch (error) {
      console.error("Error capturing frame:", error);
      return null;
    }
  };

  const startDataCollection = async () => {
    if (!selectedAction) {
      alert("Please select an action");
      return;
    }

    setIsRecording(true);
    setStatus(`Collecting data for: ${selectedAction}`);

    const totalSequences = 30;
    const BATCH_SIZE = 5; 
    const FRAME_DELAY = 30; 

    try {
      for (let seq = 0; seq < totalSequences; seq++) {
        console.log(
          `Starting sequence ${seq + 1} for action ${selectedAction}`
        );
        setCollectProgress({ sequence: seq + 1, frame: 0 });

  
        await new Promise((resolve) => setTimeout(resolve, 100));

        const framePromises = [];

        for (let frame = 0; frame < SEQUENCE_LENGTH; frame += BATCH_SIZE) {

          const batchFrames = [];

          for (let i = 0; i < BATCH_SIZE && frame + i < SEQUENCE_LENGTH; i++) {
            batchFrames.push(frame + i);
          }


          const batchPromises = batchFrames.map(async (frameNum) => {
            const keypoints = await captureFrame();
            if (keypoints) {
              return {
                frame: frameNum,
                keypoints: keypoints,
              };
            }
            return null;
          });

          const batchResults = await Promise.all(batchPromises);


          const validResults = batchResults.filter((result) => result !== null);

          if (validResults.length > 0) {
            try {

              await axios.post(`${API_URL}/api/collect-batch-data`, {
                action: selectedAction,
                sequence: seq,
                frames: validResults,
              });


              setCollectProgress({
                sequence: seq + 1,
                frame: frame + validResults.length,
              });
            } catch (error) {
              console.error("Error saving batch data:", error);
            }
          }


          await new Promise((resolve) => setTimeout(resolve, FRAME_DELAY));
        }
      }

      setStatus(`Data collection complete for ${selectedAction}!`);
    } catch (error) {
      console.error("Data collection error:", error);
      setStatus(`Error during data collection: ${error.message}`);
    } finally {
      setIsRecording(false);
    }
  };

  const trainModel = async () => {
    setStatus("Training model... This may take a few minutes.");
    try {
      const response = await axios.post(`${API_URL}/api/train`);
      setStatus(
        `Training complete! Accuracy: ${(
          response.data.training_accuracy * 100
        ).toFixed(1)}%`
      );
      checkModelStatus();
    } catch (error) {
      setStatus(
        "Training error: " + (error.response?.data?.error || error.message)
      );
    }
  };

  const fetchActions = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/actions`);
      setActions(response.data.actions);
      if (response.data.actions.length > 0) {
        setSelectedAction(response.data.actions[0]);
      }
    } catch (error) {
      console.error("Error fetching actions:", error);
    }
  };

  const addNewAction = async () => {
    if (!newActionName.trim()) {
      alert("Please enter an action name");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/actions`, {
        action: newActionName.trim(),
      });

      if (response.data.success) {
        setActions(response.data.actions);
        setNewActionName("");
        setStatus(`Action "${newActionName}" added successfully!`);
    
        setSelectedAction(newActionName.trim());
      } else {
        setStatus("Error: " + response.data.error);
      }
    } catch (error) {
      setStatus(
        "Error adding action: " + (error.response?.data?.error || error.message)
      );
    }
  };

  const deleteAction = async (actionName) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the action "${actionName}"? This will also delete all collected data for this action.`
      )
    ) {
      return;
    }

    try {
      const response = await axios.delete(
        `${API_URL}/api/actions/${actionName}`
      );

      if (response.data.success) {
        setActions(response.data.actions);
        if (selectedAction === actionName && response.data.actions.length > 0) {
          setSelectedAction(response.data.actions[0]);
        }
        setStatus(`Action "${actionName}" deleted successfully`);
      } else {
        setStatus("Error: " + response.data.error);
      }
    } catch (error) {
      setStatus(
        "Error deleting action: " +
          (error.response?.data?.error || error.message)
      );
    }
  };
  const checkModelStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/model-status`);
      setModelStatus(response.data);
      console.log("Model status:", response.data);
    } catch (error) {
      console.error("Error checking model status:", error);
    }
  };

  const toggleTracking = () => {
    setTrackingEnabled(!trackingEnabled);
    if (!trackingEnabled) {
      startCamera();
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>ASL Recognition System</h1>
        <p className="subtitle">
          Real-time American Sign Language Recognition - Unlimited Words!
        </p>
      </header>

      <div className="container">
        <div className="mode-selector">
          <button
            className={mode === "recognize" ? "active" : ""}
            onClick={() => setMode("recognize")}
          >
            Recognize
          </button>
          <button
            className={mode === "collect" ? "active" : ""}
            onClick={() => setMode("collect")}
          >
            Collect Data
          </button>
          <button
            className={mode === "train" ? "active" : ""}
            onClick={() => setMode("train")}
          >
            Train Model
          </button>
          <button
            className={mode === "manage" ? "active" : ""}
            onClick={() => setMode("manage")}
          >
            Manage Actions
          </button>
          {/* <Link to="/dictionary" className="dictionary-link">
            <button className="dictionary-btn">
              Dictionary
            </button>
          </Link> */}
        </div>

        <div className="content">
          <div className="webcam-section">
            <div className="webcam-container">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                className="webcam"
                mirrored={true}
                onUserMedia={startCamera}
              />
              <canvas ref={canvasRef} className="overlay-canvas" />

              {/* Real-time prediction overlay */}
              {realtimeEnabled && prediction && (
                <div className="prediction-overlay">
                  <div
                    className={`prediction-badge ${
                      prediction.confidence > 0.7
                        ? "high-confidence"
                        : "low-confidence"
                    }`}
                  >
                    <span className="prediction-text">{prediction.action}</span>
                    <span className="confidence-text">
                      {(prediction.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="tracking-controls">
              <button
                onClick={toggleTracking}
                className={`tracking-btn ${
                  trackingEnabled ? "enabled" : "disabled"
                }`}
              >
                {trackingEnabled ? "Disable Tracking" : "Enable Tracking"}
              </button>

              <div className="detection-status">
                <div
                  className={`status-item ${
                    detectionResults.hands.left ? "detected" : ""
                  }`}
                >
                  <span className="status-dot"></span>
                  Left Hand:{" "}
                  {detectionResults.hands.left ? "Detected" : "Not Found"}
                </div>
                <div
                  className={`status-item ${
                    detectionResults.hands.right ? "detected" : ""
                  }`}
                >
                  <span className="status-dot"></span>
                  Right Hand:{" "}
                  {detectionResults.hands.right ? "Detected" : "Not Found"}
                </div>
                <div
                  className={`status-item ${
                    detectionResults.face ? "detected" : ""
                  }`}
                >
                  <span className="status-dot"></span>
                  Face: {detectionResults.face ? "Detected" : "Not Found"}
                </div>
                <div
                  className={`status-item ${
                    detectionResults.pose ? "detected" : ""
                  }`}
                >
                  <span className="status-dot"></span>
                  Pose: {detectionResults.pose ? "Detected" : "Not Found"}
                </div>
              </div>
            </div>
          </div>

          <div className="control-section">
            {mode === "recognize" && (
              <div className="recognize-mode">
                <h2>Real-time Recognition Mode</h2>
                {modelStatus && !modelStatus.model_exists && (
                  <div className="warning">
                    ⚠️ Model not trained yet. Please collect data and train the
                    model first.
                  </div>
                )}

                <div className="realtime-controls">
                  {!realtimeEnabled ? (
                    <button
                      onClick={startRealtimeRecognition}
                      disabled={modelStatus && !modelStatus.model_exists}
                      className="primary-btn realtime-btn"
                    >
                      {modelStatus && !modelStatus.model_exists
                        ? "Train Model First"
                        : "Start Real-time Recognition"}
                    </button>
                  ) : (
                    <button
                      onClick={stopRealtimeRecognition}
                      className="primary-btn stop-btn"
                    >
                      Stop Real-time Recognition
                    </button>
                  )}
                </div>

                <div className="sequence-info">
                  <p>
                    Sequence Buffer: {sequence.length} / {SEQUENCE_LENGTH}{" "}
                    frames
                  </p>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${(sequence.length / SEQUENCE_LENGTH) * 100}%`,
                      }}
                    ></div>
                  </div>
                  {realtimeEnabled && sequence.length < SEQUENCE_LENGTH && (
                    <p className="buffer-warning">
                      Collecting frames... {SEQUENCE_LENGTH - sequence.length}{" "}
                      more needed
                    </p>
                  )}
                </div>

                {prediction && (
                  <div className="prediction-result">
                    <h3>Current Prediction</h3>
                    <div className="main-prediction">
                      <span className="action">{prediction.action}</span>
                      <span className="confidence">
                        {(prediction.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="probabilities">
                      {Object.entries(prediction.probabilities).map(
                        ([action, prob]) => (
                          <div key={action} className="prob-item">
                            <span>{action}</span>
                            <div className="prob-bar">
                              <div
                                className="prob-fill"
                                style={{ width: `${prob * 100}%` }}
                              ></div>
                            </div>
                            <span>{(prob * 100).toFixed(1)}%</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {mode === "collect" && (
              <div className="collect-mode">
                <h2>Data Collection Mode</h2>

                <div className="action-management">
                  <div className="action-selector">
                    <label>Select Action:</label>
                    <select
                      value={selectedAction}
                      onChange={(e) => setSelectedAction(e.target.value)}
                      disabled={isRecording}
                    >
                      {actions.map((action) => (
                        <option key={action} value={action}>
                          {action}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="add-action">
                    <input
                      type="text"
                      value={newActionName}
                      onChange={(e) => setNewActionName(e.target.value)}
                      placeholder="New action name"
                      disabled={isRecording}
                    />
                    <button
                      onClick={addNewAction}
                      disabled={isRecording || !newActionName.trim()}
                      className="secondary-btn"
                    >
                      Add Action
                    </button>
                  </div>
                </div>

                <button
                  onClick={startDataCollection}
                  disabled={isRecording || !selectedAction}
                  className="primary-btn"
                >
                  {isRecording ? "Collecting..." : "Start Collection"}
                </button>

                {isRecording && (
                  <div className="progress-info">
                    <p>Sequence: {collectProgress.sequence} / 30</p>
                    <p>
                      Frame: {collectProgress.frame} / {SEQUENCE_LENGTH}
                    </p>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${(collectProgress.sequence / 30) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {mode === "train" && (
              <div className="train-mode">
                <h2>Training Mode</h2>
                <p>Train the model using collected data for all actions</p>
                <button onClick={trainModel} className="primary-btn">
                  Train Model
                </button>

                {modelStatus && (
                  <div className="model-info">
                    <p>
                      Model Status:{" "}
                      {modelStatus.model_exists
                        ? "✅ Exists"
                        : "❌ Not trained"}
                    </p>
                    <p>
                      Model Loaded:{" "}
                      {modelStatus.model_loaded ? "✅ Yes" : "❌ No"}
                    </p>
                    <p>Actions: {modelStatus.actions?.join(", ") || "None"}</p>
                  </div>
                )}
              </div>
            )}

            {mode === "manage" && (
              <div className="manage-mode">
                <h2>Manage Actions</h2>

                <div className="add-action-section">
                  <h3>Add New Action</h3>
                  <div className="add-action-form">
                    <input
                      type="text"
                      value={newActionName}
                      onChange={(e) => setNewActionName(e.target.value)}
                      placeholder="Enter new action name"
                      className="action-input"
                    />
                    <button
                      onClick={addNewAction}
                      disabled={!newActionName.trim()}
                      className="primary-btn"
                    >
                      Add Action
                    </button>
                  </div>
                </div>

                <div className="actions-list-section">
                  <h3>Current Actions ({actions.length})</h3>
                  <div className="actions-grid">
                    {actions.map((action) => (
                      <div key={action} className="action-item">
                        <span className="action-name">{action}</span>
                        <button
                          onClick={() => deleteAction(action)}
                          className="delete-btn"
                          disabled={actions.length <= 1}
                          title={
                            actions.length <= 1
                              ? "Cannot delete the last action"
                              : `Delete ${action}`
                          }
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                  {actions.length === 0 && (
                    <p className="no-actions">
                      No actions defined. Add your first action above.
                    </p>
                  )}
                </div>

                <div className="actions-info">
                  <h4>How it works:</h4>
                  <ul>
                    <li>✅ Add unlimited ASL signs/words</li>
                    <li>✅ Collect data for each action</li>
                    <li>✅ Train model with all actions</li>
                    <li>✅ Real-time recognition for all trained actions</li>
                    <li>✅ Delete actions (data is also deleted)</li>
                  </ul>
                </div>
              </div>
            )}

            {status && <div className="status-message">{status}</div>}
          </div>
        </div>

        <div className="info-section">
          <h3>Available Actions ({actions.length})</h3>
          <div className="actions-list">
            {actions.map((action) => (
              <span key={action} className="action-tag">
                {action}
              </span>
            ))}
            {actions.length === 0 && (
              <span className="no-actions-tag">No actions yet</span>
            )}
          </div>

          <div className="tracking-info">
            <h4>Features:</h4>
            <ul>
              <li>✅ Unlimited ASL words/signs</li>
              <li>✅ Dynamic action management</li>
              <li>✅ Real-time recognition</li>
              <li>✅ Continuous training</li>
              <li>✅ Visual feedback</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
