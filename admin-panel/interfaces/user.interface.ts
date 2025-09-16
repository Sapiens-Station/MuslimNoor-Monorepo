// DTOs
export interface SignupDTO {
  name: string
  email: string
  password: string
  mosqueId?: string
}

export interface LoginDTO {
  email: string
  password: string
}

export interface UserUpdateDTO {
  name?: string
  email?: string
  password?: string
  contact?: string
}

// Model returned from backend
export interface UserModel {
  _id: string
  name: string
  email: string
  role: 'user' | 'mosqueAuthority' | 'admin'
  mosqueId?: string
  createdAt?: string
  updatedAt?: string
}
