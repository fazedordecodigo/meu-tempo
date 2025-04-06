export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  customUrl?: string;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
