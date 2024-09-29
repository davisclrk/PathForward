import React, { useState, useEffect } from 'react';
import Navbar from './Components/navbar';
import {Doughnut} from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';import AuthScreen from './Components/Login';
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

  const [dataEntries, setDataEntries] = useState<{ category: string, amount: number }[]>([]);


  Chart.register(ArcElement, Tooltip, Legend);

  const fetchData = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const requestBody = {
        userId: userId
      };
      const response = await fetch('http://localhost:4000/api/getBudget', {method: 'POST', headers: {
        'Content-Type': 'application/json'
      }, body: JSON.stringify(requestBody)});
      if (response.status === 200) {
        const data = await response.json();
        console.log('data:', data);
        setDataEntries(data);
      } else {
        console.log('Error fetching budgets');
      }

    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  
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
                  <Doughnut
                  data={{
                    labels: dataEntries.map(entry => entry.category),
                    datasets: [
                      {
                        label: 'Budget',
                        data: dataEntries.map(entry => entry.amount),
                        backgroundColor: [
                          'rgba(255, 99, 132, 0.6)',
                          'rgba(54, 162, 235, 0.6)',
                          'rgba(255, 206, 86, 0.6)',
                          'rgba(75, 192, 192, 0.6)',
                          'rgba(153, 102, 255, 0.6)',
                          'rgba(255, 159, 64, 0.6)',
                          'rgba(199, 199, 199, 0.6)',
                          'rgba(83, 102, 255, 0.6)',
                          'rgba(255, 99, 132, 0.6)',
                          'rgba(54, 162, 235, 0.6)',
                          'rgba(255, 206, 86, 0.6)',
                          'rgba(75, 192, 192, 0.6)',
                          'rgba(153, 102, 255, 0.6)',
                          'rgba(255, 159, 64, 0.6)',
                        ],
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                  />
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