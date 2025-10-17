export default function About() {
  return (
    <div className="about-container">
      <div className="about-main">
        <div className="about-header">
          <h1 className="about-title">About</h1>
          <div className="about-divider"></div>
        </div>
        
        <div className="about-content">
          <div className="about-card">
            <div className="about-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" fill="url(#about-gradient)"/>
                <defs>
                  <linearGradient id="about-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1"/>
                    <stop offset="100%" stopColor="#8b5cf6"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            
            <h2 className="about-subtitle">Our Mission</h2>
            <p className="about-text">
              This platform promotes sign language awareness and accessibility.
              It is designed to help beginners learn and practice American Sign
              Language (ASL) through interactive tutorials, a visual dictionary,
              and real-time gesture recognition.
            </p>
          </div>
          
          <div className="about-card">
            <div className="about-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="url(#heart-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="url(#heart-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="url(#heart-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="url(#heart-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="heart-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1"/>
                    <stop offset="100%" stopColor="#8b5cf6"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            
            <h2 className="about-subtitle">Building Bridges</h2>
            <p className="about-text">
              By fostering inclusivity and understanding, this app bridges the
              gap between the deaf community and the hearing world, making
              communication more accessible for everyone.
            </p>
          </div>
          
          <div className="about-card">
            <div className="about-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="url(#accessibility-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 14S9.5 16 12 16S16 14 16 14" stroke="url(#accessibility-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 9H9.01" stroke="url(#accessibility-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 9H15.01" stroke="url(#accessibility-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="accessibility-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1"/>
                    <stop offset="100%" stopColor="#8b5cf6"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            
            <h2 className="about-subtitle">Accessibility First</h2>
            <p className="about-text">
              We believe communication is a fundamental human right. Our platform
              ensures that everyone, regardless of hearing ability, can learn,
              connect, and thrive in our digital world.
            </p>
          </div>
        </div>
        
        <div className="about-footer">
          <div className="about-stats">
            <div className="stat-item">
              <div className="stat-number">1000+</div>
              <div className="stat-label">ASL Signs</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Available</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">Free</div>
              <div className="stat-label">Always</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
