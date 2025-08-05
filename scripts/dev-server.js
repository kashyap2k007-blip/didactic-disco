import express from 'express';
import path from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, '../dist')));

// Simple catch-all route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Development server running at http://localhost:${PORT}`);
  console.log('📱 Open your browser to view the Medical Admissions Platform');
  console.log('🔄 To rebuild, run: npm run build');
});