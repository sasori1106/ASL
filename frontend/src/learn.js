import { useState } from "react";

export default function Learn() {
  const [activeTab, setActiveTab] = useState("Words");
  const [selectedItem, setSelectedItem] = useState(null);

  const letters = [
    { title: "A", video: "./videos/A.mp4", description: "ASL sign for the letter A." },
    { title: "B", video: "./videos/b.mp4", description: "ASL sign for the letter B." },
    { title: "C", video: "./videos/c.mp4", description: "ASL sign for the letter C." },
    { title: "D", video: "./videos/D.mp4", description: "ASL sign for the letter D." },
    { title: "E", video: "./videos/E.mp4", description: "ASL sign for the letter E." },
    { title: "F", video: "./videos/F.mp4", description: "ASL sign for the letter F." },
    { title: "G", video: "./videos/G.mp4", description: "ASL sign for the letter G." },
    { title: "H", video: "./videos/H.mp4", description: "ASL sign for the letter H." },
    { title: "I", video: "./videos/I.mp4", description: "ASL sign for the letter I." },
    { title: "J", video: "./videos/j.mp4", description: "ASL sign for the letter J." },
    { title: "K", video: "./videos/k.mp4", description: "ASL sign for the letter K." },
    { title: "L", video: "./videos/L.mp4", description: "ASL sign for the letter L." },
    { title: "M", video: "./videos/M.mp4", description: "ASL sign for the letter M." },
    { title: "N", video: "./videos/N.mp4", description: "ASL sign for the letter N." },
    { title: "O", video: "./videos/O.mp4", description: "ASL sign for the letter O." },
    { title: "P", video: "./videos/P.mp4", description: "ASL sign for the letter P." },
    { title: "Q", video: "./videos/Q.mp4", description: "ASL sign for the letter Q." },
    { title: "R", video: "./videos/R.mp4", description: "ASL sign for the letter R." },
    { title: "S", video: "./videos/S.mp4", description: "ASL sign for the letter S." },
    { title: "T", video: "./videos/T.mp4", description: "ASL sign for the letter T." },
    { title: "U", video: "./videos/U.mp4", description: "ASL sign for the letter U." },
    { title: "V", video: "./videos/V.mp4", description: "ASL sign for the letter V." },
    { title: "W", video: "./videos/W.mp4", description: "ASL sign for the letter W." },
    { title: "Y", video: "./videos/Y.mp4", description: "ASL sign for the letter Y." },
    { title: "Z", video: "./videos/Z.mp4", description: "ASL sign for the letter Z." },
  ];

  const numbers = [
    { title: "1", video: "./videos/1.mp4", description: "ASL sign for the number 1." },
    { title: "2", video: "./videos/2.mp4", description: "ASL sign for the number 2." },
    { title: "3", video: "./videos/3.mp4", description: "ASL sign for the number 3." },
    { title: "4", video: "./videos/4.mp4", description: "ASL sign for the number 4." },
    { title: "5", video: "./videos/5.mp4", description: "ASL sign for the number 5." },
    { title: "6", video: "./videos/6.mp4", description: "ASL sign for the number 6." },
    { title: "7", video: "./videos/7.mp4", description: "ASL sign for the number 7." },
    { title: "8", video: "./videos/8.mp4", description: "ASL sign for the number 8." },
    { title: "9", video: "./videos/9.mp4", description: "ASL sign for the number 9." },
  ];

  const words = [
    { title: "Bed", video: "./videos/BED.mp4", description: "ASL sign for Bed." },
    { title: "Calm Down", video: "./videos/CALM DOWN.mp4", description: "ASL sign for Calm Down." },
    { title: "Church", video: "./videos/CHURCH.mp4", description: "ASL sign for Church." },
    { title: "Doctor", video: "./videos/DOCTOR.mp4", description: "ASL sign for Doctor." },
    { title: "Down", video: "./videos/DOWN.mp4", description: "ASL sign for Down." },
    { title: "Eat", video: "./videos/EAT.mp4", description: "ASL sign for Eat." },
    { title: "Family", video: "./videos/FAMILY.mp4", description: "ASL sign for Family." },
    { title: "Father", video: "./videos/FATHER.mp4", description: "ASL sign for Father." },
    { title: "Favorite", video: "./videos/FAVORITE.mp4", description: "ASL sign for Favorite." },
    { title: "Fine", video: "./videos/FINE.mp4", description: "ASL sign for Fine." },
    { title: "Friend", video: "./videos/FRIEND.mp4", description: "ASL sign for Friend." },
    { title: "Hello", video: "./videos/hello.mp4", description: "ASL sign for Hello." },
    { title: "Help", video: "./videos/HELP.mp4", description: "ASL sign for Help." },
    { title: "Home", video: "./videos/HOME.mp4", description: "ASL sign for Home." },
    { title: "Hope", video: "./videos/HOPE.mp4", description: "ASL sign for Hope." },
    { title: "Hug", video: "./videos/HUG.mp4", description: "ASL sign for Hug." },
    { title: "Hungry", video: "./videos/HUNGRY.mp4", description: "ASL sign for Hungry." },
    { title: "I(ME)", video: "./videos/I(ME).mp4", description: "ASL sign for I(ME)." },
    { title: "I Love You", video: "./videos/iloveyou.mp4", description: "ASL sign for I Love You." },
    { title: "Inside", video: "./videos/INSIDE.mp4", description: "ASL sign for Inside." },
    { title: "Join", video: "./videos/JOIN.mp4", description: "ASL sign for Join." },
    { title: "Know", video: "./videos/KNOW.mp4", description: "ASL sign for Know." },
    { title: "Listen", video: "./videos/LISTEN.mp4", description: "ASL sign for Listen." },
    { title: "Look", video: "./videos/LOOK.mp4", description: "ASL sign for Look." },
    { title: "Love", video: "./videos/LOVE.mp4", description: "ASL sign for Love." },
    { title: "Mad", video: "./videos/MAD.mp4", description: "ASL sign for Mad." },
    { title: "Mock", video: "./videos/MOCK.mp4", description: "ASL sign for Mock." },
    { title: "Mother", video: "./videos/MOTHER.mp4", description: "ASL sign for Mother." },
    { title: "Noon", video: "./videos/NOON.mp4", description: "ASL sign for Noon." },
    { title: "Nurse", video: "./videos/NURSE.mp4", description: "ASL sign for Nurse." },
    { title: "Okay", video: "./videos/OKAY.mp4", description: "ASL sign for Okay." },
    { title: "Pray", video: "./videos/PRAY.mp4", description: "ASL sign for Pray." },
    { title: "Rest", video: "./videos/REST.mp4", description: "ASL sign for Rest." },
    { title: "Right", video: "./videos/RIGHT.mp4", description: "ASL sign for Right." },
    { title: "Same", video: "./videos/SAME.mp4", description: "ASL sign for Same." },
    { title: "Show me", video: "./videos/SHOW_ME.mp4", description: "ASL sign for Show me." },
    { title: "Sit", video: "./videos/SIT.mp4", description: "ASL sign for Sit." },
    { title: "Stand", video: "./videos/STAND.mp4", description: "ASL sign for Stand." },
    { title: "Stop", video: "./videos/STOP.mp4", description: "ASL sign for Stop." },
    { title: "Think", video: "./videos/THINK.mp4", description: "ASL sign for Think." },
    { title: "Time", video: "./videos/TIME.mp4", description: "ASL sign for Time." },
    { title: "Time out", video: "./videos/TIME_OUT.mp4", description: "ASL sign for Time out." },
    { title: "Wait", video: "./videos/WAIT.mp4", description: "ASL sign for Wait." },
    { title: "Want", video: "./videos/WANT.mp4", description: "ASL sign for Want." },
    { title: "Water", video: "./videos/WATER.mp4", description: "ASL sign for Water." },
    { title: "Where", video: "./videos/WHERE.mp4", description: "ASL sign for Where." },
    { title: "Word", video: "./videos/WORD.mp4", description: "ASL sign for Word." },
    { title: "Wrong", video: "./videos/WRONG.mp4", description: "ASL sign for Wrong." },
    { title: "You", video: "./videos/YOU.mp4", description: "ASL sign for You." },
  ].sort((a, b) => a.title.localeCompare(b.title));

  // Renderer for clickable accordion list
  const renderList = (items) => (
    <div className="learn-list">
      {items.map((item, i) => (
        <div key={i} className="learn-item">
          <button
            onClick={() =>
              setSelectedItem(selectedItem === item.title ? null : item.title)
            }
            className="learn-item-button"
          >
            <span className="learn-item-title">
              {item.title}
            </span>
            <span className="learn-item-arrow">
              {selectedItem === item.title ? "▲" : "▼"}
            </span>
          </button>
          {selectedItem === item.title && (
            <div className="learn-item-content">
              <p className="learn-item-description">{item.description}</p>
              <video
                controls
                className="learn-video"
                src={item.video}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="learn-container">
      <h2 className="learn-title">
        Learn ASL
      </h2>
      <p className="learn-subtitle">
        Choose a category and explore ASL through words, letters, or numbers.
        Click an item to view its sign and description.
      </p>

      {/* Tabs */}
      <div className="learn-tabs">
        {["Words", "Letters", "Numbers"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setSelectedItem(null);
            }}
            className={`learn-tab ${activeTab === tab ? "active" : ""}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "Words" && renderList(words)}
      {activeTab === "Letters" && renderList(letters)}
      {activeTab === "Numbers" && renderList(numbers)}
    </div>
  );
}
