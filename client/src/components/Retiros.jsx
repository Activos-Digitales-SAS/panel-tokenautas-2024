// src/components/Retiros.js
import React, { useState, useEffect } from 'react';
import API from '../api';

const Retiros = () => {
  const [retiros, setRetiros] = useState([]);

  useEffect(() => {
    fetchRetiros();
  }, []);

  const fetchRetiros = async () => {
    try {
      const { data } = await API.get('/retiros');
      setRetiros(data);
    } catch (error) {
      console.error('Error al obtener los retiros', error);
    }
  };

  const actualizarEstadoRetiro = async (identificador_transaccion, nuevoEstado) => {
    try {
      await API.put('/actualizarRetiro', {
        identificador_transaccion,
        estado: nuevoEstado,
      });
      fetchRetiros(); // Recargar la lista de retiros para mostrar el estado actualizado
    } catch (error) {
      console.error('Error al actualizar el estado del retiro', error);
    }
  };

  return (
    <div>
      <h1>Retiros</h1>
      <table>
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Valor Retirar</th>
            <th>Fecha</th>
            <th>Banco</th>
            <th>Número de Cuenta</th>
            <th>Estado</th>
            <th>Acción</th> {/* Columna adicional para acciones */}
          </tr>
        </thead>
        <tbody>
          {retiros.map((retiro) => (
            <tr key={retiro.identificador_transaccion}>
              <td>{retiro.username}</td>
              <td>{retiro.valor_retirar}</td>
              <td>{retiro.fecha_hora}</td>
              <td>{retiro.nombre_banco}</td>
              <td>{retiro.numeroCuenta}</td>
              <td>{retiro.estado}</td>
              <td>
                <select
                  value={retiro.estado}
                  onChange={(e) => actualizarEstadoRetiro(retiro.identificador_transaccion, e.target.value)}
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Aprobado">Aprobado</option>
                  <option value="Rechazado">Rechazado</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Retiros;
