import React, { useState, useRef } from 'react';
import './Styles.css';

const CreatePortfolio = () => {
  const editorRef = useRef(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarStyle, setToolbarStyle] = useState({});
  const [selectionRange, setSelectionRange] = useState(null);

  const [title, setTitle] = useState('Add your title here');
  const [description, setDescription] = useState('Description');
  const [contentPlaceholder, setContentPlaceholder] = useState('Start creating your content here...');

  const [fontSize, setFontSize] = useState(3); // Default font size

  // Handle text selection to show toolbar
  const handleSelection = () => {
    const selection = window.getSelection();
    if (!selection.isCollapsed) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setToolbarStyle({
        top: rect.top - 50 + window.scrollY,
        left: rect.left + rect.width / 2 - 100 + window.scrollX,
      });
      setSelectionRange(range);
      setShowToolbar(true);
    } else {
      setShowToolbar(false);
    }
  };

  // Apply formatting commands
  const applyCommand = (command, value = null) => {
    if (selectionRange) {
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(selectionRange);
    }
    document.execCommand(command, false, value);
    setShowToolbar(false);
  };

  // Adjust font size based on user input
  const adjustFontSize = (size) => {
    setFontSize(size);
    applyCommand('fontSize', size);
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = document.createElement('img');
      img.src = reader.result;
      img.style.width = '100%'; // Resize image to fit the content width
      editorRef.current.appendChild(img);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="portfolio-container">
      {/* Title input */}
      <div
        className="title"
        contentEditable
        suppressContentEditableWarning
        onFocus={() => setTitle('')}
        onBlur={(e) => !e.target.textContent && setTitle('Add your title here')}
      >
        {title}
      </div>

      {/* Description input */}
      <div
        className="description"
        contentEditable
        suppressContentEditableWarning
        onFocus={() => setDescription('')}
        onBlur={(e) => !e.target.textContent && setDescription('Description')}
      >
        {description}
      </div>

      {/* Content editor */}
      <div
        className="editor"
        contentEditable
        suppressContentEditableWarning
        ref={editorRef}
        onFocus={() => setContentPlaceholder('')}
        onBlur={(e) => !e.target.textContent && setContentPlaceholder('Start creating your content here...')}
        onMouseUp={handleSelection}
        onKeyUp={handleSelection}
      >
        {contentPlaceholder}
      </div>

      {/* Toolbar */}
      {showToolbar && (
        <div className="toolbar" style={toolbarStyle}>
          <button onClick={() => applyCommand('bold')}>
            <b style={{ color: 'white' }}>B</b>
          </button>
          <button onClick={() => applyCommand('italic')}>
            <i style={{ color: 'white' }}>I</i>
          </button>
          <button onClick={() => applyCommand('underline')}>
            <u style={{ color: 'white' }}>U</u>
          </button>
          <div className="font-size-adjust">
            <button onClick={() => adjustFontSize(fontSize - 1)}>
              <span style={{ color: 'white' }}>A-</span>
            </button>
            <button onClick={() => adjustFontSize(fontSize + 1)}>
              <span style={{ color: 'white' }}>A+</span>
            </button>
          </div>
          <button onClick={() => applyCommand('formatBlock', '<blockquote>')}>
            <span style={{ color: 'white' }}>“</span>
          </button>
        </div>
      )}

      {/* Image upload */}
      <div className="image-upload">
        <label htmlFor="imageInput">
          <span role="img" aria-label="camera" className="camera-icon">
            📷
          </span>
        </label>
        <input
          type="file"
          id="imageInput"
          accept="image/*"
          onChange={handleImageUpload}
        />
      </div>
    </div>
  );
};

export default CreatePortfolio;
