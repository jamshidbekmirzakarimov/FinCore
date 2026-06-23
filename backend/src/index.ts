import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { authRouter } from './routes/auth.routes';
import { statsRouter } from './routes/stats.routes';
import { customerRouter } from './routes/customer.routes';
import { branchRouter } from './routes/branch.routes';
import { loanRouter } from './routes/loan.routes';
import { transactionRouter } from './routes/transaction.routes';
import { complianceRouter } from './routes/compliance.routes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(cors());
app.use(helmet({
  crossOriginResourcePolicy: false
}));
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/stats', statsRouter);
app.use('/api/customers', customerRouter);
app.use('/api/branches', branchRouter);
app.use('/api/loans', loanRouter);
app.use('/api/transactions', transactionRouter);
app.use('/api/compliance', complianceRouter);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'VaultShift FinCore API is running' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});