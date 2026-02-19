export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface Country {
  id: number
  name?: string | null
  name_en?: string | null
  [key: string]: unknown
}

export interface Locality {
  id: number
  name?: string | null
  name_en?: string | null
  country?: number | Country | null
  latitude?: number | null
  longitude?: number | null
  depth?: number | null
  elevation?: string | number | null
  remarks?: string | null
  remarks_location?: string | null
  date_changed?: string | null
}
