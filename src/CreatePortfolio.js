import React, { useState, useRef, useEffect } from 'react';
import './styles.css';
import { FaPlus, FaCamera, FaLink } from 'react-icons/fa';

const CreatePortfolio = () => {
  const editorRef = useRef(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarStyle, setToolbarStyle] = useState({});
  const [selectedRange, setSelectedRange] = useState(null); // Save the current cursor range
  const [showMediaToolbar, setShowMediaToolbar] = useState(false);

  const [title, setTitle] = useState('Add your title here');
  const [description, setDescription] = useState('Description');
  const [contentPlaceholder, setContentPlaceholder] = useState('Start creating your content here...');

  const [fontSize, setFontSize] = useState(3); // Default font size

  // Save the current cursor position when text is selected
  const handleSelection = () => {
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setToolbarStyle({
        top: rect.top - 60 + window.scrollY,
        left: rect.left + rect.width / 2 - 100 + window.scrollX,
      });
      setSelectedRange(range); // Save the range for placing images later
      setShowToolbar(true);
    } else {
      setShowToolbar(false);
    }
  };

  // Apply formatting commands
  const applyCommand = (command, value = null) => {
    if (selectedRange) {
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(selectedRange);
    }
    document.execCommand(command, false, value);
    setShowToolbar(false);
  };

  // Insert content (image) at the cursor's position
  const insertContentAtCursor = (element) => {
    if (selectedRange) {
      selectedRange.insertNode(element);
      const newParagraph = document.createElement('p');
      newParagraph.innerHTML = '<br>'; // Add a new paragraph to continue typing after the image
      element.after(newParagraph); // Ensures the new line is placed after the image
      setSelectedRange(null); // Reset the selection
    } else if (editorRef.current) {
      editorRef.current.appendChild(element);
    }
  };

  // Handle image upload and place image at the cursor's position
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = document.createElement('img');
        img.src = reader.result;
        img.style.width = '100%'; // Resize image to fit the content width
        insertContentAtCursor(img); // Place the image at the cursor position
      };
      reader.readAsDataURL(file);
    }
    setShowMediaToolbar(false); // Close media toolbar after upload
  };

  // Detect if text is deselected to hide the toolbar
  const handleDeselect = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setShowToolbar(false); // Hide the toolbar if nothing is selected
    }
  };

  // Save cursor position when the media toolbar is opened, to place images at the right spot
  const toggleMediaToolbar = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      setSelectedRange(selection.getRangeAt(0)); // Save the cursor position before toggling the toolbar
    }
    setShowMediaToolbar(!showMediaToolbar);
  };

  // Listen for keyboard events and mouseup to detect selection
  useEffect(() => {
    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('keyup', handleSelection);
    document.addEventListener('selectionchange', handleDeselect); // Detect text deselection

    return () => {
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('keyup', handleSelection);
      document.removeEventListener('selectionchange', handleDeselect);
    };
  }, []);

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
        style={{ minHeight: '100px' }}
      >
        {contentPlaceholder}
      </div>

      {/* Text editing toolbar */}
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
            <button onClick={() => applyCommand('fontSize', 3)}>
              <span style={{ color: 'white' }}>A-</span>
            </button>
            <button onClick={() => applyCommand('fontSize', 5)}>
              <span style={{ color: 'white' }}>A+</span>
            </button>
          </div>
          <button onClick={() => applyCommand('formatBlock', '<blockquote>')}>
            <span style={{ color: 'white' }}>“</span>
          </button>
        </div>
      )}

      {/* Plus button */}
      <div className="plus-button-container">
        <button className="plus-button" onClick={toggleMediaToolbar}>
          <FaPlus />
        </button>
      </div>

      {/* Media toolbar */}
      {showMediaToolbar && (
        <div className="media-toolbar">
          <label htmlFor="imageInput">
            <FaCamera className="media-icon" />
          </label>
          <input
            type="file"
            id="imageInput"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
          <FaLink className="media-icon" /> {/* Link embedding icon (future) */}
        </div>
      )}
    </div>
  );
};

export default CreatePortfolio;
