
import express from 'express';


const app = express();

//Import routes
import authRoutes from './routes/auth.routes.js';
import usersRoutes from './routes/users.routes.js';
import tasksRoutes from './routes/tasks.routes.js';
import morgan from 'morgan';
import errorHandler from './middlewares/errorHandler.js';
import notFound from './middlewares/notFound.js';
import { authenticateToken } from './middlewares/authenticate.js';

//import middlewares
app.use(morgan('dev'));// Middleware para registrar las peticiones HTTP en la consola
app.use(express.json());


//Routes
app.use('/api/login',authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/tasks', authenticateToken, tasksRoutes);

app.use(notFound);// Middleware para manejar rutas no encontradas
app.use(errorHandler); // Middleware para manejar errores

export default app;


