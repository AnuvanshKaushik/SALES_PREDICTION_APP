export interface User {
  id: string;
  email: string;
  name: string;
}

export interface PredictionData {
  store_id: number;
  sku_id: number;
  total_price: number;
  base_price: number;
  is_featured_sku: boolean;
  is_display_sku: boolean;
}

export interface PredictionResult {
  prediction: number;
  confidence: number;
  factors: {
    store_factor: number;
    sku_factor: number;
    price_factor: number;
    marketing_factor: number;
  };
}

export interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}