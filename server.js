const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
app.use(express.static('public'));
const PUBLIC_DIR = path.join(__dirname, 'public');
const DATA_FILE = path.join(__dirname, 'data', 'books.json');

// API route
app.get('/api/books', (req, res) => {
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read books.json' });

    // منع أي caching للـ API
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.set('Surrogate-Control', 'no-store');

    res.json(JSON.parse(data));
  });
});

// Static files بدون cache
app.use(express.static(PUBLIC_DIR, {
  etag: false,
  lastModified: false,
  setHeaders: (res) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.set('Surrogate-Control', 'no-store');
  }
}));

// Fallback for index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
