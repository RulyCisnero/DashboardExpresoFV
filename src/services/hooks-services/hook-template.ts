export const useEntidad = (Service) => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadItems = async () => {
    setLoading(true)
    try {
      const data = await Service.getAll()
      setItems(data)
      setError(null)
    } catch (e) {
      setError("No se pudieron cargar los datos")
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadItems()
  }, [])

  return { items, loading, error, reload: loadItems }
}
