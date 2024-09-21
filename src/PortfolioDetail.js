import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory

function PortfolioDetail() {
  const [portfolio, setPortfolio] = useState({});
  const { id } = useParams();
  const navigate = useNavigate(); // useNavigate instead of useHistory

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/portfolios/${id}`)
      .then(response => {
        setPortfolio(response.data);
      })
      .catch(error => console.error('Error fetching portfolio:', error));
  }, [id]);

  const handleEdit = () => {
    // Implement edit functionality or navigate to edit page
    navigate(`/edit-portfolio/${id}`); // Use navigate for navigation
  };

  const handleBack = () => {
    navigate(-1); // Navigate back using navigate(-1)
  };

  return (
    <div>
      <h1>{portfolio.title}</h1>
      <p>{portfolio.description}</p>
      <div>
        <button onClick={handleEdit}>Edit</button>
        <button onClick={handleBack}>Go Back</button>
      </div>
    </div>
  );
}

export default PortfolioDetail;
