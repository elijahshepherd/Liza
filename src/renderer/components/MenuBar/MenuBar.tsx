import React from 'react';

export const MenuBar: React.FC = () => {
  return (
    <div className="menu-bar">
      <span className="menu-item">File</span>
      <span className="menu-item">Edit</span>
      <span className="menu-item">View</span>
      <span className="menu-item">Layer</span>
      <span className="menu-item">Filter</span>
      <span className="menu-item">Window</span>
      <span className="menu-item">Help</span>
    </div>
  );
};