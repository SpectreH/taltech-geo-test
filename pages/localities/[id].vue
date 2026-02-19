<script setup lang="ts">
import type { Locality } from '~/types/api'

interface HttpLikeError {
  statusCode?: number
  response?: {
    status?: number
  }
}

const route = useRoute()
const config = useRuntimeConfig()
const {
  formatLocalityName,
  formatCountryLabel,
  formatCoordinate,
  formatDisplayValue,
  formatDateValue,
  getMapCoordinates
} = useLocalityFormatting()

const rawRouteId = computed(() => {
  const raw = route.params.id
  return Array.isArray(raw) ? raw[0] : raw
})

const localityId = computed(() => Number(rawRouteId.value))

if (!Number.isInteger(localityId.value) || localityId.value <= 0) {
  throw createError({ statusCode: 404, statusMessage: 'Not Found' })
}

const resolveStatusCode = (error: unknown): number | undefined => {
  if (typeof error !== 'object' || error === null) {
    return undefined
  }

  const maybeHttpError = error as HttpLikeError
  return maybeHttpError.statusCode ?? maybeHttpError.response?.status
}

const { data: locality, pending, error, refresh } = await useAsyncData(
  () => `locality-${localityId.value}`,
  async () => {
    try {
      return await $fetch<Locality>(`${config.public.apiBase}/localities/${localityId.value}/`, {
        params: {
          expand: 'country'
        }
      })
    } catch (fetchError: unknown) {
      if (resolveStatusCode(fetchError) === 404) {
        return null
      }

      throw fetchError
    }
  },
  {
    watch: [localityId]
  }
)

if ((!locality.value || typeof locality.value.id !== 'number') && !error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Not Found' })
}

const localityName = computed(() => {
  if (!locality.value) {
    return '(Unnamed locality)'
  }

  return formatLocalityName(locality.value)
})

const localitySecondaryName = computed(() => {
  const name = locality.value?.name?.trim()
  if (!name || name === localityName.value) {
    return null
  }

  return name
})

const mapCoordinates = computed(() => getMapCoordinates(locality.value))
</script>

<template>
  <main class="min-h-screen bg-slate-50 px-4 py-8 sm:py-10">
    <section class="mx-auto max-w-3xl space-y-4">
      <NuxtLink
        to="/"
        class="inline-flex items-center text-sm font-medium text-slate-700 underline-offset-2 hover:text-slate-900 hover:underline"
      >
        Back to list
      </NuxtLink>

      <div v-if="pending" class="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
        Loading locality details...
      </div>

      <div
        v-else-if="error"
        class="space-y-4 rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-700"
      >
        <p>Failed to load locality details: {{ error.message }}</p>
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-md bg-red-600 px-3 py-2 font-medium text-white transition hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            @click="refresh()"
          >
            Retry
          </button>
          <NuxtLink
            to="/"
            class="inline-flex items-center justify-center rounded-md border border-red-300 bg-white px-3 py-2 font-medium text-red-700 transition hover:bg-red-100"
          >
            Back to list
          </NuxtLink>
        </div>
      </div>

      <article v-else-if="locality" class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 class="text-2xl font-semibold text-slate-900">{{ localityName }}</h1>
        <p v-if="localitySecondaryName" class="mt-1 text-sm text-slate-500">
          {{ localitySecondaryName }}
        </p>

        <dl class="mt-6 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
          <div>
            <dt class="text-sm font-medium text-slate-500">ID</dt>
            <dd class="mt-1 text-sm text-slate-900">{{ locality.id }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-slate-500">Country</dt>
            <dd class="mt-1 text-sm text-slate-900">{{ formatCountryLabel(locality.country) }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-slate-500">Latitude</dt>
            <dd class="mt-1 text-sm text-slate-900">{{ formatCoordinate(locality.latitude) }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-slate-500">Longitude</dt>
            <dd class="mt-1 text-sm text-slate-900">{{ formatCoordinate(locality.longitude) }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-slate-500">Depth</dt>
            <dd class="mt-1 text-sm text-slate-900">{{ formatDisplayValue(locality.depth) }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-slate-500">Elevation</dt>
            <dd class="mt-1 text-sm text-slate-900">{{ formatDisplayValue(locality.elevation) }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-slate-500">Date changed</dt>
            <dd class="mt-1 text-sm text-slate-900">{{ formatDateValue(locality.date_changed) }}</dd>
          </div>
          <div class="sm:col-span-2">
            <dt class="text-sm font-medium text-slate-500">Remarks</dt>
            <dd class="mt-1 text-sm text-slate-900">{{ formatDisplayValue(locality.remarks) }}</dd>
          </div>
          <div class="sm:col-span-2">
            <dt class="text-sm font-medium text-slate-500">Remarks location</dt>
            <dd class="mt-1 text-sm text-slate-900">{{ formatDisplayValue(locality.remarks_location) }}</dd>
          </div>
        </dl>

        <section class="mt-6 space-y-2">
          <h2 class="text-base font-semibold text-slate-900">Map</h2>
          <LocalityMap
            v-if="mapCoordinates"
            :key="`locality-map-${mapCoordinates.lat}-${mapCoordinates.lng}`"
            :lat="mapCoordinates.lat"
            :lng="mapCoordinates.lng"
            :zoom="13"
          />
          <p v-else class="text-sm text-slate-500">No coordinates available.</p>
        </section>
      </article>
    </section>
  </main>
</template>
