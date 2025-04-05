import express from 'express';
import routes from './routes/index.js';
import db from './config/connection.js';

await db();

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.use(routes);
app.use((req, _res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}!`);
});
