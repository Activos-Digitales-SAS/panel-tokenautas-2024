const express = require('express');
const mysql = require('mysql2/promise'); // Usar mysql2 con promesas
const cors = require('cors');

const app = express();

// Habilitar CORS
app.use(cors());

// Parsear el cuerpo de las peticiones
app.use(express.json());

// Crear un pool de conexiones para la base de datos general
const dbPool = mysql.createPool({
  host: '193.203.175.32', // Reemplazar con tu host de la base de datos
  user: 'u491711087_johan', // Reemplazar con tu usuario de la base de datos
  password: '5FgpE3Be$', // Reemplazar con tu contraseña
  database: 'u491711087_mibasededatos', // Reemplazar con el nombre de tu base de datos
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Crear un pool de conexiones para la base de datos administradores
const dbAdminPool = mysql.createPool({
  host: 'srv1180.hstgr.io',
  user: 'u491711087_manager7',
  password: 'g80kvOgVL3S', // Asegúrate de que esté tu contraseña correcta aquí
  database: 'u491711087_managers',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Ruta para obtener usuarios
app.get('/usuarios', async (req, res) => {
  try {
    const [results] = await dbPool.query('SELECT * FROM usuarios');
    res.json(results);
  } catch (err) {
    console.error('Error al obtener usuarios:', err);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
});

app.get('/retiros', async (req, res) => {
  const query = `
    SELECT 
      retiros.user_id,
      usuarios.username,
      retiros.banco_id,
      bancos_usuarios.nombre_banco,
      bancos_usuarios.numeroCuenta,
      retiros.identificador_transaccion,
      retiros.valor_retirar,
      retiros.estado,
      retiros.fecha_hora
    FROM retiros
    INNER JOIN usuarios ON usuarios.user_id = retiros.user_id
    INNER JOIN bancos_usuarios ON bancos_usuarios.id = retiros.banco_id
    ORDER BY retiros.fecha_hora DESC
  `;

  try {
    const [results] = await dbPool.query(query);
    res.json(results);
  } catch (err) {
    console.error('Error al consultar los retiros:', err);
    res.status(500).json({ message: 'Error al consultar los retiros' });
  }
});

app.get('/usuario/:user_id', async (req, res) => {
  const userId = req.params.user_id;

  const query = `
    SELECT 
      usuarios.*,
      bancos_usuarios.alias,
      bancos_usuarios.nombre_banco,
      bancos_usuarios.tipo_cuenta,
      bancos_usuarios.titular_cuenta,
      bancos_usuarios.cedula_titular,
      bancos_usuarios.numeroCuenta,
      retiros.valor_retirar,
      retiros.identificador_transaccion,
      retiros.estado,
      retiros.fecha_hora
    FROM usuarios
    LEFT JOIN bancos_usuarios ON bancos_usuarios.user_id = usuarios.user_id
    LEFT JOIN retiros ON retiros.user_id = usuarios.user_id
    WHERE usuarios.user_id = ?
    ORDER BY retiros.fecha_hora DESC
  `;

  try {
    const [results] = await dbPool.query(query, [userId]);
    res.json(results);
  } catch (err) {
    console.error('Error al consultar la información del usuario:', err);
    res.status(500).json({ message: 'Error al consultar la información del usuario' });
  }
});

app.put('/actualizarRetiro', async (req, res) => {
  const { identificador_transaccion, estado } = req.body;

  const query = `
    UPDATE retiros 
    SET estado = ? 
    WHERE identificador_transaccion = ?
  `;

  try {
    await dbPool.query(query, [estado, identificador_transaccion]);
    res.json({ message: 'Retiro actualizado con éxito' });
  } catch (err) {
    console.error('Error al actualizar el retiro:', err);
    res.status(500).json({ message: 'Error al actualizar el retiro' });
  }
});

app.put('/usuario/:user_id', async (req, res) => {
  const { user_id } = req.params;
  const { mi_billetera1 } = req.body;

  const query = `
    UPDATE usuarios 
    SET mi_billetera1 = ?
    WHERE user_id = ?
  `;

  try {
    await dbPool.query(query, [mi_billetera1, user_id]);
    res.json({ message: 'Saldo actualizado con éxito' });
  } catch (err) {
    console.error('Error al actualizar el saldo del usuario:', err);
    res.status(500).json({ message: 'Error al actualizar el saldo del usuario' });
  }
});

app.get('/usuario/:user_id/bancos', async (req, res) => {
  const { user_id } = req.params;

  const query = 'SELECT * FROM bancos_usuarios WHERE user_id = ?';

  try {
    const [results] = await dbPool.query(query, [user_id]);
    res.json(results);
  } catch (err) {
    console.error('Error al obtener los bancos del usuario:', err);
    res.status(500).json({ message: 'Error al obtener los bancos del usuario' });
  }
});

app.post('/login', async (req, res) => {
  const { correo, password } = req.body;

  const userQuery = 'SELECT * FROM administradores WHERE correo = ?';

  try {
    const [users] = await dbAdminPool.query(userQuery, [correo]);

    if (users.length > 0) {
      const user = users[0];
      if (password === user.password) {
        res.send('Login exitoso'); // Sólo para fines de prueba
      } else {
        res.status(401).send('Credenciales incorrectas');
      }
    } else {
      res.status(401).send('Credenciales incorrectas');
    }
  } catch (err) {
    console.error('Error en el login:', err);
    res.status(500).send('Error en el servidor');
  }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
