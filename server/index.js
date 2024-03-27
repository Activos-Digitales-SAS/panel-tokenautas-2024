// server.js

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

// Habilitar CORS
app.use(cors());

// Parsear el cuerpo de las peticiones
app.use(express.json());

// Crear conexión a la base de datos general
const db = mysql.createConnection({
  host: 'localhost', // Reemplazar con tu host de la base de datos
  user: 'root', // Reemplazar con tu usuario de la base de datos
  password: '', // Reemplazar con tu contraseña
  database: 'mi_base_de_datos' // Reemplazar con el nombre de tu base de datos
});

// Conectar a la base de datos
db.connect(err => {
  if (err) throw err;
  console.log('Conexión a la base de datos establecida.');
});


// Crear conexión a la base de datos administradores
const dbAdmin = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Asegúrate de que esté tu contraseña correcta aquí
  database: 'dashboardAdministrador'
});

dbAdmin.connect(err => {
  if (err) throw err;
  console.log('Conexión a la base de datos establecida.');
});



// Ruta para obtener usuarios
app.get('/usuarios', (req, res) => {
  db.query('SELECT * FROM usuarios', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});



app.get('/retiros', (req, res) => {
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

  db.query(query, (err, results) => {
    if (err) {
      // Manejo de errores
      console.error(err);
      return res.status(500).json({ message: 'Error al consultar los retiros' });
    }
    // Envío de resultados
    res.json(results);
  });
});


// Ruta para obtener toda la información de un usuario específico -HISTORIAL MUESTRA TODOS
app.get('/usuario/:user_id', (req, res) => {
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

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al consultar la información del usuario' });
    }
    res.json(results);
  });
});



// Dentro de server.js o donde manejes tus rutas

app.put('/actualizarRetiro', (req, res) => {
  const { identificador_transaccion, estado } = req.body;

  // Asegúrate de validar el nuevo estado y el identificador del retiro aquí

  const query = `
    UPDATE retiros 
    SET estado = ? 
    WHERE identificador_transaccion = ?
  `;

  db.query(query, [estado, identificador_transaccion], (err, result) => {
    if (err) {
      console.error('Error al actualizar el retiro', err);
      return res.status(500).json({ message: 'Error al actualizar el retiro' });
    }
    res.json({ message: 'Retiro actualizado con éxito' });
  });
});




// Dentro de tu servidor de Node.js

app.put('/usuario/:user_id', (req, res) => {
  const { user_id } = req.params;
  const { mi_billetera1 } = req.body;

  // Aquí deberías validar que el usuario que hace la solicitud tiene permisos para hacerlo

  const query = `
    UPDATE usuarios 
    SET mi_billetera1 = ?
    WHERE user_id = ?
  `;

  // Asumiendo que tienes una función db.query configurada para interactuar con tu base de datos
  db.query(query, [mi_billetera1, user_id], (err, result) => {
    if (err) {
      console.error('Error al actualizar el saldo del usuario', err);
      return res.status(500).json({ message: 'Error al actualizar el saldo del usuario' });
    }
    res.json({ message: 'Saldo actualizado con éxito' });
  });
});


// En tu archivo de rutas de Node.js (puede ser server.js o algún otro archivo dependiendo de cómo esté estructurado tu proyecto)

app.get('/usuario/:user_id/bancos', (req, res) => {
  const { user_id } = req.params;

  const query = 'SELECT * FROM bancos_usuarios WHERE user_id = ?';

  db.query(query, [user_id], (err, results) => {
    if (err) {
      console.error('Error al obtener los bancos del usuario', err);
      return res.status(500).json({ message: 'Error al obtener los bancos del usuario' });
    }
    res.json(results);
  });
});



// Endpoint simplificado para login
app.post('/login', (req, res) => {
  const { correo, password } = req.body;

  const userQuery = 'SELECT * FROM administradores WHERE correo = ?';


  dbAdmin.query(userQuery, [correo], (err, users) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error en el servidor');
      return;
    }

    if (users.length > 0) {
      const user = users[0];
      // En un entorno de producción, debes usar bcrypt para verificar la contraseña
      if (password === user.password) {
        res.send('Login exitoso'); // Sólo para fines de prueba
      } else {
        res.status(401).send('Credenciales incorrectas');
      }
    } else {
      res.status(401).send('Credenciales incorrectas');
    }
  });
});


// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
