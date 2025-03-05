// scripts/seed-database.ts
import { seedRestaurants } from '@/lib/utils';

async function main() {
  try {
    console.log('Starting database seeding...');
    
    // Seed restaurants
    await seedRestaurants();
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

main();