<script setup lang="ts">
import * as Leaflet from 'leaflet'
import markerIconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import markerIconUrl from 'leaflet/dist/images/marker-icon.png'
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png'

type LeafletMap = Leaflet.Map
type LeafletMarker = Leaflet.Marker
type MarkerIconAssets = {
  iconRetinaUrl: string
  iconUrl: string
  shadowUrl: string
}

const DEFAULT_ZOOM = 13
const RESIZE_SETTLE_DELAY_MS = 120
const OSM_TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const OSM_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
const MARKER_ICONS: MarkerIconAssets = {
  iconRetinaUrl: markerIconRetinaUrl,
  iconUrl: markerIconUrl,
  shadowUrl: markerShadowUrl
}

const props = withDefaults(
  defineProps<{
    lat: number
    lng: number
    zoom?: number
  }>(),
  {
    zoom: DEFAULT_ZOOM
  }
)

const mapContainer = ref<HTMLDivElement | null>(null)
const mapInitError = ref<string | null>(null)

let map: LeafletMap | null = null
let marker: LeafletMarker | null = null
let resizeTimeoutId: ReturnType<typeof setTimeout> | undefined

const coordinates = computed<[number, number]>(() => [props.lat, props.lng])

const clearResizeTimeout = () => {
  if (resizeTimeoutId) {
    clearTimeout(resizeTimeoutId)
    resizeTimeoutId = undefined
  }
}

const configureDefaultMarkerIcons = (icons: MarkerIconAssets) => {
  delete (Leaflet.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl

  Leaflet.Icon.Default.mergeOptions(icons)
}

const invalidateMapSize = () => {
  if (!map) {
    return
  }

  nextTick(() => {
    if (!map) {
      return
    }

    map.invalidateSize()
    clearResizeTimeout()

    // A delayed second pass handles layout settling after hydration/refresh.
    resizeTimeoutId = setTimeout(() => {
      map?.invalidateSize()
    }, RESIZE_SETTLE_DELAY_MS)
  })
}

const updateMapView = () => {
  if (!map) {
    return
  }

  map.setView(coordinates.value, props.zoom)

  if (!marker) {
    marker = Leaflet.marker(coordinates.value)
    marker.addTo(map)
    return
  }

  marker.setLatLng(coordinates.value)
}

const handleWindowResize = () => {
  invalidateMapSize()
}

const initializeMap = () => {
  if (!mapContainer.value || map) {
    return
  }

  try {
    configureDefaultMarkerIcons(MARKER_ICONS)

    map = Leaflet.map(mapContainer.value)

    Leaflet
      .tileLayer(OSM_TILE_URL, {
        attribution: OSM_ATTRIBUTION
      })
      .addTo(map)

    updateMapView()
    invalidateMapSize()

    window.addEventListener('resize', handleWindowResize)
    mapInitError.value = null
  } catch (error) {
    mapInitError.value = error instanceof Error ? error.message : 'Failed to initialize map.'
  }
}

onMounted(() => {
  nextTick(() => {
    initializeMap()
  })
})

watchPostEffect(() => {
  if (!mapContainer.value || map) {
    return
  }

  initializeMap()
})

watch(
  () => [props.lat, props.lng, props.zoom],
  () => {
    updateMapView()
    invalidateMapSize()
  }
)

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleWindowResize)
  clearResizeTimeout()

  map?.remove()
  map = null
  marker = null
})
</script>

<template>
  <div class="space-y-2">
    <div
      ref="mapContainer"
      class="h-72 w-full overflow-hidden rounded-lg border border-slate-200 sm:h-80"
    />
    <p v-if="mapInitError" class="text-sm text-red-600">
      Failed to initialize map: {{ mapInitError }}
    </p>
  </div>
</template>
