import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './dictionary.css';
import './home.css';
import './topbar.css';
import './learn.css';
import './about.css';
import App from './App';
import Dictionary from './dictionary';
import Home from './home';
import Learn from './learn';
import About from './about';
import Topbar from './topbar';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Layout component with Topbar
const Layout = ({ children }) => (
  <div>
    <Topbar />
    <div style={{ paddingTop: '70px' }}>
      {children}
    </div>
  </div>
);

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/app" element={<Layout><App /></Layout>} />
        <Route path="/dictionary" element={<Layout><Dictionary /></Layout>} />
        <Route path="/learn" element={<Layout><Learn /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
      </Routes>
    </Router>
  </React.StrictMode>
);