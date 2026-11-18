import { useSearchParams } from 'react-router'

/** Step 4: the selected layer's ID stays in the URL, as ?layer=. These lines came out of Day 2's Provider. */
export function useSelectedLayerId() {
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedLayerId = searchParams.get('layer')

  function selectLayer(id: string) {
    setSearchParams({ layer: id })
  }

  return [selectedLayerId, selectLayer] as const
}
