import React, { useState, useEffect } from 'react';
import Navbar from './Components/navbar';
import 'chartjs-adapter-date-fns';
import {Doughnut, Line} from 'react-chartjs-2';
import { Chart, LineElement, CategoryScale, LinearScale, PointElement, TimeScale, Tooltip, Legend } from 'chart.js';
import './App.css';
import AuthScreen from './Components/Login/index';


const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [transactions6, setTransactions6] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<string | null>("Past Month");
  const [categorizedSpending, setCategorizedSpending] = useState<any[]>([]);
  const [showGoalInput, setShowGoalInput] = useState(false);
  const [goal, setGoal] = useState('');
  const [goals, setGoals] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  


  useEffect(() => {
    getGoals();
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const [dataEntries, setDataEntries] = useState<{ category: string, amount: number }[]>([]);
  const [actualSpendingCat, setActualSpendingCat] = useState<{ category: string, amount: number }[]>([]);


  Chart.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, TimeScale, Legend);

  
  const fetchData = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const requestBody = {
        userId: userId,
        days: 30
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

      const response3 = await fetch('http://localhost:4000/api/getTransactions', {method: 'POST', headers: {
        'Content-Type': 'application/json'
      }, body: JSON.stringify(requestBody)});
      if (response3.status === 200) {
        const data = await response3.json();
        setTransactions(data);
        const set = new Set();
        const hm: { [key: string]: number } = {};
          for (let i = 0; i < transactions.length; i++) {
            let category = transactions[i].category;
            if (!(category in hm)) {
              hm[category] = transactions[i].amount;
            } else {
              hm[category] += transactions[i].amount;
            }
          }
          let tempCategories = [];
          let tempSpendingCat = [];
          for (let key in hm) {
            tempCategories.push(key);
            tempSpendingCat.push({category: key, amount: hm[key]});
          }
          setCategories(tempCategories);
          setActualSpendingCat(tempSpendingCat);

          
          console.log("categories: ", categories);
        console.log('transaction data:', transactions);
        const requestBody2 = {
          userId: userId,
          transactions: data
        };
        const response2 = await fetch('http://localhost:4000/api/categorizeTransactions', {method: 'POST', headers: {
          'Content-Type': 'application/json'
        }, body: JSON.stringify(requestBody2)});
        if (response2.status === 200) {
          console.log(JSON.stringify(requestBody2));
          const data2 = await response2.json();
          console.log('actaul spending:', data2);
          // setActualSpendingCat(data2);
          console.log('actual spending data:', actualSpendingCat);
        }
      }
      const requestBody4 = {
        userId: userId,
        days: 180
      }
      const response4 = await fetch('http://localhost:4000/api/getTransactions', {method: 'POST', headers: {
        'Content-Type': 'application/json'
      }, body: JSON.stringify(requestBody4)});
      if (response4.status === 200) {
        console.log(JSON.stringify(requestBody4));
        const data3 = await response4.json();
        setTransactions6(data3);
        console.log('transaction6 data:', transactions6);
      }

    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isAuthenticated]);
  
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

    const handleCompleteGoal = (index: number) => {
      const updatedGoals = [...goals];
      updatedGoals[index].completed = true;
      setGoals(updatedGoals);
    
      // Delete the goal after a delay
      setTimeout(() => {
        setGoals(goals => goals.filter((_, i) => i !== index));
      }, 1000); // Adjust the delay as needed
    };

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
    const activeTransactions = selectedTimeRange === 'Past Month' ? transactions : transactions6;
    const filteredTransactions = selectedCategory
    ? activeTransactions.filter(activeTransactions => activeTransactions.category === selectedCategory)
    : activeTransactions;

  const aggregatedTransactions = filteredTransactions.reduce((acc, transaction) => {
    const date = transaction.date;
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += transaction.amount;
    return acc;
  }, {} as Record<string, number>);

  const aggregatedTransactions6 = transactions6.reduce((acc, transaction) => {
    const date = transaction.date;
    const dateFirst = date.slice(0, -2) + '01';
    if (!acc[dateFirst]) {
      acc[dateFirst] = 0;
    }
    acc[dateFirst] += transaction.amount;
    console.log(acc);
    return acc;
  }, {} as Record<string, number>);

  const chartData = {
    labels: selectedTimeRange === 'Past Month' ? Object.keys(aggregatedTransactions)
      : Object.keys(aggregatedTransactions6),

    datasets: [
      {
        label: 'Spending Over Time',
        data: selectedTimeRange === 'Past Month' ? Object.values(aggregatedTransactions)
        : Object.values(aggregatedTransactions6),
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1
      }
    ]
  };
  
    return (
      <div>
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
                    <div>
                      <label htmlFor="category-select">Select Category:</label>
                      <select
                        id="category-select"
                        value={selectedCategory || ''}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                      >
                        <option value="">All Categories</option>
                        {categories.map(category => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="category-select">Select Time Frame:</label>
                      <select
                        id="range-select"
                        value={selectedTimeRange || ''}
                        onChange={(e) => setSelectedTimeRange(e.target.value)}
                      >
                        <option value="Past Month">Past Month</option>
                        <option value="Past 6 Months">Past 6 Months</option>
                        
                      </select>
                    </div>
                    <Line
                      data={chartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          x: {
                            type: 'time',
                            time: {
                              unit: selectedTimeRange === 'Past Month' ? 'day': 'month',
                              tooltipFormat: 'PP', // Format for the tooltip
                              displayFormats: {
                                day: selectedTimeRange === 'Past Month' ? 'MMM d' : 'MMM yyyy' 
                              }
                            },
                            title: {
                              display: true,
                              text: 'Date'
                            }
                          },
                          y: {
                            title: {
                              display: true,
                              text: 'Amount'
                            }
                          }
                        }
                      }}
                    />
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
                    {actualSpendingCat ? (
                    <Doughnut
                    data={{
                      labels: actualSpendingCat.map(entry => entry.category),
                      datasets: [
                        {
                          label: 'Budget',
                          data: actualSpendingCat.map(entry => entry.amount),
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
                  ) : ( <p>Loading...</p>
                )}
                </div>
              </div>
            </div>
            <div className="line"></div>
            <div className="row2">
                  <h1>Transactions</h1>
                  <div className="transactionsList">
                        <table>
                            <thead>
                                <tr>
                                    <th className="name">Name</th>
                                    <th className="amount">Amount</th>
                                    <th className="date">Date</th>
                                    <th className="category">Category</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions && transactions.map((transaction, index) => (
                                    <tr key={index}>
                                        <td className="name">{transaction.name}</td>
                                        <td className="amount">{transaction.amount} USD</td>
                                        <td className="date">{transaction.date}</td>
                                        <td className="category">{transaction.category}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                  </div>
                </div>

                <div className="line"></div>

               <div >
               <div className="goal-input-container">
                  {showGoalInput && (
                    <div className="goal-input">
                      <input
                        type="text"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        placeholder="Enter your goal"
                        className="goal-input-field"
                      />
                      <button onClick={handleAddGoal} className="goal-add-button">Add Goal</button>
                    </div>
                  )}
                  <button className="add-goal-button" onClick={() => setShowGoalInput(true)}>+</button>
                </div>
                <div className="goals-list">
                  <h2>Goals</h2>
                  <ul>
                    {goals.map((goal, index) => (
                      <li key={index} className="goal-item">
                        <span>{goal}</span>
                        <button
                          onClick={() => handleDeleteGoal(goal)}
                          className="goal-complete-button"
                        >
                          ✓
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
          </>
          ) : (
            <AuthScreen onLoginSuccess={handleLoginSuccess} />
          )}
          
        </div>
      </div>
    );
  }
  
export default App;