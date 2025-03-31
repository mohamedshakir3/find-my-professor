"use client"

import { useCallback, useState } from "react"

export function useBoolean(initialState = false) {
  const [state, setState] = useState(initialState)

  const on = useCallback(() => setState(true), [])
  const off = useCallback(() => setState(false), [])
  const toggle = useCallback(() => setState((prev) => !prev), [])

  return [state, { on, off, toggle, set: setState }] as const
}

