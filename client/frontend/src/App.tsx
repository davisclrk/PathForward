import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import PlaidLinkButton from './Components/Link';

const App: React.FC = () => {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLinkToken = async () => {
      try {
        setIsLoading(true);
        const requestBody = {
          userId: '66f817ec7b6bd7bc7d69ccc0'
        };
        const response = await fetch("http://localhost:4000/api/createLinkToken", { method: "POST", headers: {
          'Content-Type': 'application/json'
        }, body: JSON.stringify(requestBody) });
        if (response.status === 200) {
          const data = await response.json();
          setLinkToken(data.link_token);
        } else {
          console.log("Error fetching link token not catch");
        }
      } catch (error) {
        console.error('Error fetching link token:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLinkToken();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            <p>linkToken: {linkToken}</p>
            {linkToken && <PlaidLinkButton linkToken={linkToken} />}
          </>
        )}
      </header>
    </div>
  );
}

export default App;