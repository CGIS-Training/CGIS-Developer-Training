// Handout for Step 2 of the Day 4 lab: the finished Hook from this morning (Reactive Utils).
// Give it an expression that reads a value the map owns. It hands back the latest value, and keeps it up to date.
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils'
import { useEffect, useState } from 'react'

/**
 * Follows a value the map owns.
 * `deps` lists the React values the expression uses. The SDK tracks its own properties, and can't track React's.
 */
export function useWatch<T>(getValue: () => T, deps: unknown[]): T {
  const [value, setValue] = useState(getValue)

  useEffect(() => {
    const handle = reactiveUtils.watch(getValue, (newValue) => setValue(newValue), { initial: true })
    return () => handle.remove()
    // oxlint-disable-next-line react/exhaustive-deps -- the caller passes the list in, so the linter can't check it
  }, deps)

  return value
}
