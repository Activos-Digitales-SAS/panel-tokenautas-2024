// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Usuarios from './components/Usuarios';
import Retiros from './components/Retiros';
import DetalleUsuario from './components/DetalleUsuario'; // Asume que tienes este componente
import BancosUsuario from './components/BancosUsuario';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Muestra Usuarios y Retiros directamente en la página principal */}
        <Usuarios />
        <Retiros />

        <Routes>
          {/* Otras rutas configuradas aquí */}
          <Route path="/usuario/:user_id" element={<DetalleUsuario />} />
        </Routes>

        <BancosUsuario />
      </div>
    </Router>
  );
}

export default App;
