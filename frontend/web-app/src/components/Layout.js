import React from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import './Layout.css';

const Layout = ({ children, className = '' }) => {
  return (
    <div className="layout">
      <Navigation />
      <main className={`main-content ${className}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
