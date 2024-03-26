// src/components/Usuarios.js
import React, { useState, useEffect } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate de React Router v6
import { Link } from 'react-router-dom'; // Importa Link de React Router


const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const navigate = useNavigate(); // Hook de React Router v6 para la navegación

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const { data } = await API.get('/usuarios');
        setUsuarios(data);
      } catch (error) {
        console.error('Error al obtener los usuarios', error);
      }
    };

    fetchUsuarios();
  }, []);

  const handleUsuarioClick = (user_id) => {
    navigate(`/usuario/${user_id}`); // Navegar al detalle del usuario con useNavigate
  };

  return (
    <div>
      <h1>Usuarios</h1>
      {usuarios.map(usuario => (
        <div key={usuario.user_id} onClick={() => handleUsuarioClick(usuario.user_id)}>
          <p>{usuario.username}</p>
          {/* Muestra más información del usuario si lo deseas */}
        </div>
      ))}
    </div>
  );
};

export default Usuarios;
