// MUST be first import - loads .env.local before any other module
import './loadEnv';

import { createServerClient } from './supabaseClient';
import { Product, Supplier, Mechanic, FAQ, CarModel } from '@/types';

const supabase = createServerClient();

const suppliers: Omit<Supplier, 'id' | 'created_at'>[] = [
  { supplier_name: 'Rwanda Auto Parts Ltd', phone: '+250788111111', location: 'Kigali, Nyarugenge', specialization: 'Toyota & Honda parts', trust_score: 0.95, email: 'info@rwandaautoparts.rw' },
  { supplier_name: 'East African Motors', phone: '+250788222222', location: 'Kigali, Gasabo', specialization: 'European cars', trust_score: 0.88, email: 'contact@eamotors.rw' },
  { supplier_name: 'Kigali Spare Parts', phone: '+250788333333', location: 'Kigali, Kicukiro', specialization: 'All brands', trust_score: 0.92, email: 'sales@kigalispareparts.rw' },
  { supplier_name: 'Rwanda Car Solutions', phone: '+250788444444', location: 'Huye', specialization: 'Hyundai & Kia', trust_score: 0.85, email: 'info@rwandacarsolutions.rw' },
  { supplier_name: 'Auto World Rwanda', phone: '+250788555555', location: 'Musanze', specialization: 'Nissan & Mazda', trust_score: 0.90, email: 'hello@autoworldrw.rw' },
  { supplier_name: 'Premium Parts Co', phone: '+250788666666', location: 'Kigali, Nyarugenge', specialization: 'Luxury brands', trust_score: 0.93, email: 'info@premiumparts.rw' },
  { supplier_name: 'Quick Parts Rwanda', phone: '+250788777777', location: 'Rubavu', specialization: 'Fast delivery', trust_score: 0.87, email: 'orders@quickparts.rw' },
  { supplier_name: 'Rwanda Motors Supply', phone: '+250788888888', location: 'Kigali, Gasabo', specialization: 'Commercial vehicles', trust_score: 0.89, email: 'supply@rwandamotors.rw' },
  { supplier_name: 'Auto Express', phone: '+250788999999', location: 'Nyagatare', specialization: 'Budget parts', trust_score: 0.82, email: 'sales@autoexpress.rw' },
  { supplier_name: 'Genuine Parts Rwanda', phone: '+250788000000', location: 'Kigali, Kicukiro', specialization: 'OEM parts', trust_score: 0.94, email: 'genuine@partsrw.rw' },
];

const mechanics: Omit<Mechanic, 'id' | 'created_at'>[] = [
  { name: 'Jean Baptiste', garage_name: 'JB Auto Garage', location: 'Kigali, Nyarugenge', phone: '+250789111111', referral_code: 'JB001', email: 'jb@jbag.rw' },
  { name: 'Marie Claire', garage_name: 'MC Motors', location: 'Kigali, Gasabo', phone: '+250789222222', referral_code: 'MC002', email: 'marie@mcmotors.rw' },
  { name: 'Paul Nkurunziza', garage_name: 'PN Auto Services', location: 'Huye', phone: '+250789333333', referral_code: 'PN003', email: 'paul@pnauto.rw' },
  { name: 'Grace Uwimana', garage_name: 'Grace Garage', location: 'Musanze', phone: '+250789444444', referral_code: 'GR004', email: 'grace@garage.rw' },
  { name: 'David Mutabazi', garage_name: 'DM Auto Repair', location: 'Rubavu', phone: '+250789555555', referral_code: 'DM005', email: 'david@dmauto.rw' },
];

const faqs: Omit<FAQ, 'id' | 'created_at'>[] = [
  { question: 'How do I find parts for my car?', answer: 'Use our search bar to enter your car brand and model. You can also browse by category or use our AI assistant for help.', category: 'General' },
  { question: 'What payment methods do you accept?', answer: 'We accept mobile money (MTN, Airtel), bank transfers, and cash on delivery.', category: 'Payment' },
  { question: 'How long does delivery take?', answer: 'Delivery typically takes 1-3 business days within Kigali and 3-5 days for other regions.', category: 'Delivery' },
  { question: 'Do you offer installation services?', answer: 'Yes! We partner with trusted mechanics. You can request a mechanic referral when placing your order.', category: 'Services' },
  { question: 'What if the part doesn\'t fit my car?', answer: 'We offer a 7-day return policy. If the part doesn\'t fit, contact us for a refund or exchange.', category: 'Returns' },
  { question: 'Are the parts genuine?', answer: 'We work with verified suppliers. All parts come with quality guarantees. OEM parts are clearly marked.', category: 'Quality' },
  { question: 'Can I order parts for any car brand?', answer: 'Yes, we stock parts for all major brands including Toyota, Honda, Nissan, Hyundai, and European brands.', category: 'Products' },
  { question: 'How do I track my order?', answer: 'You will receive WhatsApp updates with your order status. You can also check your order in the dashboard.', category: 'Orders' },
  { question: 'Do you have a physical store?', answer: 'We operate online with multiple supplier locations. You can pick up orders from our partner locations.', category: 'Location' },
  { question: 'What is your warranty policy?', answer: 'Most parts come with a 6-month warranty. Warranty details are provided with each product.', category: 'Warranty' },
];

const carModels: Omit<CarModel, 'id' | 'created_at'>[] = [
  { brand: 'Toyota', model: 'Corolla', year_start: 2000, year_end: 2024 },
  { brand: 'Toyota', model: 'RAV4', year_start: 2005, year_end: 2024 },
  { brand: 'Toyota', model: 'Hilux', year_start: 2000, year_end: 2024 },
  { brand: 'Honda', model: 'Civic', year_start: 2000, year_end: 2024 },
  { brand: 'Honda', model: 'CR-V', year_start: 2005, year_end: 2024 },
  { brand: 'Nissan', model: 'X-Trail', year_start: 2005, year_end: 2024 },
  { brand: 'Nissan', model: 'Navara', year_start: 2010, year_end: 2024 },
  { brand: 'Hyundai', model: 'Tucson', year_start: 2010, year_end: 2024 },
  { brand: 'Hyundai', model: 'Elantra', year_start: 2005, year_end: 2024 },
  { brand: 'Kia', model: 'Sportage', year_start: 2010, year_end: 2024 },
];

const products: Omit<Product, 'id' | 'created_at' | 'updated_at'>[] = [
  // Toyota Corolla parts
  { name: 'Toyota Corolla Brake Pad Set', category: 'Brakes', price: 45000, car_brand: 'Toyota', car_model: 'Corolla', stock_status: 'in_stock', supplier_id: '', image_url: null, description: 'High-quality brake pads for Toyota Corolla 2000-2024' },
  { name: 'Toyota Corolla Air Filter', category: 'Engine', price: 12000, car_brand: 'Toyota', car_model: 'Corolla', stock_status: 'in_stock', supplier_id: '', image_url: null, description: 'OEM air filter for Toyota Corolla' },
  { name: 'Toyota Corolla Oil Filter', category: 'Engine', price: 8000, car_brand: 'Toyota', car_model: 'Corolla', stock_status: 'in_stock', supplier_id: '', image_url: null, description: 'Genuine oil filter for Toyota Corolla' },
  { name: 'Toyota Corolla Spark Plugs Set', category: 'Engine', price: 25000, car_brand: 'Toyota', car_model: 'Corolla', stock_status: 'in_stock', supplier_id: '', image_url: null, description: 'Set of 4 spark plugs for Toyota Corolla' },
  { name: 'Toyota Corolla Timing Belt', category: 'Engine', price: 65000, car_brand: 'Toyota', car_model: 'Corolla', stock_status: 'in_stock', supplier_id: '', image_url: null, description: 'Timing belt kit for Toyota Corolla' },
  
  // Toyota RAV4 parts
  { name: 'Toyota RAV4 Front Bumper', category: 'Body Parts', price: 180000, car_brand: 'Toyota', car_model: 'RAV4', stock_status: 'in_stock', supplier_id: '', image_url: null, description: 'Front bumper for Toyota RAV4' },
  { name: 'Toyota RAV4 Headlight Assembly', category: 'Lighting', price: 120000, car_brand: 'Toyota', car_model: 'RAV4', stock_status: 'in_stock', supplier_id: '', image_url: null, description: 'LED headlight assembly for Toyota RAV4' },
  { name: 'Toyota RAV4 Windshield Wiper Blades', category: 'Accessories', price: 15000, car_brand: 'Toyota', car_model: 'RAV4', stock_status: 'in_stock', supplier_id: '', image_url: null, description: 'Pair of windshield wiper blades' },
  
  // Honda Civic parts
  { name: 'Honda Civic Brake Discs', category: 'Brakes', price: 85000, car_brand: 'Honda', car_model: 'Civic', stock_status: 'in_stock', supplier_id: '', image_url: null, description: 'Front brake discs for Honda Civic' },
  { name: 'Honda Civic Radiator', category: 'Cooling', price: 95000, car_brand: 'Honda', car_model: 'Civic', stock_status: 'in_stock', supplier_id: '', image_url: null, description: 'Radiator for Honda Civic' },
  { name: 'Honda Civic Alternator', category: 'Electrical', price: 180000, car_brand: 'Honda', car_model: 'Civic', stock_status: 'in_stock', supplier_id: '', image_url: null, description: 'Reconditioned alternator for Honda Civic' },
  { name: 'Honda Civic Battery', category: 'Electrical', price: 120000, car_brand: 'Honda', car_model: 'Civic', stock_status: 'in_stock', supplier_id: '', image_url: null, description: '12V car battery for Honda Civic' },
  
  // Honda CR-V parts
  { name: 'Honda CR-V Suspension Strut', category: 'Suspension', price: 150000, car_brand: 'Honda', car_model: 'CR-V', stock_status: 'in_stock', supplier_id: '', image_url: null, description: 'Front suspension strut for Honda CR-V' },
  { name: 'Honda CR-V CV Joint', category: 'Drivetrain', price: 75000, car_brand: 'Honda', car_model: 'CR-V', stock_status: 'in_stock', supplier_id: '', image_url: null, description: 'CV joint for Honda CR-V' },
  
  // Nissan X-Trail parts
  { name: 'Nissan X-Trail Fuel Pump', category: 'Fuel System', price: 140000, car_brand: 'Nissan', car_model: 'X-Trail', stock_status: 'in_stock', supplier_id: '', image_url: null, description: 'Electric fuel pump for Nissan X-Trail' },
  { name: 'Nissan X-Trail Starter Motor', category: 'Electrical', price: 160000, car_brand: 'Nissan', car_model: 'X-Trail', stock_status: 'in_stock', supplier_id: '', image_url: null, description: 'Starter motor for Nissan X-Trail' },
  { name: 'Nissan X-Trail Clutch Kit', category: 'Transmission', price: 220000, car_brand: 'Nissan', car_model: 'X-Trail', stock_status: 'in_stock', supplier_id: '', image_url: null, description: 'Complete clutch kit for Nissan X-Trail' },
  
  // Nissan Navara parts
  { name: 'Nissan Navara Tailgate', category: 'Body Parts', price: 250000, car_brand: 'Nissan', car_model: 'Navara', stock_status: 'in_stock', supplier_id: '', image_url: null, description: 'Tailgate for Nissan Navara pickup' },
  { name: 'Nissan Navara Shock Absorber', category: 'Suspension', price: 85000, car_brand: 'Nissan', car_model: 'Navara', stock_status: 'in_stock', supplier_id: '', image_url: null, description: 'Rear shock absorber for Nissan Navara' },
  
  // Hyundai Tucson parts
  { name: 'Hyundai Tucson Transmission Fluid', category: 'Transmission', price: 35000, car_brand: 'Hyundai', car_model: 'Tucson', stock_status: 'in_stock', supplier_id: '', image_url: null, description: 'ATF fluid for Hyundai Tucson' },
  { name: 'Hyundai Tucson Power Steering Pump', category: 'Steering', price: 180000, car_brand: 'Hyundai', car_model: 'Tucson', stock_status: 'in_stock', supplier_id: '', image_url: null, description: 'Power steering pump for Hyundai Tucson' },
  { name: 'Hyundai Tucson Cabin Air Filter', category: 'HVAC', price: 18000, car_brand: 'Hyundai', car_model: 'Tucson', stock_status: 'in_stock', supplier_id: '', image_url: null, description: 'Cabin air filter for Hyundai Tucson' },
  
  // Hyundai Elantra parts
  { name: 'Hyundai Elantra Water Pump', category: 'Cooling', price: 95000, car_brand: 'Hyundai', car_model: 'Elantra', stock_status: 'in_stock', supplier_id: '', image_url: null, description: 'Water pump for Hyundai Elantra' },
  { name: 'Hyundai Elantra Thermostat', category: 'Cooling', price: 15000, car_brand: 'Hyundai', car_model: 'Elantra', stock_status: 'in_stock', supplier_id: '', image_url: null, description: 'Engine thermostat for Hyundai Elantra' },
  
  // Kia Sportage parts
  { name: 'Kia Sportage Brake Caliper', category: 'Brakes', price: 120000, car_brand: 'Kia', car_model: 'Sportage', stock_status: 'in_stock', supplier_id: '', image_url: null, description: 'Front brake caliper for Kia Sportage' },
  { name: 'Kia Sportage Oxygen Sensor', category: 'Engine', price: 65000, car_brand: 'Kia', car_model: 'Sportage', stock_status: 'in_stock', supplier_id: '', image_url: null, description: 'O2 sensor for Kia Sportage' },
  
  // Generic parts
  { name: 'Universal Car Battery 12V 60Ah', category: 'Electrical', price: 95000, car_brand: 'Universal', car_model: 'All', stock_status: 'in_stock', supplier_id: '', image_url: null, description: 'Universal 12V car battery suitable for most vehicles' },
  { name: 'Engine Oil 5W-30 (5L)', category: 'Engine', price: 25000, car_brand: 'Universal', car_model: 'All', stock_status: 'in_stock', supplier_id: '', image_url: null, description: 'Synthetic engine oil 5W-30 grade' },
  { name: 'Engine Oil 10W-40 (5L)', category: 'Engine', price: 22000, car_brand: 'Universal', car_model: 'All', stock_status: 'in_stock', supplier_id: '', image_url: null, description: 'Conventional engine oil 10W-40 grade' },
  { name: 'Brake Fluid DOT 4 (500ml)', category: 'Brakes', price: 8000, car_brand: 'Universal', car_model: 'All', stock_status: 'in_stock', supplier_id: '', image_url: null, description: 'High-quality brake fluid DOT 4' },
  { name: 'Coolant/Antifreeze (5L)', category: 'Cooling', price: 18000, car_brand: 'Universal', car_model: 'All', stock_status: 'in_stock', supplier_id: '', image_url: null, description: 'Universal coolant/antifreeze concentrate' },
  { name: 'Windshield Washer Fluid (2L)', category: 'Accessories', price: 5000, car_brand: 'Universal', car_model: 'All', stock_status: 'in_stock', supplier_id: '', image_url: null, description: 'Windshield washer fluid concentrate' },
  { name: 'Car Air Freshener', category: 'Accessories', price: 3000, car_brand: 'Universal', car_model: 'All', stock_status: 'in_stock', supplier_id: '', image_url: null, description: 'Long-lasting car air freshener' },
  { name: 'Car Floor Mats Set', category: 'Accessories', price: 35000, car_brand: 'Universal', car_model: 'All', stock_status: 'in_stock', supplier_id: '', image_url: null, description: 'Universal car floor mats set (4 pieces)' },
  { name: 'Car Phone Holder', category: 'Accessories', price: 12000, car_brand: 'Universal', car_model: 'All', stock_status: 'in_stock', supplier_id: '', image_url: null, description: 'Universal car phone mount holder' },
  { name: 'Car Charger USB-C', category: 'Accessories', price: 8000, car_brand: 'Universal', car_model: 'All', stock_status: 'in_stock', supplier_id: '', image_url: null, description: 'Dual USB car charger with fast charging' },
];

async function seed() {
  console.log('Starting database seed...');

  // Insert suppliers
  console.log('Inserting suppliers...');
  const { data: supplierData, error: supplierError } = await supabase
    .from('suppliers')
    .insert(suppliers)
    .select('id');

  if (supplierError) {
    console.error('Error inserting suppliers:', supplierError);
    return;
  }

  console.log(`Inserted ${supplierData.length} suppliers`);

  // Insert mechanics
  console.log('Inserting mechanics...');
  const { data: mechanicData, error: mechanicError } = await supabase
    .from('mechanics')
    .insert(mechanics)
    .select('id');

  if (mechanicError) {
    console.error('Error inserting mechanics:', mechanicError);
    return;
  }

  console.log(`Inserted ${mechanicData.length} mechanics`);

  // Insert FAQs
  console.log('Inserting FAQs...');
  const { error: faqError } = await supabase.from('faqs').insert(faqs);
  if (faqError) {
    console.error('Error inserting FAQs:', faqError);
  } else {
    console.log(`Inserted ${faqs.length} FAQs`);
  }

  // Insert car models
  console.log('Inserting car models...');
  const { error: carModelError } = await supabase.from('car_models').insert(carModels);
  if (carModelError) {
    console.error('Error inserting car models:', carModelError);
  } else {
    console.log(`Inserted ${carModels.length} car models`);
  }

  // Assign suppliers to products (round-robin)
  const productsWithSuppliers = products.map((product, index) => ({
    ...product,
    supplier_id: supplierData[index % supplierData.length].id,
  }));

  // Insert products
  console.log('Inserting products...');
  const { error: productError } = await supabase.from('products').insert(productsWithSuppliers);
  if (productError) {
    console.error('Error inserting products:', productError);
  } else {
    console.log(`Inserted ${products.length} products`);
  }

  console.log('Seed completed successfully!');
}

// Run seed if executed directly
if (require.main === module) {
  seed().catch(console.error);
}

export default seed;
