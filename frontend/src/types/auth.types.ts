export interface LoginCredentials {
  username: string;
  password: string;
}
 
export interface LoginResponse {
  token: string;
}
 
export interface VerifyResponse {
  valid: boolean;
}
 
export interface AuthContextType {
  isAdmin: boolean;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
}