#### User-Admin CRUD API
A Node.js/Express application that provides APIs for user and admin management, CRUD operations on posts and comments, and role-based access control. The application follows clean architecture principles, uses MongoDB for data persistence, and includes Swagger API documentation.

#### Project Overview
This API is built to manage user authentication, roles, and resources. It enables:

- User and Admin role creation.
- CRUD operations for Posts and Comments.
- User authentication with JWT-based authorization.
- Role-based access control for restricted endpoints.
- Swagger documentation for API visualization

#### Features
- User Authentication: Sign up, log in, and email verification.
- Role Management: Assign user or admin roles to users.
- CRUD Operations: Create, Read, Update, and Delete functionality for posts and comments.
- Role-Based Access Control: Admin-only operations for specific routes.
- Swagger Integration: Easily view and test APIs using Swagger UI.
- Rate Limiter on all endpoints and logging functionality

#### TECH STACK 
Nodejs, ExpressJS, mongoose ODM, mongoDB, typescript, JWT, swaggerUi, nodemon, winston (logger)

#### STEPS TO TEST
- git clone the repo ()
- npm install (install all dependencies used & dev dependencies)
- set up your env taking sample at the .env.sample
- npm run start
- start testing using swagger at `http://localhost:${port}/api/docs` 


