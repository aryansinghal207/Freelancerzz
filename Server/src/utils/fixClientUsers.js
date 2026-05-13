import dotenv from 'dotenv';
import prisma from '../prisma.js';

dotenv.config();

async function fixClientUsers() {
  try {
    await prisma.$connect();
    console.log('Connected to PostgreSQL');

    const clientUsers = await prisma.user.findMany({
      where: { role: 'client', clientId: null }
    });
    console.log(`Found ${clientUsers.length} client users without clientId`);

    for (const user of clientUsers) {
      const client = await prisma.client.findFirst({ where: { email: user.email } });
      if (client) {
        console.log(`Linking user ${user.email} to client ${client.id}`);
        await prisma.user.update({
          where: { id: user.id },
          data: { clientId: client.id }
        });
      } else {
        console.log(`No matching client found for user ${user.email}`);
      }
    }

    console.log('Done!');
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixClientUsers();
