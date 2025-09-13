import React from 'react';
import './PrimaryButton.css';

const PrimaryButton = ({ text, onClick }) => {
  return (
    <button className="primary-button" onClick={onClick}>
      {text}
    </button>
  );
};

export default PrimaryButton;
