import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function HomePage() {
  const [portfolios, setPortfolios] = useState([]);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get(`${process.env.REACT_APP_API_URL}/user/profile`) // Adjust endpoint as needed
      .then(response => {
        setUsername(response.data.username);
        setPortfolios(response.data.portfolios);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Welcome, {username}!</h1>
      <div>
        <h2>Your Portfolios:</h2>
        {portfolios.length > 0 ? (
          portfolios.map(portfolio => (
            <div key={portfolio._id}>
              <Link to={`/portfolio/${portfolio._id}`}>
                <h3>{portfolio.title}</h3>
              </Link>
            </div>
          ))
        ) : (
          <p>No portfolios found.</p>
        )}
        <Link to="/create">
          <button>Create Portfolio</button>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
