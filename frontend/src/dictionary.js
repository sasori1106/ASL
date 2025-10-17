import { useState } from "react";
import { Link } from "react-router-dom";

export default function Dictionary() {
  const [search, setSearch] = useState("");

  // Letters
  const letters = [
    { title: "A", description: "ASL sign for the letter A." },
    { title: "B", description: "ASL sign for the letter B." },
    { title: "C", description: "ASL sign for the letter C." },
    { title: "D", description: "ASL sign for the letter D." },
    { title: "E", description: "ASL sign for the letter E." },
    { title: "F", description: "ASL sign for the letter F." },
    { title: "G", description: "ASL sign for the letter G." },
    { title: "H", description: "ASL sign for the letter H." },
    { title: "I", description: "ASL sign for the letter I." },
    { title: "J", description: "ASL sign for the letter J." },
    { title: "K", description: "ASL sign for the letter K." },
    { title: "L", description: "ASL sign for the letter L." },
    { title: "M", description: "ASL sign for the letter M." },
    { title: "N", description: "ASL sign for the letter N." },
    { title: "O", description: "ASL sign for the letter O." },
    { title: "P", description: "ASL sign for the letter P." },
    { title: "Q", description: "ASL sign for the letter Q." },
    { title: "R", description: "ASL sign for the letter R." },
    { title: "S", description: "ASL sign for the letter S." },
    { title: "T", description: "ASL sign for the letter T." },
    { title: "U", description: "ASL sign for the letter U." },
    { title: "V", description: "ASL sign for the letter V." },
    { title: "W", description: "ASL sign for the letter W." },
    { title: "X", description: "ASL sign for the letter X." },
    { title: "Y", description: "ASL sign for the letter Y." },
    { title: "Z", description: "ASL sign for the letter Z." },
  ];

  // Numbers
  const numbers = [
    { title: "1", description: "ASL sign for the number 1." },
    { title: "2", description: "ASL sign for the number 2." },
    { title: "3", description: "ASL sign for the number 3." },
    { title: "4", description: "ASL sign for the number 4." },
    { title: "5", description: "ASL sign for the number 5." },
    { title: "6", description: "ASL sign for the number 6." },
    { title: "7", description: "ASL sign for the number 7." },
    { title: "8", description: "ASL sign for the number 8." },
    { title: "9", description: "ASL sign for the number 9." },
    { title: "10", description: "ASL sign for the number 10." },
  ];

  // Words
  const words = [
     { title: "Bed", video: "/videos/BED.mp4", description: "ASL sign for Bed." },
    { title: "Calm Down", video: "/videos/CALM DOWN.mp4", description: "ASL sign for Calm Down." },
    { title: "Church", video: "/videos/CHURCH.mp4", description: "ASL sign for Church." },
    { title: "Doctor", video: "/videos/DOCTOR.mp4", description: "ASL sign for Doctor." },
    { title: "Down", video: "/videos/DOWN.mp4", description: "ASL sign for Down." },
    { title: "Eat", video: "/videos/EAT.mp4", description: "ASL sign for Eat." },
    { title: "Family", video: "/videos/FAMILY.mp4", description: "ASL sign for Family." },
    { title: "Father", video: "/videos/FATHER.mp4", description: "ASL sign for Father." },
    { title: "Favorite", video: "/videos/FAVORITE.mp4", description: "ASL sign for Favorite." },
    { title: "Fine", video: "/videos/FINE.mp4", description: "ASL sign for Fine." },
    { title: "Friend", video: "/videos/FRIEND.mp4", description: "ASL sign for Friend." },
    { title: "Hello", video: "/videos/HELLO.mp4", description: "ASL sign for Hello." },
    { title: "Help", video: "/videos/HELP.mp4", description: "ASL sign for Help." },
    { title: "Home", video: "/videos/HOME.mp4", description: "ASL sign for Home." },
    { title: "Hope", video: "/videos/HOPE.mp4", description: "ASL sign for Hope." },
    { title: "Hug", video: "/videos/HUG.mp4", description: "ASL sign for Hug." },
    { title: "Hungry", video: "/videos/HUNGRY.mp4", description: "ASL sign for Hungry." },
    { title: "I(ME)", video: "/videos/I(ME).mp4", description: "ASL sign for I(ME)." },
    { title: "I Hate You", video: "/videos/IHATEYOU.mp4", description: "ASL sign for I Hate You." },
    { title: "I Love You", video: "/videos/iloveyou.mp4", description: "ASL sign for I Love You." },
    { title: "Inside", video: "/videos/INSIDE.mp4", description: "ASL sign for Inside." },
    { title: "Join", video: "/videos/JOIN.mp4", description: "ASL sign for Join." },
    { title: "Know", video: "/videos/KNOW.mp4", description: "ASL sign for Know." },
    { title: "Listen", video: "/videos/LISTEN.mp4", description: "ASL sign for Listen." },
    { title: "Look", video: "/videos/LOOK.mp4", description: "ASL sign for Look." },
    { title: "Love", video: "/videos/LOVE.mp4", description: "ASL sign for Love." },
    { title: "Mad", video: "/videos/MAD.mp4", description: "ASL sign for Mad." },
    { title: "Mock", video: "/videos/MOCK.mp4", description: "ASL sign for Mock." },
    { title: "Mother", video: "/videos/MOTHER.mp4", description: "ASL sign for Mother." },
    { title: "No", video: "/videos/NO.mp4", description: "ASL sign for No." },
    { title: "Noon", video: "/videos/NOON.mp4", description: "ASL sign for Noon." },
    { title: "Nurse", video: "/videos/NURSE.mp4", description: "ASL sign for Nurse." },
    { title: "Okay", video: "/videos/OKAY.mp4", description: "ASL sign for Okay." },
    { title: "Pray", video: "/videos/PRAY.mp4", description: "ASL sign for Pray." },
    { title: "Rest", video: "/videos/REST.mp4", description: "ASL sign for Rest." },
    { title: "Right", video: "/videos/RIGHT.mp4", description: "ASL sign for Right." },
    { title: "Same", video: "/videos/SAME.mp4", description: "ASL sign for Same." },
    { title: "Show me", video: "/videos/SHOW_ME.mp4", description: "ASL sign for Show me." },
    { title: "Sit", video: "/videos/SIT.mp4", description: "ASL sign for Sit." },
    { title: "Stand", video: "/videos/STAND.mp4", description: "ASL sign for Stand." },
    { title: "Stop", video: "/videos/STOP.mp4", description: "ASL sign for Stop." },
    { title: "Think", video: "/videos/THINK.mp4", description: "ASL sign for Think." },
    { title: "Time", video: "/videos/TIME.mp4", description: "ASL sign for Time." },
    { title: "Time out", video: "/videos/TIME_OUT.mp4", description: "ASL sign for Time out." },
    { title: "Wait", video: "/videos/WAIT.mp4", description: "ASL sign for Wait." },
    { title: "Want", video: "/videos/WANT.mp4", description: "ASL sign for Want." },
    { title: "Water", video: "/videos/WATER.mp4", description: "ASL sign for Water." },
    { title: "Where", video: "/videos/WHERE.mp4", description: "ASL sign for Where." },
    { title: "Word", video: "/videos/WORD.mp4", description: "ASL sign for Word." },
    { title: "Wrong", video: "/videos/WRONG.mp4", description: "ASL sign for Wrong." },
    { title: "You", video: "/videos/YOU.mp4", description: "ASL sign for You." },
  ].sort((a, b) => a.title.localeCompare(b.title));

  // Merge all
  const allItems = [
    ...words.map((item) => ({ ...item, category: "Word" })),
    ...letters.map((item) => ({ ...item, category: "Letter" })),
    ...numbers.map((item) => ({ ...item, category: "Number" })),
  ];

  // Highlight search keyword
  const highlightText = (text, keyword) => {
    if (!keyword) return text;
    const regex = new RegExp(`(${keyword})`, "gi");
    return text.split(regex).map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="font-bold text-indigo-600">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // Filter results
  const filteredItems = search
    ? allItems.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <div className="dictionary-container">
      <div className="dictionary-main">
        <div className="dictionary-header">
          {/* <Link to="/" className="back-link">
            <button className="back-btn">← Back to App</button>
          </Link> */}
          <h1 className="dictionary-title">ASL Dictionary</h1>
          <p className="dictionary-subtitle">
            Search words, letters, or numbers to see their ASL descriptions.
          </p>
        </div>

        {/* Search Bar */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search signs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        {/* If searching, show filtered results only */}
        {search ? (
          <div className="search-results">
            {filteredItems.length > 0 ? (
              filteredItems.map((item, i) => (
                <div key={i} className="search-result-item">
                  <h3 className="search-result-title">
                    {highlightText(item.title, search)}
                  </h3>
                  <div className="search-result-category">
                    {item.category}
                  </div>
                  <p className="search-result-description">
                    {highlightText(item.description, search)}
                  </p>
                </div>
              ))
            ) : (
              <div className="search-result-item">
                <p style={{ textAlign: 'center', color: '#666', fontSize: '1.1rem' }}>
                  No results found for "{search}"
                </p>
              </div>
            )}
          </div>
        ) : (
          // If no search, show categories side by side
          <div className="categories-grid">
            {/* Letters */}
            <section className="category-section">
              <h3 className="category-title">Letters</h3>
              <div className="category-list">
                {letters.map((item, i) => (
                  <div key={i} className="category-item">
                    <span className="item-title">{item.title}</span>
                    <span className="item-description">{item.description}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Numbers */}
            <section className="category-section">
              <h3 className="category-title">Numbers</h3>
              <div className="category-list">
                {numbers.map((item, i) => (
                  <div key={i} className="category-item">
                    <span className="item-title">{item.title}</span>
                    <span className="item-description">{item.description}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Words */}
            <section className="category-section">
              <h3 className="category-title">Words</h3>
              <div className="category-list">
                {words.map((item, i) => (
                  <div key={i} className="category-item">
                    <span className="item-title">{item.title}</span>
                    <span className="item-description">{item.description}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
