const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();

const PORT = 3000;


app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',      
  port: 3309,
  password: 'Meraklangka1',      
  database: 'mahasiswa'
});

db.connect((err) => {
  if (err) console.error('Koneksi database gagal:', err);
  else console.log('Berhasil konek ke database MySQL!');
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/biodata', (req, res) => {
  db.query('SELECT * FROM biodata', (err, results) => {
    if (err) return res.status(500).json({ message: 'Gagal ambil data' });
    res.json(results);
  });
});

app.post('/biodata', (req, res) => {
  const { nama, alamat, agama } = req.body || {};


  if (!nama || !alamat || !agama) {
    return res.status(400).json({ message: 'nama, alamat, dan agama wajib diisi' });
  }

  const sql = 'INSERT INTO biodata (nama, alamat, agama) VALUES (?, ?, ?)';
  db.query(sql, [nama, alamat, agama], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Gagal menambah data' });
    }

    res.status(201).json({
      id: result.insertId,
      nama,
      alamat,
      agama
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});
