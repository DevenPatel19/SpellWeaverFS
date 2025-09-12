import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const connectDB = async () => {
  try {
    // Construct the MongoDB URI using environment variables
    const dbURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kxrin1v.mongodb.net/SpellweaverDB?retryWrites=true&w=majority&appName=Cluster0`;
    
    const conn = await mongoose.connect(dbURI, {

    });

    console.log(`MongoDB Connected: ${conn.connection.host}🎈🎈🎈🎈`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// MongoDB connection event handlers
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to DB🎉🎉');
});

mongoose.connection.on('error', (err) => {
  console.log(`Mongoose connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// Close connection on app termination
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Mongoose connection closed through app termination');
  process.exit(0);
});

export default connectDB;