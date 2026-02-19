<script setup lang="ts">
import type { Locality } from '~/types/api'

const { results, total, pending, error, refresh, page, pageSize, totalPages, search } = useLocalities()
const hasSearchInput = computed(() => search.value.trim().length > 0)
const pageSizeOptions = [10, 20, 50]

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

      <div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <label for="search-by-name" class="mb-2 block text-sm font-medium text-slate-700">
          Search by name
        </label>
        <div class="flex flex-col gap-2 sm:flex-row">
          <input
            id="search-by-name"
            v-model="search"
            type="text"
            placeholder="Type locality name..."
            class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
          <button
            v-if="hasSearchInput"
            type="button"
            class="inline-flex items-center justify-center rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500"
            @click="search = ''"
          >
            Clear
          </button>
        </div>
      </div>

      <div class="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-2 text-sm text-slate-700">
          <label for="page-size" class="font-medium text-slate-700">Page size</label>
          <select
            id="page-size"
            v-model.number="pageSize"
            :disabled="pending"
            class="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <option v-for="size in pageSizeOptions" :key="size" :value="size">
              {{ size }}
            </option>
          </select>
        </div>

        <PaginationControls
          :page="page"
          :total-pages="totalPages"
          :disabled="pending"
          @update:page="page = $event"
        />
      </div>

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
              <th scope="col" class="hidden px-4 py-3 text-left font-semibold text-slate-700 sm:table-cell">
                View
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-if="pending">
              <td colspan="4" class="px-4 py-6 text-slate-500">Loading localities...</td>
            </tr>

            <tr v-else-if="error">
              <td colspan="4" class="px-4 py-6 text-slate-500">
                Unable to display localities right now.
              </td>
            </tr>

            <tr v-else-if="results.length === 0">
              <td colspan="4" class="px-4 py-6 text-slate-500">
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
                  <NuxtLink
                    :to="`/localities/${locality.id}`"
                    class="font-medium text-slate-900 underline-offset-2 hover:text-slate-700 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500"
                  >
                    {{ formatLocalityName(locality) }}
                  </NuxtLink>
                  <dl class="mt-2 space-y-1 text-xs text-slate-500 sm:hidden">
                    <div class="flex gap-2">
                      <dt class="font-semibold text-slate-600">ID:</dt>
                      <dd>{{ locality.id }}</dd>
                    </div>
                    <div class="flex gap-2">
                      <dt class="font-semibold text-slate-600">Country:</dt>
                      <dd>{{ formatCountryLabel(locality.country) }}</dd>
                    </div>
                    <div class="flex gap-2">
                      <dt class="font-semibold text-slate-600">View:</dt>
                      <dd>
                        <NuxtLink
                          :to="`/localities/${locality.id}`"
                          class="underline underline-offset-2 hover:text-slate-700"
                        >
                          Details
                        </NuxtLink>
                      </dd>
                    </div>
                  </dl>
                </td>
                <td class="hidden px-4 py-4 text-slate-700 sm:table-cell">
                  {{ locality.id }}
                </td>
                <td class="hidden px-4 py-4 text-slate-700 sm:table-cell">
                  {{ formatCountryLabel(locality.country) }}
                </td>
                <td class="hidden px-4 py-4 text-slate-700 sm:table-cell">
                  <NuxtLink
                    :to="`/localities/${locality.id}`"
                    class="font-medium text-slate-700 underline-offset-2 hover:text-slate-900 hover:underline"
                  >
                    View
                  </NuxtLink>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <PaginationControls
          :page="page"
          :total-pages="totalPages"
          :disabled="pending"
          @update:page="page = $event"
        />
      </div>
    </section>
  </main>
</template>
