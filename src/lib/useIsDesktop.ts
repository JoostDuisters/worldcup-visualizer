import { useEffect, useState } from 'react'
import { DESKTOP_BREAKPOINT } from '../theme'

/** Tracks whether the viewport is at desktop width, updating live on resize. */
export function useIsDesktop(breakpoint = DESKTOP_BREAKPOINT): boolean {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.innerWidth >= breakpoint,
  )
  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= breakpoint)
    window.addEventListener('resize', onResize)
    onResize()
    return () => window.removeEventListener('resize', onResize)
  }, [breakpoint])
  return isDesktop
}
