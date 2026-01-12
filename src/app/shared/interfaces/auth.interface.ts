export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  status: string;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
    };
    token?: string;
  };
}
