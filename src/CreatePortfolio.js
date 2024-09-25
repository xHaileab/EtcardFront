import React, { useState, useRef, useEffect } from 'react';
import './styles.css';
import { FaPlus, FaCamera, FaLink, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa'; // Import social icons
import axios from 'axios'; // Axios for API calls

const CreatePortfolio = () => {
  const editorRef = useRef(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarStyle, setToolbarStyle] = useState({});
  const [selectedRange, setSelectedRange] = useState(null); // Save the current cursor range
  const [showMediaToolbar, setShowMediaToolbar] = useState(false);
  const [showSocialPopup, setShowSocialPopup] = useState(false); // State for the social media popup
  const [socialLinks, setSocialLinks] = useState([]); // Store the list of social links
  const [currentLinks, setCurrentLinks] = useState([{ platform: '', url: '' }]); // Store multiple links
  const [qrCodeUrl, setQrCodeUrl] = useState(null); // State to hold the generated QR code URL
  const [userId] = useState('615c5b4a2f4b5a4d4483dfea'); // Example user ID, replace with actual user data
  const [title, setTitle] = useState('Add your title here'); // Initial placeholder text
  const [description, setDescription] = useState('Description'); // Initial placeholder text
  const [contentPlaceholder, setContentPlaceholder] = useState('Start creating your content here...');

  // Handle text selection to show toolbar
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

  // Insert content (social link or image) at the cursor's position
  const insertContentAtCursor = (element) => {
    if (selectedRange) {
      selectedRange.insertNode(element);
      const newParagraph = document.createElement('p');
      newParagraph.innerHTML = '<br>'; // Add a new paragraph to continue typing after the element
      element.after(newParagraph); // Ensures the new line is placed after the inserted element
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

  // Handle form submission to save portfolio and generate QR code
  const handlePublish = async () => {
    const content = editorRef.current.innerHTML; // Get the HTML content from the editor

    // Validate title and description before sending
    if (!title || !description || title === 'Add your title here' || description === 'Description') {
      alert('Title and Description are required.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/portfolios', {
        userId,
        title,
        description,
        content
      });

      // Set the generated QR code URL from the response
      setQrCodeUrl(response.data.qrCodeUrl);
    } catch (error) {
      console.error('Error publishing portfolio:', error);
      alert('Failed to publish portfolio.');
    }
  };

  // Insert social media links and render them
  const handleAddSocialLinks = () => {
    const validLinks = currentLinks.filter(link => link.platform && link.url); // Ensure we only add valid links
    setSocialLinks([...socialLinks, ...validLinks]);
    setCurrentLinks([{ platform: '', url: '' }]); // Reset the input fields
    setShowSocialPopup(false); // Close popup after adding
  };

  // Handle adding more social links dynamically
  const addMoreSocialLinks = () => {
    setCurrentLinks([...currentLinks, { platform: '', url: '' }]);
  };

  // Get the appropriate social media icon component
  const getSocialIconComponent = (platform) => {
    switch (platform) {
      case 'facebook':
        return <FaFacebook className="social-icon" />;
      case 'twitter':
        return <FaTwitter className="social-icon" />;
      case 'linkedin':
        return <FaLinkedin className="social-icon" />;
      default:
        return null;
    }
  };

  // Handle making social media icons clickable by wrapping them in an anchor element
  const renderSocialLinks = () => {
    return socialLinks.map((link, index) => (
      <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }} contentEditable={false}>
        {getSocialIconComponent(link.platform)}
      </a>
    ));
  };

  // Detect if text is deselected to hide the toolbar
  const handleDeselect = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setShowToolbar(false); // Hide the toolbar if nothing is selected
    }
  };

  // Save cursor position when the media toolbar is opened
  const toggleMediaToolbar = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      setSelectedRange(selection.getRangeAt(0)); // Save the cursor position before toggling the toolbar
    }
    setShowMediaToolbar(!showMediaToolbar);
  };

  // Custom input handler to prevent reversing of the title and description
  const handleCustomInput = (e, type) => {
    const value = e.currentTarget.textContent;

    if (type === 'title') {
      setTitle(value); // Only update title on user input
    } else if (type === 'description') {
      setDescription(value); // Only update description on user input
    }
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
        ref={(el) => {
          if (el && title === 'Add your title here') el.textContent = 'Add your title here';
        }}
        onFocus={(e) => {
          if (e.currentTarget.textContent === 'Add your title here') {
            e.currentTarget.textContent = ''; // Clear placeholder on focus
          }
        }}
        onBlur={(e) => {
          if (!e.currentTarget.textContent.trim()) {
            e.currentTarget.textContent = 'Add your title here'; // Restore placeholder if empty
          } else {
            setTitle(e.currentTarget.textContent.trim()); // Update title
          }
        }}
      />
  
      {/* Description input */}
      <div
        className="description"
        contentEditable
        suppressContentEditableWarning
        ref={(el) => {
          if (el && description === 'Description') el.textContent = 'Description';
        }}
        onFocus={(e) => {
          if (e.currentTarget.textContent === 'Description') {
            e.currentTarget.textContent = ''; // Clear placeholder on focus
          }
        }}
        onBlur={(e) => {
          if (!e.currentTarget.textContent.trim()) {
            e.currentTarget.textContent = 'Description'; // Restore placeholder if empty
          } else {
            setDescription(e.currentTarget.textContent.trim()); // Update description
          }
        }}
      />

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

        {/* Render social media links */}
        {renderSocialLinks()}
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
          <FaLink className="media-icon" onClick={() => setShowSocialPopup(true)} /> {/* Social Media Link */}
        </div>
      )}

      {/* Social Media Popup */}
      {showSocialPopup && (
        <div className="social-popup">
          <h3>Social Media Links</h3>
          {currentLinks.map((link, index) => (
            <div key={index} className="social-input">
              <select
                value={link.platform}
                onChange={(e) => {
                  const newLinks = [...currentLinks];
                  newLinks[index].platform = e.target.value;
                  setCurrentLinks(newLinks);
                }}
              >
                <option value="">Select Platform</option>
                <option value="facebook">Facebook</option>
                <option value="twitter">Twitter</option>
                <option value="linkedin">LinkedIn</option>
              </select>
              <input
                type="text"
                placeholder="Enter URL"
                value={link.url}
                onChange={(e) => {
                  const newLinks = [...currentLinks];
                  newLinks[index].url = e.target.value;
                  setCurrentLinks(newLinks);
                }}
              />
            </div>
          ))}
          <button onClick={addMoreSocialLinks}>+ Add another link</button>
          <button onClick={handleAddSocialLinks}>Set Social Links</button>
        </div>
      )}

      {/* Publish button */}
      <div className="publish-container">
        <button className="publish-button" onClick={handlePublish}>Publish</button>
      </div>

      {/* QR Code Popup */}
      {qrCodeUrl && (
        <div className="qr-code-popup">
          <h3>Your Portfolio QR Code</h3>
          <img src={qrCodeUrl} alt="Portfolio QR Code" />
          <p>Scan the QR code to view your portfolio.</p>
        </div>
      )}
    </div>
  );
};

export default CreatePortfolio;
