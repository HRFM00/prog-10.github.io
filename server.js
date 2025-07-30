const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;


app.use(cors());
app.use(bodyParser.json());

// SQLite データベースファイルを作成（または既存のものを使用）
const db = new sqlite3.Database('./shift.db', (err) => {
  if (err) {
    console.error('DB接続エラー:', err.message);
  } else {
    console.log('SQLite データベースに接続しました。');
  }
});

// 初回起動時にシフトテーブル作成
db.run(`
  CREATE TABLE IF NOT EXISTS shifts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user TEXT,
    date TEXT,
    shift TEXT
  )
`);

// シフト保存API
app.post('/save-shift', (req, res) => {
  const { user, date, shift } = req.body;
  db.run(`INSERT INTO shifts (user, date, shift) VALUES (?, ?, ?)`, [user, date, shift], function (err) {
    if (err) return res.status(500).send('保存エラー');
    res.send({ success: true });
  });
});

// シフト取得API
app.get('/get-shifts', (req, res) => {
  db.all(`SELECT * FROM shifts`, [], (err, rows) => {
    if (err) return res.status(500).send('取得エラー');
    res.json(rows);
  });
});

// ポートでの待機はここだけにする
app.listen(port, () => {
  console.log(`サーバー起動：http://localhost:${port}`);
});
