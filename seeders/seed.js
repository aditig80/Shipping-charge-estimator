require('dotenv').config();
const { syncDB, Customer, Seller, Product, Warehouse } = require('../src/models');

const seed = async () => {
  await syncDB();

  await Warehouse.bulkCreate([
    { name: 'BLR_Warehouse', lat: 12.99999, lng: 37.923273, city: 'Bangalore', isActive: true },
    { name: 'MUMB_Warehouse', lat: 11.99999, lng: 27.923273, city: 'Mumbai', isActive: true },
  ]);

  const seller1 = await Seller.create({ name: 'Nestle Seller', lat: 13.0827, lng: 80.2707, city: 'Chennai' });
  const seller2 = await Seller.create({ name: 'Rice Seller', lat: 28.7041, lng: 77.1025, city: 'Delhi' });
  const seller3 = await Seller.create({ name: 'Sugar Seller', lat: 19.076, lng: 72.8777, city: 'Mumbai' });

  await Product.bulkCreate([
    { name: 'Maggie 500g', sellingPrice: 10, weightKg: 0.5, dimLength: 10, dimWidth: 10, dimHeight: 10, category: 'Noodles', sellerId: seller1.id },
    { name: 'Rice Bag 10kg', sellingPrice: 500, weightKg: 10, dimLength: 1000, dimWidth: 800, dimHeight: 500, category: 'Grains', sellerId: seller2.id },
    { name: 'Sugar Bag 25kg', sellingPrice: 700, weightKg: 25, dimLength: 1000, dimWidth: 900, dimHeight: 600, category: 'Sugar', sellerId: seller3.id },
  ]);

  await Customer.bulkCreate([
    { name: 'Shree Kirana Store', phone: '9847000000', lat: 11.232, lng: 23.445, city: 'Coimbatore', businessType: 'Kirana' },
    { name: 'Andheri Mini Mart', phone: '9101000000', lat: 17.232, lng: 33.445, city: 'Hyderabad', businessType: 'Kirana' },
  ]);

  console.log('Seeding complete!');
  process.exit(0);
};

seed();