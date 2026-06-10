export interface Product {
  sku: string;
  name: string;
  category: string;
  description: string;
  priceUnit: number | null;
  priceBox: number | null;
  imageUrl: string;
  available: boolean;
}

export interface AdminUser {
  id: string;
  username: string;
  createdAt: string;
}

export interface Session {
  token: string;
  user: AdminUser;
}
