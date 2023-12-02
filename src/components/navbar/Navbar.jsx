import React from 'react'
import './navbar.css'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <img src="" alt="" />
        <h2>Admin Dashboard</h2>
      </div>
      <div className="links">
        <a href="#" className="item">
          Home
        </a>
        <a href="#" className="item">
          About
        </a>
        <a href="#" className="item">
          Contact Us
        </a>
      </div>
    </nav>
  );
}

export default Navbar
