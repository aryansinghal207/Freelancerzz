import mongoose from 'mongoose';
import User from '../models/User.js';
import Client from '../models/Client.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/freelancer_app';

async function fixClientUsers() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Find all client users without a clientId
    const clientUsers = await User.find({ role: 'client', clientId: null });
    console.log(`Found ${clientUsers.length} client users without clientId`);

    for (const user of clientUsers) {
      // Try to find a matching client by email
      const client = await Client.findOne({ email: user.email });
      
      if (client) {
        console.log(`Linking user ${user.email} to client ${client._id}`);
        user.clientId = client._id;
        await user.save();
      } else {
        console.log(`No matching client found for user ${user.email}`);
      }
    }

    console.log('Done!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixClientUsers();
