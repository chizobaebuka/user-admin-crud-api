import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'User-Admin CRUD API Documentation',
        version: '1.0.0',
        description: 'This API handles User and Post management.',
    },
    host: 'localhost:8080',
    basePath: '/',
    paths: {
        '/api/admin/create-admin': {
            post: {
                summary: 'Create an admin user',
                description: 'Creates an admin user with the provided user ID',
                tags: ['Admin'],
                security: [{ JWTAuth: [] }],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    userId: { type: 'string', format: 'uuid' },
                                },
                                required: ['userId'],
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'User role updated to admin successfully',
                        schema: {
                            type: 'object',
                            properties: {
                                message: { type: 'string' },
                                user: {
                                    type: 'object',
                                    properties: {
                                        id: { type: 'string', format: 'uuid' },
                                        email: { type: 'string', format: 'email' },
                                        role: { type: 'string' },
                                    },
                                },
                            },
                        },
                    },
                    400: {
                        description: 'Bad Request',
                    },
                    404: {
                        description: 'User not found',
                    },
                    500: {
                        description: 'Internal Server Error',
                    },
                },
            },
        },
        '/api/auth/signup': {
            post: {
                summary: 'Register a new user',
                description: 'Registers a new user with the provided details',
                tags: ['Users'],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string' },
                                    firstName: { type: 'string' },
                                    email: { type: 'string', format: 'email' },
                                    password: { type: 'string' },
                                    country: { type: 'string' },
                                },
                                required: ['name', 'firstName', 'email', 'password', 'country'],
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'User registered successfully',
                        schema: {
                            $ref: '#/components/schemas/User',
                        },
                    },
                    400: {
                        description: 'Bad Request',
                    },
                    500: {
                        description: 'Internal Server Error',
                    },
                },
            }
        },
        '/api/auth/verify': {
            post: {
                summary: 'Verify a user',
                description: 'Verifies a user with the provided email address  using the verification code',
                tags: ['Users'],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: { type: 'string', format: 'email' },
                                    verificationCode: { type: 'string' },
                                },
                                required: ['email', 'verificationCode'],
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'User verified successfully',
                    },
                    400: {
                        description: 'Bad Request',
                    },
                    500: {
                        description: 'Internal Server Error',
                    },
                },
            },
        },
        '/api/auth/login': {
            post: {
                summary: 'Login a user',
                description: 'Logs in a user with the provided email address and password',
                tags: ['Users'],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: { type: 'string', format: 'email' },
                                    password: { type: 'string' },
                                },
                                required: ['email', 'password'],
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'User logged in successfully',
                        schema: {
                            $ref: '#/components/schemas/User',
                        },
                    },
                    400: {
                        description: 'Bad Request',
                    },
                    500: {
                        description: 'Internal Server Error',
                    },
                },
            },
        },
        '/api/auth/profile': {
            get: {
                summary: 'Get user profile',
                description: 'Fetches the profile of the logged-in user',
                tags: ['Users'],
                security: [{ JWTAuth: [] }],
                responses: {
                    200: {
                        description: 'User profile fetched successfully',
                        schema: {
                            $ref: '#/components/schemas/User',
                        },
                    },
                    401: {
                        description: 'Unauthorized',
                    },
                    500: {
                        description: 'Internal Server Error',
                    },
                },
            },
        },
        '/api/post/create': {
            post: {
                summary: 'Create a new post',
                description: 'Creates a new post with the provided content',
                tags: ['Posts'],
                security: [{ JWTAuth: [] }],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    content: { type: 'string' },
                                },
                                required: ['content'],
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'Post created successfully',
                        schema: {
                            $ref: '#/components/schemas/Post',
                        },
                    },
                    401: {
                        description: 'Unauthorized',
                    },
                    500: {
                        description: 'Internal Server Error',
                    },
                },
            },
        },
        '/api/post/{postId}': {
            put: {
                summary: 'Update an existing post',
                description: 'Updates an existing post with the provided content',
                tags: ['Posts'],
                security: [{ JWTAuth: [] }],
                parameters: [
                    {
                        name: 'postId',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                        description: 'The ID of the post to update',
                    },
                ],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    content: { type: 'string' },
                                },
                                required: ['content'],
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Post updated successfully',
                        schema: {
                            $ref: '#/components/schemas/Post',
                        },
                    },
                    401: {
                        description: 'Unauthorized',
                    },
                    500: {
                        description: 'Internal Server Error',
                    },
                },
            },
            delete: {
                summary: 'Delete an existing post',
                description: 'Deletes an existing post',
                tags: ['Posts'],
                security: [{ JWTAuth: [] }],
                parameters: [
                    {
                        name: 'postId',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                        description: 'The ID of the post to delete',
                    },
                ],
                responses: {
                    200: {
                        description: 'Post deleted successfully',
                    },
                    401: {
                        description: 'Unauthorized',
                    },
                    500: {
                        description: 'Internal Server Error',
                    },
                },
            },
            get: {
                summary: 'Get an existing post',
                description: 'Fetches an existing post',
                tags: ['Posts'],
                security: [{ BearerAuth: [] }],
                parameters: [
                    {
                        name: 'postId',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                        description: 'The ID of the post to fetch',
                    },
                ],
                responses: {
                    200: {
                        description: 'Post fetched successfully',
                        schema: {
                            $ref: '#/components/schemas/Post',
                        },
                    },
                    401: {
                        description: 'Unauthorized',
                    },
                    500: {
                        description: 'Internal Server Error',
                    },
                },
            },
        },
        '/api/comment': {
            post: {
                summary: 'Create a new comment',
                description: 'Creates a new comment with the provided content',
                tags: ['Comments'],
                security: [{ JWTAuth: [] }],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    postId: { type: 'string', format: 'uuid' },
                                    content: { type: 'string' },
                                },
                                required: ['postId', 'content'],
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'Comment created successfully',
                        schema: {
                            $ref: '#/components/schemas/Post',
                        },
                    },
                    401: {
                        description: 'Unauthorized',
                    },
                    500: {
                        description: 'Internal Server Error',
                    },
                },
            },
        },
        '/api/comment/all': {
            get: {
                summary: 'Get all comments',
                description: 'Fetches all comments',
                tags: ['Comments'],
                security: [{ JWTAuth: [] }],
                responses: {
                    200: {
                        description: 'Comments fetched successfully',
                        schema: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/Comment',
                            },
                        },
                    },
                    500: {
                        description: 'Internal Server Error',
                    },
                },
            },
        },
        '/api/comment/{postId}': {
            get: {
                summary: 'Get comments for a specific post',
                description: 'Fetches comments for a specific post',
                tags: ['Comments'],
                parameters: [
                    {
                        name: 'postId',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                        description: 'The ID of the post to fetch comments for',
                    },
                ],
                responses: {
                    200: {
                        description: 'Comments fetched successfully',
                        schema: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/Comment',
                            },
                        },
                    },
                    500: {
                        description: 'Internal Server Error',
                    },
                },
            },
        },
        '/api/comment/by/{commentId}': {
            get: {
                summary: 'Get a comment by ID',
                description: 'Fetches a comment by its ID',
                tags: ['Comments'],
                security: [{ JWTAuth: [] }],
                parameters: [
                    {
                        name: 'commentId',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                        description: 'The ID of the comment to fetch',
                    },
                ],
                responses: {
                    200: {
                        description: 'Comment fetched successfully',
                        schema: {
                            $ref: '#/components/schemas/Comment',
                        },
                    },
                    500: {
                        description: 'Internal Server Error',
                    },
                },
            },
        },
        '/api/comment/{commentId}': {
            put: {
                summary: 'Update a comment',
                description: 'Updates a comment with the provided content',
                tags: ['Comments'],
                security: [{ JWTAuth: [] }],
                parameters: [
                    {
                        name: 'commentId',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                        description: 'The ID of the comment to update',
                    },
                ],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    content: { type: 'string' },
                                },
                                required: ['content'],
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Comment updated successfully',
                        schema: {
                            $ref: '#/components/schemas/Comment',
                        },
                    },
                    401: {
                        description: 'Unauthorized',
                    },
                    500: {
                        description: 'Internal Server Error',
                    },
                },
            },
            delete: {
                summary: 'Delete a comment',
                description: 'Deletes a comment',
                tags: ['Comments'],
                security: [{ JWTAuth: [] }],
                parameters: [
                    {
                        name: 'commentId',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                        description: 'The ID of the comment to delete',
                    },
                ],
                responses: {
                    200: {
                        description: 'Comment deleted successfully',
                    },
                    401: {
                        description: 'Unauthorized',
                    },
                    500: {
                        description: 'Internal Server Error',
                    },
                },
            },
        },
    },
    securityDefinitions: {
        JWTAuth: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header'
        }
    },
    components: {
        securitySchemes: {
            JWTAuth: {
                type: 'apiKey',
                name: 'Authorization',
                in: 'header'
            },
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
            Comment: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' },
                    userId: { type: 'string', format: 'uuid' },
                    postId: { type: 'string', format: 'uuid' },
                    content: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                },
                required: ['userId', 'postId', 'content'],
            },
        },
    },
};

const options = {
    swaggerDefinition,
    apis: ['./routes/*.ts'],
}

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;