import express from 'express';
import cors from 'cors';
import userRoutes from './modules/users/users.routes.js';
import recommendationRoutes from './modules/recommendations/recommendations.routes.js';
import domainRoutes from './modules/domains/domains.routes.js';
import skillRelationsRoutes from './modules/skill-relations/skillRelations.routes.js';

const app = express();
const PORT = process.env.PORT ?? 5000;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/users', userRoutes);
app.use('/users', recommendationRoutes);
app.use('/domains', domainRoutes);
app.use('/skills', skillRelationsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
