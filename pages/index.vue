<script setup lang="ts">
import type { Locality } from '~/types/api'

const { results, total, pending, error, refresh, page, totalPages } = useLocalities()

const formatLocalityName = (locality: Locality): string =>
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
</script>

<template>
  <main class="min-h-screen bg-slate-50 px-4 py-8 sm:py-10">
    <section class="mx-auto max-w-5xl space-y-4">
      <header class="space-y-1">
        <h1 class="text-2xl font-semibold text-slate-900">Localities</h1>
        <p class="text-sm text-slate-600">
          Total localities:
          <span class="font-semibold text-slate-900">{{ total }}</span>
        </p>
        <p class="text-sm text-slate-500">Page {{ page }} of {{ totalPages }}</p>
      </header>

      <div
        v-if="error"
        class="flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between"
      >
        <p>Failed to load localities: {{ error.message }}</p>
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-md bg-red-600 px-3 py-2 font-medium text-white transition hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:cursor-not-allowed disabled:opacity-70"
          :disabled="pending"
          @click="refresh()"
        >
          Retry
        </button>
      </div>

      <div class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <table class="min-w-full divide-y divide-slate-200 text-sm">
          <thead class="bg-slate-100">
            <tr>
              <th scope="col" class="px-4 py-3 text-left font-semibold text-slate-700">
                Locality
              </th>
              <th scope="col" class="hidden px-4 py-3 text-left font-semibold text-slate-700 sm:table-cell">
                ID
              </th>
              <th scope="col" class="hidden px-4 py-3 text-left font-semibold text-slate-700 sm:table-cell">
                Country
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-if="pending">
              <td colspan="3" class="px-4 py-6 text-slate-500">Loading localities...</td>
            </tr>

            <tr v-else-if="error">
              <td colspan="3" class="px-4 py-6 text-slate-500">
                Unable to display localities right now.
              </td>
            </tr>

            <tr v-else-if="results.length === 0">
              <td colspan="3" class="px-4 py-6 text-slate-500">
                No localities found.
              </td>
            </tr>

            <template v-else>
              <tr
                v-for="locality in results"
                :key="locality.id"
                class="align-top transition-colors hover:bg-slate-50"
              >
                <td class="px-4 py-4">
                  <p class="font-medium text-slate-900">{{ formatLocalityName(locality) }}</p>
                  <dl class="mt-2 space-y-1 text-xs text-slate-500 sm:hidden">
                    <div class="flex gap-2">
                      <dt class="font-semibold text-slate-600">ID:</dt>
                      <dd>{{ locality.id }}</dd>
                    </div>
                    <div class="flex gap-2">
                      <dt class="font-semibold text-slate-600">Country:</dt>
                      <dd>{{ formatCountryLabel(locality.country) }}</dd>
                    </div>
                  </dl>
                </td>
                <td class="hidden px-4 py-4 text-slate-700 sm:table-cell">
                  {{ locality.id }}
                </td>
                <td class="hidden px-4 py-4 text-slate-700 sm:table-cell">
                  {{ formatCountryLabel(locality.country) }}
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>
