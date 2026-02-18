import type { Ref } from 'vue'

export const useDebouncedRef = <T>(source: Ref<T>, delay = 350): Ref<T> => {
  const debounced = ref(source.value) as Ref<T>
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  watch(source, (nextValue) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      debounced.value = nextValue
    }, delay)
  })

  onScopeDispose(() => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  })

  return debounced
}
