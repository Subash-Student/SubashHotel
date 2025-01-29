import React from 'react';
import "./popupmodal.css";

const PopupModal = ({ isImage, isAudio, imageUrl, audioUrl, closeModal }) => {
  // Close modal function
  const handleClose = () => {
    closeModal(); // Close the modal when clicked on the close button
  };

  return (
    <div className="unique-popup-modal">
      <div className="unique-modal-content">
        <span className="unique-close-btn" onClick={handleClose}>×</span>

        {isImage && (
          <div className="unique-image-container">
            <img src={imageUrl} alt="Enlarged View" className="unique-popup-image" />
          </div>
        )}

        {isAudio && (
          <div className="unique-audio-container">
            <audio controls className="unique-popup-audio">
              <source src={audioUrl} />
            </audio>
          </div>
        )}
      </div>
    </div>
  );
};

export default PopupModal;
