import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import authRoutes from './routes/auth.routes';

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

// Swagger Setup
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'User-Admin CRUD API Documentation',
            version: '1.0.0',
        },
    },
    apis: ['./routes/*.ts'], // Path to the API routes (for auto-generating swagger documentation)
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the API');
});

// Use routes
app.use('/api/auth', authRoutes);

// Swagger UI for User Docs
app.use('/api/docs/user', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Swagger UI for Admin Docs
app.use('/api/docs/admin', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;
