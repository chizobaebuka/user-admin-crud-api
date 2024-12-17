import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import authRoutes from './routes/auth.routes';
import postRoutes from './routes/post.routes';
import adminRoutes from './routes/admin.routes';
import commentRoutes from './routes/comment.routes';
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
app.use('/api/admin', adminRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);

// Swagger docs
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;
