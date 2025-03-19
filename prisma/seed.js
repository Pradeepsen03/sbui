import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Hash password for users
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Seed Users
  await prisma.users.createMany({
    data: [
      {
        name: 'John Doe',
        email: 'john1@example.com',
        password: hashedPassword,
        role: 'ADMIN',
      },
      {
        name: 'Jane Smith',
        email: 'jane1@example.com',
        password: hashedPassword,
        role: 'ACC',
      },
      {
        name: 'David Miller',
        email: 'david1@example.com',
        password: hashedPassword,
        role: 'USER',
      },
      {
        name: 'ps',
        email: 'ps@example.com',
        password: hashedPassword,
        role: 'ADMIN',
      }
    ],
    skipDuplicates: true,
  });

  // Seed Production Companies
  await prisma.productionCompanies.createMany({
    data: [
      {
        name: 'ABC Productions1',
        website: 'https://abcproductions.com',
        email: 'contact@abcproductions.com',
        phone: '123-456-7890',
      },
      {
        name: 'XYZ Studios1',
        website: 'https://xyzstudios.com',
        email: 'info@xyzstudios.com',
        phone: '987-654-3210',
      },
    ],
    skipDuplicates: true, // ✅ This prevents errors due to duplicate entries
  });
  

  // Seed Project Managers
  const projectManager1 = await prisma.projectManagers.create({
    data: {
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice.manager1@example.com',
      phone: '111-222-3333',
    },
  });

  const projectManager2 = await prisma.projectManagers.create({
    data: {
      firstName: 'Bob',
      lastName: 'Williams',
      email: 'bob.manager1@example.com',
      phone: '444-555-6666',
    },
  });

  // Seed Clients
  const client1 = await prisma.clients.create({
    data: {
      firstName: 'Michael',
      lastName: 'Scott',
      email: 'michael1@dundermifflin.com',
      phone: '555-123-4567',
      streetAddress: '123 Paper St',
      city: 'Scranton',
      state: 'PA',
      zip: '18503',
      contactPersonFirst: 'Jim',
      contactPersonLast: 'Halpert',
      note: 'Key client for office projects.',
    },
  });

  const client2 = await prisma.clients.create({
    data: {
      firstName: 'Rachel',
      lastName: 'Green',
      email: 'rachel1@fashionworld.com',
      phone: '555-987-6543',
      streetAddress: '456 Fashion Ave',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      contactPersonFirst: 'Monica',
      contactPersonLast: 'Geller',
      note: 'Regular client from fashion industry.',
    },
  });

  // Seed Projects
  const project1 = await prisma.projects.create({
    data: {
      projectName: 'Film Production A1',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-06-30'),
      status: 'IN_PROGRESS',
    },
  });

  const project2 = await prisma.projects.create({
    data: {
      projectName: 'Music Video B1',
      startDate: new Date('2024-04-15'),
      endDate: new Date('2024-07-20'),
      status: 'PENDING',
    },
  });

  // Seed CallSheets
  await prisma.callSheets.createMany({
    data: [
      {
        callSheetDate: new Date('2024-03-10'),
        shootLocation: 'Downtown Studio A',
        streetAddress: '123 Main St',
        city: 'Los Angeles',
        state: 'CA',
        zip: '90001',
        startTime: new Date('2024-03-10T08:00:00'),
        endTime: new Date('2024-03-10T18:00:00'),
        parkingNotes: 'Parking available in lot B',
        projectId: project1.id,
      },
      {
        callSheetDate: new Date('2024-04-20'),
        shootLocation: 'Beachside Film Set',
        streetAddress: '789 Ocean Ave',
        city: 'Miami',
        state: 'FL',
        zip: '33101',
        startTime: new Date('2024-04-20T07:30:00'),
        endTime: new Date('2024-04-20T17:00:00'),
        parkingNotes: 'Park in designated crew lot',
        projectId: project2.id,
      },
    ],
    skipDuplicates: true,
  });

  console.log('Seeding completed!');
}

main()
  .catch((error) => {
    console.error('Error seeding database:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
