import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import PlaidLinkButton from './Components/Link';
import AuthScreen from './Components/Login';

const App: React.FC = () => {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const fetchLinkToken = async () => {
      try {
        setIsLoading(true);
        const userId = localStorage.getItem('userId');
        const requestBody = {
          userId: userId
        };
        const response = await fetch("http://localhost:4000/api/createLinkToken", { method: "POST", headers: {
          'Content-Type': 'application/json'
        }, body: JSON.stringify(requestBody) });
        if (response.status === 200) {
          const data = await response.json();
          setLinkToken(data.link_token);
          console.log("linkToken: ", data.link_token);
        } else {
          console.log("Error fetching link token not catch");
        }
      } catch (error) {
        console.error('Error fetching link token:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchLinkToken();
    }
  }, [isAuthenticated]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    // only show plaid link after create account. we can assume users who login have already linked their plaid accounts in the past
  };
  
  const getTransactions = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const requestBody = {
          userId: userId
        };
        console.log("getting transactions");
        const response = await fetch("http://localhost:4000/api/getTransactions", { method: "POST", headers: {
          'Content-Type': 'application/json'
        }, body: JSON.stringify(requestBody) });
        console.log("response: ", response);
        if (response.status === 200) {
          const data = await response.json();
          console.log("transactions: ", data);
          setTransactions(data);
        } else {
          console.log("Error fetching transactions");
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    }
  
    return (
      <div>
        {isAuthenticated ? (
          <>
            <PlaidLinkButton linkToken={linkToken!} />
            <button onClick={() => getTransactions()}>Get transaction history</button>
            <div>
            {transactions.length > 0 ? (
              <ul>
                {transactions.map((transaction, index) => (
                  <li key={index}>
                    <p>{transaction.name}</p>
                    <p>{transaction.amount}</p>
                    <p>{transaction.date}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No transactions found</p>
            )}
          </div>
          </>
        ) : (
          <AuthScreen onLoginSuccess={handleLoginSuccess} />
        )}
      </div>
    );
  }
  
export default App;
