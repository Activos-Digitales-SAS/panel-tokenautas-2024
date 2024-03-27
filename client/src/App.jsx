// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Usuarios from './components/Usuarios';
import Retiros from './components/Retiros';
import DetalleUsuario from './components/DetalleUsuario';
import BancosUsuario from './components/BancosUsuario';
import Login from './components/Login';
import RequireAuth from './RequireAuth'; // Importa el componente RequireAuth aquí

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={
            <RequireAuth>
              <Usuarios />
              <Retiros />
              <BancosUsuario />
            </RequireAuth>
          } />
          <Route path="/usuario/:user_id" element={
            <RequireAuth>
              <DetalleUsuario />
            </RequireAuth>
          } />
          {/* Aquí envolverías cualquier otra ruta que quieras proteger con <RequireAuth> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
