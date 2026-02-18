export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  car_brand: string;
  car_model: string;
  stock_status: 'in_stock' | 'out_of_stock' | 'low_stock';
  supplier_id: string;
  image_url: string | null;
  description?: string;
  created_at?: string;
  updated_at?: string;
   featured?: boolean;
}

export interface Supplier {
  id: string;
  supplier_name: string;
  phone: string;
  location: string;
  specialization: string;
  trust_score: number;
  email?: string;
  created_at?: string;
}

export interface Mechanic {
  id: string;
  name: string;
  garage_name: string;
  location: string;
  phone: string;
  referral_code: string;
  email?: string;
  created_at?: string;
}

export interface Order {
  id: string;
  customer_phone: string;
  customer_name?: string;
  requested_part: string;
  car_brand?: string;
  car_model?: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  profit_margin: number;
  supplier_used?: string;
  mechanic_referred?: string;
  total_amount?: number;
  created_at?: string;
  updated_at?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  created_at?: string;
}

export interface CarModel {
  brand: string;
  model: string;
  year_start: number;
  year_end: number | null;
}

export interface AIConversation {
  id: string;
  customer_phone: string;
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
  }>;
  escalated: boolean;
  created_at?: string;
}
