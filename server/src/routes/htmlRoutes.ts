import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Router } from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();

// TODO: Define route to serve index.html
// Serve the index.html from the public directory (or adjust the path as needed)
router.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, '../../client', 'index.html')); // Adjust 'public' folder as necessary
});

export default router;