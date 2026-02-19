export const useLocalitiesListState = () => {
  const search = useState<string>('localities:search', () => '')
  const page = useState<number>('localities:page', () => 1)
  const pageSize = useState<number>('localities:pageSize', () => 20)

  return {
    search,
    page,
    pageSize
  }
}
