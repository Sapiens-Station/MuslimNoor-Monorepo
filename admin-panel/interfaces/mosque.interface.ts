// Payload to CREATE
export interface MosqueCreateDTO {
    name: string
    emailId: string
    contactNumber: string
    location: {
      lat: number
      lon: number
    }
  }
  
  // Payload to UPDATE (partial)
  export type MosqueUpdateDTO = Partial<MosqueCreateDTO>
  
  // What backend returns (simplified)
  export interface MosqueModel {
    _id: string
  
    name: string
    emailId: string
    contactNumber: string
  
    location: {
      lat: number
      lon: number
    }
  
    createdAt?: string
    updatedAt?: string
  }
  