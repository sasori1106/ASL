import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home-container">
      <div className="home-main">
        {/* Hero Section with Background Image */}
        <section className="hero-section">
          <img
            src="https://img.freepik.com/free-photo/group-people-using-sign-language_23-2149336899.jpg"
            alt="ASL Hero Background"
            className="hero-image"
          />
          <div className="hero-overlay"></div>

          <div className="hero-content">
            <h1 className="hero-title">
              Welcome to the ASL Learning Platform
            </h1>
            <p className="hero-subtitle">
              Learn, explore, and practice American Sign Language (ASL) with
              interactive tutorials, a visual dictionary, and real-time gesture
              recognition. This platform empowers the deaf and non-hearing
              community while bridging connections with everyone.
            </p>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="features-section">
          <div className="features-grid">
            {[
              {
                title: "Dictionary",
                desc: "Browse static ASL words with images",
                link: "/dictionary",
                img: "https://img.freepik.com/free-vector/dictionary-concept-illustration_114360-3898.jpg",
              },
              {
                title: "Learn",
                desc: "Watch tutorials for words, letters, and numbers",
                link: "/learn",
                img: "https://img.freepik.com/free-vector/online-education-concept-illustration_114360-6276.jpg",
              },
              {
                title: "Practice",
                desc: "Use your webcam for real-time ASL practice",
                link: "/app",
                img: "https://img.freepik.com/free-vector/ai-technology-concept_23-2148485244.jpg",
              },
              {
                title: "About",
                desc: "Discover the value of sign language",
                link: "/about",
                img: "https://img.freepik.com/free-vector/community-concept-illustration_114360-2625.jpg",
              },
            ].map((item, i) => (
              <Link
                key={i}
                to={item.link}
                className="feature-card"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="feature-image"
                />
                <h2 className="feature-title">{item.title}</h2>
                <p className="feature-description">{item.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Awareness Section */}
        <section className="awareness-section">
          <div className="awareness-grid">
            <img
              src="https://img.freepik.com/free-photo/people-using-sign-language_23-2149336902.jpg"
              alt="Sign language community"
              className="awareness-image"
            />
            <div className="awareness-content">
              <h2>Why Learn ASL?</h2>
              <p>
                American Sign Language (ASL) is a powerful way to communicate,
                fostering inclusivity and understanding for the deaf and
                non-hearing community. By learning ASL, you open doors to meaningful
                connections, accessibility, and deeper respect for diversity.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
