// src/index.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';

// Import routes
import authRoutes from './api/auth';
import matterRoutes from './api/matters';
import clientRoutes from './api/clients';
import documentRoutes from './api/documents';
import titleSearchRoutes from './api/title-searches';
import todoRoutes from './api/todos';

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/matters', matterRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/title-searches', titleSearchRoutes);
app.use('/api/todos', todoRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});