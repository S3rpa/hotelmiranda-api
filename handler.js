import serverless from 'serverless-http';
import app from './src/app';

export const handler = serverless(app);
exports.app = async (event) => {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Función Lambda funcionando correctamente!' }),
    };
  };