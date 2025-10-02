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

// Model returned from backend
export interface UserModel {
  _id: string
  name: string
  email: string
  role: 'user' | 'mosqueAuthority' | 'admin'
  mosqueId?: string
  contactNumber?: string | null
  fcmToken?: string | null
  createdAt?: string
  updatedAt?: string
}

export interface UserUpdateDTO {
  name?: string
  email?: string
  password?: string
  contactNumber?: string
  mosqueId?: string | null
  fcmToken?: string | null
}
