import awsServerlessExpress from 'aws-serverless-express';
import app from './src/app';
import { APIGatewayProxyHandler } from 'aws-lambda';

// Crea el servidor usando aws-serverless-express
const server = awsServerlessExpress.createServer(app);

// Handler para AWS Lambda
export const handler = (event, context) => {
    awsServerlessExpress.proxy(server, event, context);
};