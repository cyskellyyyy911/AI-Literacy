// Simple Node.js API with MySQL for AI Impact Tracker
const path = require('path');
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const { MYSQL_DSN } = require('./config');

const PORT = process.env.PORT || 3000;

function parseMysqlDsn(dsn) {
  const withoutProto = dsn.replace(/^mysql:\/\//, '');
  const atIndex = withoutProto.indexOf('@');
  if (atIndex === -1) throw new Error('Invalid MYSQL_DSN');
  const userinfo = withoutProto.slice(0, atIndex);
  const hostAndDb = withoutProto.slice(atIndex + 1);
  const colonIndex = userinfo.indexOf(':');
  const user = colonIndex === -1 ? userinfo : userinfo.slice(0, colonIndex);
  const password = colonIndex === -1 ? '' : userinfo.slice(colonIndex + 1);
  const slashIndex = hostAndDb.indexOf('/');
  const hostPort = slashIndex === -1 ? hostAndDb : hostAndDb.slice(0, slashIndex);
  const database = slashIndex === -1 ? '' : hostAndDb.slice(slashIndex + 1);
  const [host, portStr] = hostPort.split(':');
  const port = portStr ? parseInt(portStr, 10) : 3306;
  return {
    host,
    port,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };
}

const pool = mysql.createPool(parseMysqlDsn(process.env.MYSQL_DSN || MYSQL_DSN));

async function ensureSchema() {
  const createSql = `CREATE TABLE IF NOT EXISTS entries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pillar VARCHAR(255) NOT NULL,
    task VARCHAR(255) NOT NULL,
    description TEXT,
    timeSaved DOUBLE NOT NULL DEFAULT 0,
    moneySaved DOUBLE NOT NULL DEFAULT 0,
    date DATE NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;
  await pool.query(createSql);
}

const app = express();
app.use(cors());
app.use(express.json());

// Serve static frontend from project root
app.use(express.static(__dirname));

// Explicit routes for main pages
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/index.html', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/tracker.html', (_req, res) => {
  res.sendFile(path.join(__dirname, 'tracker.html'));
});

// Health
app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true });
  } catch (_e) {
    res.status(500).json({ ok: false });
  }
});

// Fast totals summary for homepage
app.get('/api/summary', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT COALESCE(SUM(timeSaved),0) AS timeTotal, COALESCE(SUM(moneySaved),0) AS moneyTotal FROM entries');
    const { timeTotal, moneyTotal } = rows[0] || { timeTotal: 0, moneyTotal: 0 };
    res.json({ timeTotal, moneyTotal });
  } catch (e) {
    res.status(500).json({ error: 'DB_SUMMARY_FAILED' });
  }
});

// List entries
app.get('/api/entries', async (req, res) => {
  const { pillar, since } = req.query;
  const params = [];
  const whereParts = [];
  if (pillar) {
    whereParts.push('pillar = ?');
    params.push(pillar);
  }
  if (since) {
    whereParts.push('date >= ?');
    params.push(since);
  }
  const where = whereParts.length ? `WHERE ${whereParts.join(' AND ')}` : '';
  try {
    const [rows] = await pool.query(`SELECT * FROM entries ${where} ORDER BY date DESC, id DESC`, params);
    res.json({ entries: rows });
  } catch (e) {
    res.status(500).json({ error: 'DB_READ_FAILED' });
  }
});

// Create entry
app.post('/api/entries', async (req, res) => {
  const { pillar, task, description, timeSaved, moneySaved, date } = req.body || {};
  if (!pillar || !task || !date || typeof timeSaved !== 'number') {
    return res.status(400).json({ error: 'INVALID_BODY' });
  }
  try {
    const [result] = await pool.query(
      `INSERT INTO entries (pillar, task, description, timeSaved, moneySaved, date) VALUES (?, ?, ?, ?, ?, ?)`,
      [pillar, task, description || '', timeSaved, moneySaved || 0, date]
    );
    const insertId = result.insertId;
    const [rows] = await pool.query(`SELECT * FROM entries WHERE id = ?`, [insertId]);
    res.status(201).json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: 'DB_WRITE_FAILED' });
  }
});

// Update entry
app.put('/api/entries/:id', async (req, res) => {
  const { id } = req.params;
  const fields = ['pillar','task','description','timeSaved','moneySaved','date'];
  const updates = [];
  const values = [];
  fields.forEach(key => {
    if (Object.prototype.hasOwnProperty.call(req.body, key)) {
      updates.push(`${key} = ?`);
      values.push(req.body[key]);
    }
  });
  if (updates.length === 0) return res.status(400).json({ error: 'NO_FIELDS' });
  values.push(id);
  try {
    await pool.query(`UPDATE entries SET ${updates.join(', ')} WHERE id = ?`, values);
    const [rows] = await pool.query(`SELECT * FROM entries WHERE id = ?`, [id]);
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: 'DB_UPDATE_FAILED' });
  }
});

// Delete entry
app.delete('/api/entries/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query(`DELETE FROM entries WHERE id = ?`, [id]);
    res.json({ deleted: result.affectedRows > 0 });
  } catch (e) {
    res.status(500).json({ error: 'DB_DELETE_FAILED' });
  }
});

// Clear all entries
app.delete('/api/entries', async (_req, res) => {
  try {
    await pool.query(`DELETE FROM entries`);
    res.json({ cleared: true });
  } catch (e) {
    res.status(500).json({ error: 'DB_CLEAR_FAILED' });
  }
});

ensureSchema()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Tracker API running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database schema:', err);
    process.exit(1);
  });

