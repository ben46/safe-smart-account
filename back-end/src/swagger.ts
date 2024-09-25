import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Safe Smart Account API',
            version: '1.0.0',
            description: 'API documentation for Safe Smart Account',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server',
            },
        ],
    },
    apis: ['./src/routes/*.ts'], 
};

const specs = swaggerJsdoc(options);

export { swaggerUi,specs };