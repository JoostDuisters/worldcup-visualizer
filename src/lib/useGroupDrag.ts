import { useRef, useState, type PointerEvent } from 'react'
import type { GroupKey } from '../data/groups'
import type { TeamCode } from '../data/teams'
import type { Groups } from './resolve'

export interface DragState {
  readonly group: GroupKey
  readonly team: TeamCode
  readonly origIndex: number
  readonly startY: number
  /** Vertical pointer delta since drag start, in px. */
  readonly dy: number
}

/** Per-position vertical stride (row height + margin) for desktop / mobile. */
const STRIDE = { desktop: 29, mobile: 44 }

/**
 * Pointer-based drag-to-reorder for group team rows. Reorders the underlying
 * group live as the pointer crosses position thresholds; the rest of the
 * bracket re-resolves automatically because results are derived from `groups`.
 */
export function useGroupDrag(
  groups: Groups,
  setGroups: (groups: Groups) => void,
  isDesktop: boolean,
) {
  const [drag, setDrag] = useState<DragState | null>(null)
  const dragRef = useRef<DragState | null>(null)
  const groupsRef = useRef(groups)
  groupsRef.current = groups
  const stride = isDesktop ? STRIDE.desktop : STRIDE.mobile

  const startDrag = (
    group: GroupKey,
    index: number,
    team: TeamCode,
    e: PointerEvent<HTMLDivElement>,
  ) => {
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      // Pointer capture is best-effort; ignore unsupported environments.
    }
    const next: DragState = { group, team, origIndex: index, startY: e.clientY, dy: 0 }
    dragRef.current = next
    setDrag(next)
  }

  const moveDrag = (e: PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current
    if (!d) return
    const dy = e.clientY - d.startY
    const current = groupsRef.current[d.group]
    const cur = current.indexOf(d.team)
    const desired = Math.max(0, Math.min(3, d.origIndex + Math.round(dy / stride)))
    if (desired !== cur) {
      const arr = [...current]
      arr.splice(cur, 1)
      arr.splice(desired, 0, d.team)
      setGroups({ ...groupsRef.current, [d.group]: arr })
    }
    const next: DragState = { ...d, dy }
    dragRef.current = next
    setDrag(next)
  }

  const endDrag = () => {
    if (!dragRef.current) return
    dragRef.current = null
    setDrag(null)
  }

  return { drag, startDrag, moveDrag, endDrag, stride }
}
