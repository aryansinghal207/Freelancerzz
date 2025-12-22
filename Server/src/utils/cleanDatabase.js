import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/freelancer_app';

async function cleanDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const collections = await mongoose.connection.db.collections();
    
    console.log('\n🗑️  Dropping all collections...\n');
    
    for (let collection of collections) {
      const name = collection.collectionName;
      await collection.drop();
      console.log(`✅ Dropped collection: ${name}`);
    }

    console.log('\n✅ Database cleaned successfully!');
    console.log('All collections have been removed. You can now start fresh.\n');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error cleaning database:', error);
    process.exit(1);
  }
}

cleanDatabase();
