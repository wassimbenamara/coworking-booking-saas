
export interface RegisteredUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

export interface AuthenticatedUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface LoginResponse {
  user: AuthenticatedUser;
  accessToken: string;
}