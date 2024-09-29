import React, { useState, useEffect } from 'react';
import Navbar from './Components/navbar';
import PlaidLinkButton from './Components/Link';
import AuthScreen from './Components/Login';
import './App.css';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [categorizedSpending, setCategorizedSpending] = useState<any[]>([]);
  const [showGoalInput, setShowGoalInput] = useState(false);
  const [goal, setGoal] = useState('');
  const [goals, setGoals] = useState<any[]>([]);

  useEffect(() => {
    getGoals();
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
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

    const categorizeTransactions = async (transactions: any[]) => {
      try {
        const userId = localStorage.getItem('userId');
        const requestBody = {
          userId: userId,
          transactions: transactions
        };
        console.log("categorizing transactions");
        const response = await fetch("http://localhost:4000/api/categorizeTransactions", { method: "POST", headers: {
          'Content-Type': 'application/json'
        }, body: JSON.stringify(requestBody) });
        console.log("response: ", response);
        if (response.status === 200) {
          const data = await response.json();
          setCategorizedSpending(data);
          console.log("categorized transactions: ", data);
        } else {
          console.log("Error categorizing transactions");
        }
      } catch (error) {
        console.error('Error categorizing transactions:', error);
      }
    }

    const handleAddGoal = async () => {
      const userId = localStorage.getItem('userId');
      const requestBody = {
        userId: userId,
        goal: goal
      };
      const response = await fetch("http://localhost:4000/api/addGoal", { method: "POST", headers: {
        'Content-Type': 'application/json'
      }, body: JSON.stringify(requestBody) });
      console.log("response: ", response);
      if (response.status === 200) {
        const data = await response.json();
        getGoals();
      } else {
        console.log("Error categorizing transactions");
      }

      console.log('Goal added:', goal);
      setGoal('');
      setShowGoalInput(false);
    };

    const handleDeleteGoal = async (goal: string) => {
      const userId = localStorage.getItem('userId');
      const requestBody = {
        userId: userId,
        goal: goal
      };
      const response = await fetch("http://localhost:4000/api/deleteGoal", { method: "POST", headers: {
        'Content-Type': 'application/json'
      }, body: JSON.stringify(requestBody) });
      console.log("response: ", response);
      if (response.status === 200) {
        const data = await response.json();
        getGoals();
      } else {
        console.log("Error deleting goal");
      }
    }

    const getGoals = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const requestBody = {
          userId: userId
        };
        console.log("getting goals");
        const response = await fetch("http://localhost:4000/api/getGoals", { method: "POST", headers: {
          'Content-Type': 'application/json'
        }, body: JSON.stringify(requestBody) });
        console.log("response: ", response);
        if (response.status === 200) {
          const data = await response.json();
          setGoals(data);
        } else {
          console.log("Error fetching goals");
        }
      } catch (error) {
        console.error('Error fetching goals:', error);
      }
    }
  
    return (
      <div className="app-container">
        {isAuthenticated ? (
          <>
            <Navbar />
            {/* <div className="main-content">
              <button onClick={() => getTransactions()}>Get transaction history</button>
              <div>
                <ul>
                  {transactions.map((transaction, index) => (
                    <li key={index}>
                      {transaction.category}, {transaction.name}: {transaction.amount} on {transaction.date}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <button onClick={() => categorizeTransactions(transactions)}>Categorize Transactions</button>
                <div>
                  <ul>
                    {Object.entries(categorizedSpending).map(([category, totalSpent], index) => (
                      <li key={index}>
                        {category}: {totalSpent}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div> */}

            <div className="graphs_container">
              <div className="line_chart_container">
                  <h1>
                    Spending Habits
                  </h1>

              </div>
              <div className="bar_charts_container">
                <div className="bar_chart">
                  <h1> 
                    Targeted Spending Breakdown
                  </h1>
                </div>
                <div className="bar_chart">
                <h1>
                  Actual Spending Breakdown
                </h1>
              </div>
            </div>
          </div>
        </>
        ) : (
          <AuthScreen onLoginSuccess={handleLoginSuccess} />
        )}
      </div>
    );
  }
  
export default App;