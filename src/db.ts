// db.ts
import mongoose from 'mongoose';

let isConnected = false;

export const connectToDatabase = async () => {
  if (isConnected) {
    console.log('Reutilizando conexión a MongoDB');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI || '');
    isConnected = true;
    console.log('Conectado a MongoDB');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    throw error;
  }
};