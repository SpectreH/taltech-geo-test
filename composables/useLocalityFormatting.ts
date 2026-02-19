import type { Locality } from '~/types/api'

type Coordinates = {
  lat: number
  lng: number
}

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value)

export const useLocalityFormatting = () => {
  const formatLocalityName = (locality: Pick<Locality, 'name' | 'name_en'>): string =>
    locality.name_en || locality.name || '(Unnamed locality)'

  const formatCountryLabel = (country: Locality['country']): string => {
    if (country === null || country === undefined) {
      return '—'
    }

    if (typeof country === 'number') {
      return `#${country}`
    }

    return country.name_en || country.name || `#${country.id}`
  }

  const formatCoordinate = (value?: number | null): string => {
    if (!isFiniteNumber(value)) {
      return '—'
    }

    return String(value)
  }

  const formatDisplayValue = (value?: string | number | null): string => {
    if (value === null || value === undefined) {
      return '—'
    }

    if (typeof value === 'string' && value.trim().length === 0) {
      return '—'
    }

    return String(value)
  }

  const formatDateValue = (value?: string | null): string => {
    if (!value) {
      return '—'
    }

    const timestamp = Date.parse(value)
    if (Number.isNaN(timestamp)) {
      return value
    }

    return new Date(timestamp).toISOString().replace('T', ' ').replace('Z', ' UTC')
  }

  const getMapCoordinates = (locality?: Pick<Locality, 'latitude' | 'longitude'> | null): Coordinates | null => {
    const lat = locality?.latitude
    const lng = locality?.longitude

    if (!isFiniteNumber(lat) || !isFiniteNumber(lng)) {
      return null
    }

    return { lat, lng }
  }

  return {
    formatLocalityName,
    formatCountryLabel,
    formatCoordinate,
    formatDisplayValue,
    formatDateValue,
    getMapCoordinates
  }
}
