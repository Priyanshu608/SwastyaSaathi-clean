const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

router.get('/', (req, res) => {
  const city = (req.query.city || '').trim().toLowerCase();
  const p = path.join(__dirname, '..', 'data', 'hospitals.json');
  const raw = fs.readFileSync(p, 'utf8');
  const data = JSON.parse(raw);
  if (!city) return res.json(data);
  const filtered = data.filter(h => (h.city || '').toLowerCase() === city);
  res.json(filtered);
});

module.exports = router;
