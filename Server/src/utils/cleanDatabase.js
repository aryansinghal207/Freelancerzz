import dotenv from 'dotenv';
import prisma from '../prisma.js';

dotenv.config();

async function cleanDatabase() {
  try {
    console.log('Connecting to PostgreSQL...');
    await prisma.$connect();
    console.log('? Connected to PostgreSQL');

    console.log('\n???  Cleaning all tables...\n');

    await prisma.message.deleteMany();
    await prisma.invoice.deleteMany();
    await prisma.workSession.deleteMany();
    await prisma.task.deleteMany();
    await prisma.project.deleteMany();
    await prisma.client.deleteMany();
    await prisma.user.deleteMany();

    console.log('\n? Database cleaned successfully! All tables are empty.\n');
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('? Error cleaning database:', error);
    process.exit(1);
  }
}

cleanDatabase();
