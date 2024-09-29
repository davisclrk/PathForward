import React, { useState } from 'react';
import './login.css';

interface AuthScreenProps {
  onLoginSuccess: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [message, setMessage] = useState('');

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
      onLoginSuccess();
    }
  };

  return (
    <div className="loginPageContainer">
      <div className="loginPage">
        <h1>{isLogin ? 'Login' : 'Create Account'}</h1>
        <form onSubmit={handleSubmit}>
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
                  />
              </div>
            </>
          )}
          <button className="submitBtn" type="submit">{isLogin ? 'Login' : 'Create Account'}</button>
        </form>
        <button className="switchBtn" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Switch to Create Account' : 'Switch to Login'}
        </button>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default AuthScreen;