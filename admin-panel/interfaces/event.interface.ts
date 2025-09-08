// Frontend <-> Backend types

// Payload to CREATE
export interface EventCreateDTO {
  title: string;
  startLocal: string;       // "YYYY-MM-DDTHH:mm" (24h)
  endLocal?: string;        // "YYYY-MM-DDTHH:mm" (24h)
  timeZone?: string;        // default "America/Chicago" on backend

  // Optional fields
  location?: string;        // default "Norman Mosque" on backend
  mapLink?: string;
  subtitle?: string;
  description?: string;
  specialGuest?: string;
  food?: string;
  ageGroup?: string;
  registration?: boolean;
  registrationLink?: string;
  contactEmail?: string;
  contactPhone?: string;
}

// Payload to UPDATE (partial)
export type EventUpdateDTO = Partial<EventCreateDTO>;

// What the backend returns (simplified)
export interface EventModel {
  _id: string;

  title: string;

  // Canonical UTC instants (ISO strings if serialized)
  startsAtUtc: string;
  endsAtUtc?: string;

  // Local keys for display/search
  startLocalDate: string;   // "YYYY-MM-DD"
  startLocalTime: string;   // "HH:mm"
  endLocalDate?: string;
  endLocalTime?: string;
  timeZone: string;

  // Other fields
  location: string;
  mapLink?: string;
  subtitle?: string;
  description?: string;
  specialGuest?: string;
  food?: string;
  ageGroup?: string;
  registration?: boolean;
  registrationLink?: string;
  contactEmail?: string;
  contactPhone?: string;

  createdAt?: string;
  updatedAt?: string;
}
