export type Role = 'USER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Resource {
  id: string;
  name: string;
  category: string;
  description: string;
  availability: 'available' | 'unavailable';
  createdBy: { _id: string; name?: string; email?: string };
  createdAt: string;
}

export type RequestStatus = 'pending' | 'approved' | 'rejected';

export interface ResourceRequest {
  id: string;
  resourceId: Resource | string;
  userId: User | string;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}
