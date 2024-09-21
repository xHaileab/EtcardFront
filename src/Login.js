import React, { useEffect } from 'react';

function Login() {
    useEffect(() => {
        // Create script element and set properties
        const script = document.createElement('script');
        script.src = 'https://telegram.org/js/telegram-widget.js?7';
        script.setAttribute('data-telegram-login', 'EtcardBot'); // Replace 'your_bot_username' with your bot username
        script.setAttribute('data-size', 'large');
        script.setAttribute('data-radius', '10');
        script.setAttribute('data-auth-url', 'http://localhost:5000/authenticate'); // Ensure this points to your backend
        script.setAttribute('data-request-access', 'write');
        script.async = true;

        // Append the script to the body
        document.body.appendChild(script);

        // Clean up the script when component unmounts
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Please Log In</h1>
            <p>To access your portfolios, please log in using your Telegram account:</p>
        </div>
    );
}

export default Login;
