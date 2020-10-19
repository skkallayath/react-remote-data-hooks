import { useState, useEffect, useCallback } from 'react'

interface PaginatedDataLoaderProps<T = any, U = any> {
  loadPage: (page?: number) => Promise<T>
  defaultData?: U[]
  resolveList: (data: T) => U[]
  isError?: (data: T) => string | undefined
  startPage?: number
}

interface State<U = any, T = any> {
  page: number
  data: U
  loading: boolean
  loaded: boolean
  list: T[]
  error?: Error
  allPagesLoaded: boolean
}

interface ReturnData<U = any, T = any> extends State<U, T> {
  handleScroll: (direction: 'pageUp' | 'pageDown') => void
  reload: () => void
}

export const usePaginatedDataLoader = <T = any, U = any>(
  props: PaginatedDataLoaderProps<T, U>,
  deps?: any[]
): ReturnData<T, U> => {
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [allPagesLoaded, setAllPagesLoaded] = useState(false)
  const [error, setError] = useState<Error | undefined>(undefined)
  const [data, setData] = useState<any>(props.defaultData)
  const [list, setList] = useState<any[]>([])
  const [page, setPage] = useState<number>(props.startPage || 0)

  const _mergeData = useCallback(
    (old: any[], newData: any[], _page?: number) => {
      if (_page === (props.startPage || 0)) {
        return newData
      }
      const merged: any[] = []
      if (old && old.length) {
        merged.push(...old)
      }
      if (newData && newData.length) {
        merged.push(...newData)
      }

      return merged
    },
    []
  )

  const mergeData = useCallback(
    (old: any[], added: any, _page?: number) => {
      if (!added || !added.length) {
        setAllPagesLoaded(true)
        return old
      }

      return _mergeData(old, added, _page)
    },
    [setAllPagesLoaded, props, _mergeData]
  )

  const reload = () => {
    setPage(0)
    setList([])
    setData(props.defaultData)
    setError(undefined)
    setAllPagesLoaded(false)
    setLoaded(false)
    setLoading(false)
  }

  const loadPage = useCallback(
    async (_page: number) => {
      if (loading || allPagesLoaded) {
        return
      }
      if (_page < page) {
        return
      }
      setLoading(true)
      setLoaded(false)
      try {
        setPage(_page)
        const loadedData = await props.loadPage(_page)
        if (props.isError) {
          const err = props.isError(loadedData)
          if (err) {
            throw Error(err)
          }
        }
        setData(loadedData)
        const currentList = props.resolveList(loadedData)
        const merged = mergeData(list, currentList, _page)

        setList(merged)
      } catch (e) {
        setError(e)
      }
      setLoaded(true)
      setLoading(false)
    },
    [
      loading,
      allPagesLoaded,
      setLoading,
      setLoaded,
      setPage,
      props,
      setData,
      mergeData,
      setList,
      setError,
      list,
      page
    ]
  )

  useEffect(() => {
    if (!loading && !loaded && !error) {
      loadPage(props.startPage || 0)
    }
  }, [loadPage, loading, loaded, error, ...(deps || [])])

  const handleScroll = (direction: 'pageUp' | 'pageDown') => {
    if (loading || allPagesLoaded) {
      return
    }
    if (direction === 'pageDown') {
      loadPage(page + 1)
    }
  }

  return {
    handleScroll,
    page,
    data,
    loading,
    loaded,
    list,
    reload,
    error,
    allPagesLoaded
  }
}
