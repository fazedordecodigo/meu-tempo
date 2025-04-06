export interface Service {
  id: string;
  name: string;
  description?: string;
  duration: number;
  price?: number;
  isActive: boolean;
  color: string;
  createdAt: string;
  updatedAt: string;
}