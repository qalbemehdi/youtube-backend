import mongoose from 'mongoose';
const connectDB = async () => {
  try {
    const mongoUrl = `${process.env.MONGODB_URI}`;

    const connInst = await mongoose.connect(mongoUrl, {
      writeConcern: { w: 'majority' },
    });

    // Connection events
    mongoose.connection.on('connected', () => {
      console.log(`Connected to MongoDB on ${connInst.connection.host}`);
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB Connection Error:', err);
      process.exit(1);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Disconnected from MongoDB');
    });

  } catch (error) {
    console.error('MongoDB Connection Failed:', error);
    process.exit(1);
  }
};

export default connectDB;

