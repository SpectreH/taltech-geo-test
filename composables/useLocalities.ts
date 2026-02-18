import type { Locality, PaginatedResponse } from '~/types/api'

export const useLocalities = () => {
  const config = useRuntimeConfig()
  const endpoint = `${config.public.apiBase}/localities/`

  const page = ref(1)
  const pageSize = ref(20)

  const offset = computed(() => (page.value - 1) * pageSize.value)
  const params = computed(() => ({
    limit: pageSize.value,
    offset: offset.value,
    expand: 'country'
  }))

  const { data, pending, error, refresh } = useFetch<PaginatedResponse<Locality>>(endpoint, {
    params,
    watch: [params]
  })

  const results = computed(() => data.value?.results ?? [])
  const total = computed(() => data.value?.count ?? 0)
  const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))

  return {
    results,
    total,
    pending,
    error,
    refresh,
    page,
    pageSize,
    totalPages
  }
}
