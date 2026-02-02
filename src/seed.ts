import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { User } from './models/User';
import { Bag } from './models/Bag';

dotenv.config();

const sampleBags = [
  {
    name: 'Classic Leather Tote',
    description: 'A timeless leather tote bag perfect for everyday use. Features spacious interior with multiple pockets for organization. Made from premium full-grain leather.',
    price: 299.99,
    category: 'tote',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=600&fit=crop',
    stock: 15,
  },
  {
    name: 'Urban Explorer Backpack',
    description: 'Modern backpack designed for the urban adventurer. Water-resistant material with padded laptop compartment. Perfect for commuting or travel.',
    price: 189.99,
    category: 'backpack',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop',
    stock: 25,
  },
  {
    name: 'Elegant Evening Clutch',
    description: 'Sophisticated clutch for special occasions. Delicate chain strap included. Interior card slots and mirror. Available in multiple colors.',
    price: 149.99,
    category: 'clutch',
    image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&h=600&fit=crop',
    stock: 20,
  },
  {
    name: 'Professional Messenger Bag',
    description: 'Sleek messenger bag for the modern professional. Adjustable shoulder strap with padded laptop sleeve. Multiple compartments for accessories.',
    price: 229.99,
    category: 'messenger',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop',
    stock: 18,
  },
  {
    name: 'Compact Crossbody Bag',
    description: 'Stylish crossbody bag for hands-free convenience. Adjustable strap length. Perfect for shopping, traveling, or everyday errands.',
    price: 129.99,
    category: 'crossbody',
    image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&h=600&fit=crop',
    stock: 30,
  },
  {
    name: 'Designer Handbag',
    description: 'Luxurious handbag crafted from Italian leather. Gold-tone hardware accents. Spacious interior with zippered pocket. A statement piece for any outfit.',
    price: 449.99,
    category: 'handbag',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=600&fit=crop',
    stock: 10,
  },
  {
    name: 'Weekend Duffel Bag',
    description: 'Versatile duffel bag for short trips. Durable canvas exterior with leather trim. Multiple carry options including handles and shoulder strap.',
    price: 199.99,
    category: 'duffel',
    image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=600&h=600&fit=crop',
    stock: 12,
  },
  {
    name: 'Tech-Ready Laptop Bag',
    description: 'Purpose-built laptop bag with padded compartment for devices up to 15 inches. Water-resistant exterior. Organized pockets for cables and accessories.',
    price: 179.99,
    category: 'laptop',
    image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&h=600&fit=crop',
    stock: 22,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Bag.deleteMany({});
    console.log('Cleared existing data');

    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@bagshop.com',
      password: adminPassword,
      role: 'admin',
    });
    console.log('Created admin user:', admin.email);

    const userPassword = await bcrypt.hash('user123', 12);
    const user = await User.create({
      name: 'Test User',
      email: 'user@bagshop.com',
      password: userPassword,
      role: 'user',
    });
    console.log('Created regular user:', user.email);

    // Create sample bags
    const bags = await Bag.insertMany(sampleBags);
    console.log(`Created ${bags.length} sample bags`);

    console.log('\n--- Seed completed successfully! ---');
    console.log('\nTest credentials:');
    console.log('Admin: admin@bagshop.com / admin123');
    console.log('User: user@bagshop.com / user123');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
