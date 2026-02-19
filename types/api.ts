export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface Country {
  id: number
  name?: string
  name_en?: string
}

export interface Locality {
  id: number
  name?: string
  name_en?: string
  country?: number | Country | null
  latitude?: number | null
  longitude?: number | null
  depth?: number | null
  elevation?: string | number | null
  remarks?: string | null
  remarks_location?: string | null
  date_changed?: string | null
}
