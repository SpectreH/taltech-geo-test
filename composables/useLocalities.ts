import type { Locality, PaginatedResponse } from '~/types/api'

export const useLocalities = () => {
  const config = useRuntimeConfig()
  const endpoint = `${config.public.apiBase}/localities/`

  const { search, page, pageSize } = useLocalitiesListState()
  const debouncedSearch = useDebouncedRef(search, 350)

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

    const searchTerm = debouncedSearch.value.trim()
    if (searchTerm) {
      query.name__icontains = searchTerm
    }

    return query
  })

  watch(debouncedSearch, () => {
    page.value = 1
  })

  watch(pageSize, () => {
    page.value = 1
  })

  const { data, pending, error, refresh } = useFetch<PaginatedResponse<Locality>>(endpoint, {
    params,
    watch: [params]
  })

  const results = computed(() => data.value?.results ?? [])
  const total = computed(() => data.value?.count ?? 0)
  const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))

  watch([page, totalPages], ([currentPage, maxPages]) => {
    if (currentPage < 1) {
      page.value = 1
      return
    }

    if (currentPage > maxPages) {
      page.value = maxPages
    }
  })

  return {
    results,
    total,
    pending,
    error,
    refresh,
    page,
    pageSize,
    search,
    totalPages
  }
}
