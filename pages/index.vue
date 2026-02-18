<script setup lang="ts">
const { results, total, pending, error, page, pageSize, totalPages } = useLocalities()

const debugData = computed(() => ({
  total: total.value,
  page: page.value,
  pageSize: pageSize.value,
  totalPages: totalPages.value,
  firstItems: results.value.slice(0, 5)
}))
</script>

<template>
  <main class="min-h-screen bg-slate-50 px-4 py-10">
    <div class="mx-auto max-w-4xl space-y-4">
      <h1 class="text-2xl font-semibold text-slate-900">taltech-geo localities</h1>
      <p class="text-sm text-slate-600">Total localities: {{ total }}</p>
      <p class="text-sm text-slate-600">Page {{ page }} / {{ totalPages }} (page size: {{ pageSize }})</p>
      <p v-if="pending" class="text-sm text-slate-500">Loading localities...</p>
      <p v-else-if="error" class="text-sm text-red-600">
        Failed to load localities: {{ error.message }}
      </p>
      <pre class="overflow-x-auto rounded-md bg-slate-900 p-4 text-xs text-slate-100">{{ JSON.stringify(debugData, null, 2) }}</pre>
    </div>
  </main>
</template>
