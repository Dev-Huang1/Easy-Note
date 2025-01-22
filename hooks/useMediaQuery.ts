import { useState, useEffect } from "react"

export function useMediaQuery(query: string): [boolean, boolean] {
  const [matches, setMatches] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    const listener = () => setMatches(media.matches)
    media.addListener(listener)
    setIsLoading(false)
    return () => media.removeListener(listener)
  }, [matches, query])

  return [matches, isLoading]
}

