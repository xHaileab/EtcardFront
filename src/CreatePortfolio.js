import React, { useState } from 'react';
import axios from 'axios';

function CreatePortfolio() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [items, setItems] = useState([]);

    // Function to handle the addition of new content items
    const handleAddItem = () => {
        const newItem = { content };
        setItems([...items, newItem]);
        setContent(''); // Clear input after adding
    };

    // Function to publish the portfolio
    const handlePublish = () => {
        axios.post('http://localhost:5000/portfolios', {
            title,
            description,
            content: JSON.stringify(items)  // Send all items as a single content string
        })
        .then(response => {
            alert('Portfolio published successfully!');
            setTitle('');
            setDescription('');
            setItems([]);
        })
        .catch(error => {
            console.error('Error publishing portfolio:', error);
            alert('Failed to publish portfolio.');
        });
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Create Portfolio</h1>
            <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Title"
                style={{ display: 'block', margin: '10px 0', width: '300px' }}
            />
            <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Description"
                style={{ display: 'block', margin: '10px 0', width: '300px', height: '100px' }}
            />
            <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Add new content item"
                style={{ display: 'block', margin: '10px 0', width: '300px', height: '100px' }}
            />
            <button onClick={handleAddItem} style={{ marginRight: '10px' }}>+ Add Item</button>
            <button onClick={handlePublish}>Publish</button>

            <div style={{ marginTop: '20px' }}>
                <h2>Preview</h2>
                {items.map((item, index) => (
                    <div key={index} style={{ margin: '10px 0', border: '1px solid #ccc', padding: '10px' }}>
                        {item.content}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CreatePortfolio;
