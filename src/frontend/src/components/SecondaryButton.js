import React from 'react';
import '../styles/components/SecondaryButton.css';

const SecondaryButton = ({ text, onClick }) => {
  return (
    <button className="secondary-button" onClick={onClick}>
      {text}
    </button>
  );
};

export default SecondaryButton;
