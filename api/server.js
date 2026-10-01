const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

// Los datos de conexión vienen de variables de entorno (no están escritos aquí)
const pool = new Pool({
  host: process.env.DB_HOST,
  port: 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Crea la tabla si no existe. Reintenta por si la BD tarda en arrancar.
async function iniciarBD() {
  for (let intento = 1; intento <= 10; intento++) {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS reservas (
          id SERIAL PRIMARY KEY,
          actividad VARCHAR(100) NOT NULL,
          nombre VARCHAR(100) NOT NULL,
          fecha DATE NOT NULL
        )
      `);
      console.log('Base de datos lista');
      return;
    } catch (err) {
      console.log(`BD no lista (intento ${intento}/10), reintentando...`);
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
  console.error('No se pudo conectar con la base de datos');
  process.exit(1);
}

// Comprueba que la API está funcionando
app.get('/api/health', (req, res) => {
  res.json({ estado: 'ok' });
});

// Lista todas las reservas
app.get('/api/reservas', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM reservas ORDER BY id');
    res.json(resultado.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al leer las reservas' });
  }
});

// Crea una reserva nueva
app.post('/api/reservas', async (req, res) => {
  const { actividad, nombre, fecha } = req.body;
  if (!actividad || !nombre || !fecha) {
    return res.status(400).json({ error: 'Faltan datos: actividad, nombre y fecha' });
  }
  try {
    const resultado = await pool.query(
      'INSERT INTO reservas (actividad, nombre, fecha) VALUES ($1, $2, $3) RETURNING *',
      [actividad, nombre, fecha]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al guardar la reserva' });
  }
});

iniciarBD().then(() => {
  app.listen(3000, () => console.log('API escuchando en el puerto 3000'));
});