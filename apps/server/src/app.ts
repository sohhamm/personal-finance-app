import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { checkDatabaseHealth } from '@/db';
import { errorHandler, notFoundHandler } from '@/middleware/error';
import { globalRateLimit } from '@/middleware/rateLimit';
import { requestIdMiddleware } from '@/middleware/requestId';
import authRoutes from '@/routes/auth.routes';
import budgetRoutes from '@/routes/budget.routes';
import overviewRoutes from '@/routes/overview.routes';
import potRoutes from '@/routes/pot.routes';
import recurringBillRoutes from '@/routes/recurringBill.routes';
import transactionRoutes from '@/routes/transaction.routes';
import { env } from '@/utils/env';
import { Logger } from '@/utils/logger';

const app = express();

// Request ID middleware should be first
app.use(requestIdMiddleware);

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(globalRateLimit);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(compression());

if (env.NODE_ENV !== 'test') {
  app.use(
    morgan('combined', {
      stream: {
        write: (message: string) => Logger.info('HTTP Request', { httpLog: message.trim() }),
      },
    })
  );
}

app.get('/health', async (_, res) => {
  const dbHealthy = await checkDatabaseHealth();
  const status = dbHealthy ? 'OK' : 'DEGRADED';
  
  res.status(dbHealthy ? 200 : 503).json({
    status,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: env.NODE_ENV,
    database: dbHealthy ? 'connected' : 'disconnected',
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/pots', potRoutes);
app.use('/api/recurring-bills', recurringBillRoutes);
app.use('/api/overview', overviewRoutes);

app.use(notFoundHandler);

app.use(errorHandler);

export default app;
