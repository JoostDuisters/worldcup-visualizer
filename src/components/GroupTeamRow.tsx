import type { PointerEvent } from 'react'
import { C, FONT_DISPLAY } from '../theme'
import { flagOf, nameOf, type TeamCode } from '../data/teams'

interface Props {
  index: number
  team: TeamCode
  /** Whether this row is the group's 3rd-placed team AND it qualifies. */
  qualifiesThird: boolean
  isDesktop: boolean
  dragging: boolean
  dragOffset: number
  onPointerDown: (e: PointerEvent<HTMLDivElement>) => void
  onPointerMove: (e: PointerEvent<HTMLDivElement>) => void
  onPointerUp: (e: PointerEvent<HTMLDivElement>) => void
}

export function GroupTeamRow({
  index,
  team,
  qualifiesThird,
  isDesktop: isD,
  dragging,
  dragOffset,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: Props) {
  const advancing = index < 2
  const posColor = advancing ? C.green : qualifiesThird ? C.gold : C.dim
  const posBg = advancing
    ? 'rgba(37,210,154,0.16)'
    : qualifiesThird
      ? 'rgba(245,196,81,0.16)'
      : 'rgba(255,255,255,0.04)'

  let tag = 'OUT'
  let tagColor: string = C.dimmer
  let tagBg = 'transparent'
  if (advancing) {
    tag = 'ADV'
    tagColor = C.green
    tagBg = 'rgba(37,210,154,0.12)'
  } else if (index === 2) {
    tag = qualifiesThird ? '3RD ✓' : '3RD ✕'
    tagColor = qualifiesThird ? C.gold : C.dimmer
    tagBg = qualifiesThird ? 'rgba(245,196,81,0.12)' : 'transparent'
  }

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: isD ? 7 : 9,
        height: isD ? 26 : 40,
        marginBottom: isD ? 3 : 4,
        padding: isD ? '0 7px' : '0 8px',
        borderRadius: isD ? 7 : 10,
        cursor: 'grab',
        position: 'relative',
        userSelect: 'none',
        touchAction: 'none',
        background: dragging ? 'rgba(37,210,154,0.14)' : C.teamRow,
        border: `1px solid ${dragging ? C.green : 'transparent'}`,
        transform: dragging ? `translateY(${dragOffset}px) scale(1.02)` : 'none',
        zIndex: dragging ? 30 : 1,
        boxShadow: dragging ? '0 8px 22px rgba(0,0,0,0.5)' : 'none',
        transition: dragging ? 'none' : 'transform .12s ease, background .12s',
      }}
    >
      <span style={{ flexShrink: 0, color: C.grip, fontSize: isD ? 11 : 14, lineHeight: 1 }}>⠿</span>
      <div
        style={{
          flexShrink: 0,
          width: isD ? 17 : 22,
          height: isD ? 17 : 22,
          borderRadius: isD ? 5 : 6,
          display: 'grid',
          placeItems: 'center',
          fontFamily: FONT_DISPLAY,
          fontWeight: 800,
          fontSize: isD ? 9.5 : 11,
          color: posColor,
          background: posBg,
        }}
      >
        {index + 1}
      </div>
      <span style={{ fontSize: isD ? 13 : 16, flexShrink: 0 }}>{flagOf(team)}</span>
      <span
        style={{
          flex: 1,
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontSize: isD ? 11.5 : 14,
          fontWeight: 600,
          color: C.text,
        }}
      >
        {nameOf(team)}
      </span>
      <span
        style={{
          flexShrink: 0,
          fontFamily: FONT_DISPLAY,
          fontWeight: 700,
          fontSize: isD ? 8 : 9,
          letterSpacing: 0.5,
          color: tagColor,
          background: tagBg,
          borderRadius: 5,
          padding: isD ? '2px 5px' : '3px 6px',
          whiteSpace: 'nowrap',
        }}
      >
        {tag}
      </span>
    </div>
  )
}
