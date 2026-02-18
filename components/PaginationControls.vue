<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    page: number
    totalPages: number
    disabled?: boolean
  }>(),
  {
    disabled: false
  }
)

const emit = defineEmits<{
  'update:page': [page: number]
}>()

const safePage = computed(() => Math.max(1, props.page))
const safeTotalPages = computed(() => Math.max(1, props.totalPages))
const isPreviousDisabled = computed(() => props.disabled || safePage.value <= 1)
const isNextDisabled = computed(() => props.disabled || safePage.value >= safeTotalPages.value)

const goPrevious = () => {
  if (isPreviousDisabled.value) {
    return
  }

  emit('update:page', safePage.value - 1)
}

const goNext = () => {
  if (isNextDisabled.value) {
    return
  }

  emit('update:page', safePage.value + 1)
}
</script>

<template>
  <nav class="flex items-center justify-between gap-3" aria-label="Pagination controls">
    <button
      type="button"
      class="inline-flex items-center justify-center rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 disabled:cursor-not-allowed disabled:opacity-50"
      :disabled="isPreviousDisabled"
      @click="goPrevious"
    >
      Previous
    </button>

    <p class="text-sm text-slate-600">
      Page <span class="font-semibold text-slate-900">{{ safePage }}</span> of
      <span class="font-semibold text-slate-900">{{ safeTotalPages }}</span>
    </p>

    <button
      type="button"
      class="inline-flex items-center justify-center rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 disabled:cursor-not-allowed disabled:opacity-50"
      :disabled="isNextDisabled"
      @click="goNext"
    >
      Next
    </button>
  </nav>
</template>
