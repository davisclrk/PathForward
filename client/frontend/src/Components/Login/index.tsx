import React, { useState } from 'react';

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
    if (isLogin && response.ok) {
      const userId = data;
      console.log("userId: ", userId);
      localStorage.setItem('userId', userId);
      onLoginSuccess();
    }
  };

  return (
    <div>
      <h1>{isLogin ? 'Login' : 'Create Account'}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Email:
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
        </div>
        {!isLogin && (
          <>
          <div>
              <label>
                First Name:
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </label>
            </div>
            <div>
              <label>
                Last Name:
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </label>
            </div>
            <div>
              <label>
                Monthly Income:
                <input
                  type="text"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                />
              </label>
            </div>
          </>
        )}
        <button type="submit">{isLogin ? 'Login' : 'Create Account'}</button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Switch to Create Account' : 'Switch to Login'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AuthScreen;