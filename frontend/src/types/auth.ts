export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface RegisteredUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}