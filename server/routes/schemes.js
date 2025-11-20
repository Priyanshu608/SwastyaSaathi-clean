const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

router.get('/', (req, res) => {
  const p = path.join(__dirname, '..', 'data', 'schemes.json');
  const raw = fs.readFileSync(p, 'utf8');
  const data = JSON.parse(raw);
  res.json(data);
});

module.exports = router;
