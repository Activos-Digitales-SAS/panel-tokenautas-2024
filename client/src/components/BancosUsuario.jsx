// src/components/BancosUsuario.js
import React, { useState, useEffect } from 'react';
import API from '../api';

const BancosUsuario = () => {
  const [bancos, setBancos] = useState([]);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (userId) {
      const fetchBancos = async () => {
        try {
          const response = await API.get(`/usuario/${userId}/bancos`);
          console.log('Bancos recibidos:', response.data); // Mostrar los bancos en la consola
          setBancos(response.data);
        } catch (error) {
          console.error('Error al obtener los bancos del usuario', error);
          console.log(error.response); // Detalles de cualquier error de respuesta de la API
        }
      };

      fetchBancos();
    }
  }, [userId]);

  const handleSearch = async () => {
    try {
      // Aquí asumimos que tienes un endpoint que puede buscar el user_id por username
      const response = await API.get(`/usuarios?username=${username}`);
      console.log('Usuario recibido:', response.data);
      const user = response.data.find(u => u.username.toLowerCase() === username.toLowerCase());
      if (user) {
        setUserId(user.user_id);
      } else {
        console.log('No se encontró el usuario');
        setBancos([]); // Limpiar la lista de bancos si no se encuentra el usuario
      }
    } catch (error) {
      console.error('Error al buscar el usuario', error);
    }
  };

  return (
    <div>
      <h2>Bancos del Usuario</h2>
      <p>Introduce el username del usuario para ver todos los bancos que ha registrado</p>
      <input
        type="text"
        placeholder="Buscar por nombre de usuario..."
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleSearch}>Buscar</button>
      {bancos.length > 0 ? (
        <ul>
          {bancos.map((banco) => (
            <li key={banco.id}>
              <p>Alias: {banco.alias}</p>
              <p>Nombre del banco: {banco.nombre_banco}</p>
              <p>Tipo de cuenta: {banco.tipo_cuenta}</p>
              <p>Titular de la cuenta: {banco.titular_cuenta}</p>
              <p>Cédula del titular: {banco.cedula_titular}</p>
              <p>Número de cuenta: {banco.numeroCuenta}</p>
            </li>
          ))}
        </ul>
      ) : userId && (
        <p>No se encontraron bancos para este usuario.</p>
      )}
    </div>
  );
};

export default BancosUsuario;
