const { Pool } = require('pg');

const pool = new Pool({

    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

pool.on('connect',()=>{
    console.log('Database connected successfully');
});

pool.on('error',(err)=>{
    console.error("Database connection error:",err)
});


// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection failed:', err.message);
  } else {
    console.log('Database connected successfully!');
    console.log('Database time:', res.rows[0].now);
  }
}); 

module.exports = pool;