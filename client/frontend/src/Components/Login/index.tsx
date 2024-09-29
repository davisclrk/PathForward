import React, { useState } from 'react';
import './login.css';
import {Doughnut} from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';


interface AuthScreenProps {
  onLoginSuccess: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {

  const predefinedCategories = ["Groceries",
    "Transportation",
    "Restaurants",
    "Alchohol",
    "Loan Payments",
    "Bank Fees",
    "Entertainment",
    "Shopping",
    "Home",
    "Medical",
    "Personal Care",
    "Education",
    "Insurance",
    "General Services",
    "Taxes",
    "Travel",
    "Rent and Utilities",
    "Savings",
    "Other",
  ];

  const [isLogin, setIsLogin] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const[budget, setBudget] = useState(false);
  const [message, setMessage] = useState('');
  const [dataEntries, setDataEntries] = useState<{ category: string, amount: number }[]>([]);
  const [availableCategories, setAvailableCategories] = useState(predefinedCategories);
  const [newCategory, setNewCategory] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  Chart.register(ArcElement, Tooltip, Legend);



  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory && newAmount) {
      const amount = parseFloat(newAmount);
      const savingsEntry = dataEntries.find(entry => entry.category === 'Savings');
      if (savingsEntry) {
        let newAmount = savingsEntry.amount - amount;
        if (newAmount < 0) {
          setErrorMessage('You do not have enough money in your budget to make this decision');
          return;
        } else {
          const updatedEntries = [...dataEntries, { category: newCategory, amount: amount}];
          savingsEntry.amount -= amount;
          setDataEntries(updatedEntries);
          setAvailableCategories(availableCategories.filter(category => category !== newCategory));
          setNewCategory('');
          setNewAmount('');
          setErrorMessage(''); // Clear any previous error message
        }
      }
    }
  };

  const handleElementClick = (elems: any) => {
    if (elems.length > 0) {
      const index = elems[0].index;
      const selectedEntry = dataEntries[index];
      setNewCategory(selectedEntry.category);
      setNewAmount(selectedEntry.amount.toString());
    }
  };

  const onFinishCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = 'http://localhost:4000/api/addBudget';
    console.log("dataEntries: ", dataEntries);
    const body = {
      userId: localStorage.getItem('userId'),
      budget: dataEntries,
    }
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();

    setMessage(data.message);
    if (response.ok) {
      onLoginSuccess();
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const endpoint = isLogin ? 'http://localhost:4000/api/login' : 'http://localhost:4000/api/createUser';
    const body = isLogin
      ? { email, password }
      : { firstName, lastName, email, password, monthlyIncome };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();

    setMessage(data.message);
    if (response.ok) {
      const userId = data;
      console.log("userId: ", userId);
      localStorage.setItem('userId', userId);
      if (isLogin) {
        onLoginSuccess();
      } else {
        console.log("hihihihi");
        setBudget(true);
        setDataEntries([...dataEntries, {category: "Savings", amount: parseFloat(monthlyIncome)}])
      }
    }
  };

  return (
    <div className="loginPageContainer">
      <div className="loginPage">
        <h1>{isLogin ? 'Login' : 'Create Account'}</h1>
        <form onSubmit={handleSubmit} style={{ display: budget ? 'none' : 'block' }}>
          <div className="emailField">
            <label>Email</label>
            <input
              type="text"
              className="emailInput"
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="passwordField">
            <label>Password</label>
            <input
              type="password"
              className="passwordInput"
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {!isLogin && (
            <>
              <div className="firstNameField">
                <label>First Name</label>
                <input
                  type="text"
                  className="firstNameInput"
                  placeholder='First Name'
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="lastNameField">
                <label>Last Name</label>
                <input
                  type="text"
                  className="lastNameInput"
                  placeholder='Last Name'
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              <div className="monthlyIncomeField">
                <label>Monthly Income</label>
                <input
                  type="text"
                  className="monthlyIncomeInput"
                  placeholder='Monthly Income'
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                  required
                />
              </div>
            </>
          )}
          <button className="submitBtn" type="submit">{isLogin ? 'Login' : 'Create Account'}</button>
        </form>
        <button className="switchBtn" style = {{display: budget? 'none': 'block'}} onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Create Account' : 'Login'}
        </button>
        {message && <p>{message}</p>}
        {budget && (
          <div className="doughnut-container" style={{ height: '300px', width: '300px', paddingBottom: '20px' }}>
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
                onClick: (e, elems) => handleElementClick(elems),
              }}
            />
          </div>
        )}
        {budget && (
          <form onSubmit={handleAddEntry} className="entryForm">
            <div className="formGroup">
              <label>
              Category:
              <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} required>
                <option value="" disabled>Select a category</option>
                {availableCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </label>
            </div>
            <div className="formGroup">
              <label>
              Amount:
              <input
                type="number"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                required
              />
            </label>
            </div>
            <button type="submit">Add Entry</button>
          </form>
        )}
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {budget && dataEntries.map((entry, index) => (
          <div key={index}>
            <span>{entry.category}: ${entry.amount}</span>
          </div>
        ))}
        <button type="submit" style={{display: (budget) ? 'block': 'none'}} onClick={onFinishCreateAccount}>Submit Entries</button>
      </div>
    </div>
  );
};

export default AuthScreen;
