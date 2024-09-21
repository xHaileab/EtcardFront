import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Replace useHistory with useNavigate

function CreatePortfolio() {
  const [content, setContent] = useState('');
  const navigate = useNavigate();  // use useNavigate instead of useHistory

  const handlePublish = () => {
    axios.post(`${process.env.REACT_APP_API_URL}/portfolios`, { content })
      .then(() => {
        navigate('/');  // use navigate with the path as argument
      })
      .catch(error => console.error('Error creating portfolio:', error));
  };

  return (
    <div>
      <h1>Create New Portfolio</h1>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type your portfolio content here..."
      />
      <button onClick={handlePublish}>Publish</button>
    </div>
  );
}

export default CreatePortfolio;
