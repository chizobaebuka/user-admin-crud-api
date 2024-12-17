import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'User-Admin CRUD API Documentation',
            version: '1.0.0',
            description: 'This API handles User and Post management.',
        },
        components: {
            // securitySchemes: {
            //     BearerAuth: {
            //         type: 'http',
            //         scheme: 'bearer',
            //         bearerFormat: 'JWT',
            //         description: 'Enter your JWT token in the format: Bearer <token>',
            //     },
            // },
            securityDefinitions: {
                BearerAuth: {
                    type: 'apiKey',
                    name: 'Authorization',
                    in: 'header'
                }
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        name: { type: 'string' },
                        firstName: { type: 'string' },
                        email: { type: 'string', format: 'email' },
                        country: { type: 'string' },
                        password: { type: 'string' },
                        role: { type: 'string', enum: ['user', 'admin'] },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                    required: ['name', 'firstName', 'email', 'password'],
                },
                Post: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        user: { type: 'string', format: 'uuid' },
                        content: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                    required: ['user', 'content'],
                },
            },
        },
        security: [{ BearerAuth: [] }], // Apply BearerAuth globally
    },
    apis: ['./routes/*.ts'], // Path to your routes folder
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;