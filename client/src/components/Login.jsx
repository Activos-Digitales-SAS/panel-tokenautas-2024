// src/components/Login.js
import React, { useState } from 'react';
import API from '../api';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await API.post('/login', { username, password });
      const token = response.data.token;
      localStorage.setItem('token', token); // Almacenar el token en el almacenamiento local
      onLogin(); // Llamar a la función de login en el componente padre
    } catch (error) {
      setError('Error al iniciar sesión');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p>{error}</p>}
      <input
        type="text"
        placeholder="Usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Iniciar sesión</button>
    </div>
  );
};

export default Login;
