const express = require('express');
const { getUsers } = require('./db');

const app = express();

app.get('/', (req, res) => {
  res.send('API OK ✅');
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (err) {
    res.status(500).send("Database error");
  }
});

const port = process.env.PORT || 3000;
app.listen(port);