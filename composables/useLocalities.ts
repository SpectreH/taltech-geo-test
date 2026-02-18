import type { Locality, PaginatedResponse } from '~/types/api'

export const useLocalities = () => {
  const config = useRuntimeConfig()
  const endpoint = `${config.public.apiBase}/localities/`

  const page = ref(1)
  const pageSize = ref(20)
  const searchInput = ref('')
  const search = useDebouncedRef(searchInput, 350)

  const offset = computed(() => (page.value - 1) * pageSize.value)
  const params = computed(() => {
    const query: {
      limit: number
      offset: number
      expand: 'country'
      name__icontains?: string
    } = {
      limit: pageSize.value,
      offset: offset.value,
      expand: 'country'
    }

    const searchTerm = search.value.trim()
    if (searchTerm) {
      query.name__icontains = searchTerm
    }

    return query
  })

  watch(search, () => {
    page.value = 1
  })

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
    searchInput,
    totalPages
  }
}
