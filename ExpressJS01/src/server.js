import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
import express from 'express';
import configViewEngine from './config/viewEngine.js';
import apiRoutes from './routes/api.js';
import connection from './config/database.js';
import { getHomepage } from './controllers/homeController.js';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 8888;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
configViewEngine(app);

const webAPI = express.Router();
webAPI.get('/', getHomepage);
app.use('/', webAPI);

app.use('/v1/api/', apiRoutes);

(async () => {
  try {
    await connection();
    app.listen(port, () => {});
    console.log(`Backend Nodejs App listening on port ${port}`);
  } catch (error) {
    console.log('>>> Error connect to DB: ', error);
  }
})();
