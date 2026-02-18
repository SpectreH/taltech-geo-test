export interface ApiPage<T> {
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
}
