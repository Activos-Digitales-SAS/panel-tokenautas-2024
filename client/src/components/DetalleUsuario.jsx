// src/components/DetalleUsuario.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';

const DetalleUsuario = () => {
  const { user_id } = useParams(); // Obtener el user_id de la URL
  const [usuario, setUsuario] = useState(null);
  const [saldo, setSaldo] = useState('');
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const { data } = await API.get(`/usuario/${user_id}`);
        if (data && data.length > 0) {
          setUsuario(data[0]); // Asumiendo que la respuesta es un array
          setSaldo(data[0].mi_billetera1); // Asumiendo que mi_billetera1 es un campo en la respuesta
        }
      } catch (error) {
        console.error(`Error al obtener el usuario con ID ${user_id}`, error);
      }
    };

    fetchUsuario();
  }, [user_id]);

  const handleEdit = () => {
    setEditando(true);
  };

  const handleCancel = () => {
    setEditando(false);
    setSaldo(usuario.mi_billetera1); // Restablecer el saldo original
  };

  const handleSave = async () => {
    try {
      const { data } = await API.put(`/usuario/${user_id}`, { mi_billetera1: saldo });
      setUsuario({ ...usuario, mi_billetera1: saldo });
      setEditando(false);
      // Aquí podrías mostrar un mensaje de éxito o manejar la respuesta como sea necesario
    } catch (error) {
      console.error('Error al actualizar el saldo del usuario', error);
      // Manejar el error
    }
  };

  return (
    <div>
      <h1>Detalle del Usuario</h1>
      {usuario ? (
        <div>
          <p>user_id: {usuario.user_id}</p>
          <p>Username: {usuario.username}</p>
          {editando ? (
            <div>
              <input
                type="text"
                value={saldo}
                onChange={(e) => setSaldo(e.target.value)}
              />
              <button onClick={handleSave}>Guardar</button>
              <button onClick={handleCancel}>Cancelar</button>
            </div>
          ) : (
            <div>
              <p>Saldo: {usuario.mi_billetera1}</p>
              <button onClick={handleEdit}>Editar Saldo</button>
            </div>
          )}
        </div>
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
};

export default DetalleUsuario;
