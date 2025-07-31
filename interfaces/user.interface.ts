export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
}

export interface UserRegistration {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}
