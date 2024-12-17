import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import authRoutes from './routes/auth.routes';
import postRoutes from './routes/post.routes';
import swaggerSpec from './config/swagger';

dotenv.config();

const app = express();

// Middleware setup
app.use(cors({
    credentials: true,
    // origin: 'http://localhost:3000', // Uncomment for specific frontend CORS setup
}));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the API');
});

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);

// Swagger UI for User Docs
app.use('/api/docs/user', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Swagger UI for Admin Docs
app.use('/api/docs/admin', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;
