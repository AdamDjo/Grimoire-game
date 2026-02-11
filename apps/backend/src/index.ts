import express, { type Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Routes will be registered here in Phase 2-3
// app.use('/api/auth', authRoutes);
// app.use('/api/characters', characterRoutes);
// app.use('/api/universes', universeRoutes);
// app.use('/api/sessions', sessionRoutes);
// app.use('/api/game', gameRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

export { app };
