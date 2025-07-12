import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { env } from '@/utils/env';
import { Logger } from '@/utils/logger';
import { errorHandler, notFoundHandler } from '@/middleware/error';
import { globalRateLimit } from '@/middleware/rateLimit';

import authRoutes from '@/routes/auth.routes';
import transactionRoutes from '@/routes/transaction.routes';
import budgetRoutes from '@/routes/budget.routes';
import potRoutes from '@/routes/pot.routes';
import recurringBillRoutes from '@/routes/recurringBill.routes';
import overviewRoutes from '@/routes/overview.routes';

const app = express();

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
        write: (message: string) => Logger.info(message.trim()),
      },
    })
  );
}

app.get('/health', (_, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: env.NODE_ENV,
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
