import type { CSSProperties, PointerEvent } from 'react'
import { GROUP_KEYS, type GroupKey } from '../data/groups'
import type { TeamCode } from '../data/teams'
import { C, FONT_DISPLAY } from '../theme'
import type { Groups } from '../lib/resolve'
import type { DragState } from '../lib/useGroupDrag'
import { GroupTeamRow } from './GroupTeamRow'

interface Props {
  groups: Groups
  qualifiedThirds: ReadonlySet<GroupKey>
  isDesktop: boolean
  /** On mobile, whether the Groups tab is active. Ignored on desktop. */
  visible: boolean
  drag: DragState | null
  stride: number
  startDrag: (g: GroupKey, i: number, team: TeamCode, e: PointerEvent<HTMLDivElement>) => void
  moveDrag: (e: PointerEvent<HTMLDivElement>) => void
  endDrag: (e: PointerEvent<HTMLDivElement>) => void
}

export function GroupsPanel({
  groups,
  qualifiedThirds,
  isDesktop: isD,
  visible,
  drag,
  stride,
  startDrag,
  moveDrag,
  endDrag,
}: Props) {
  const panelStyle: CSSProperties = isD
    ? { display: 'block', width: 384, flexShrink: 0, overflowY: 'auto', paddingRight: 8 }
    : { display: visible ? 'block' : 'none', padding: '14px 14px 28px' }

  const cardStyle: CSSProperties = isD
    ? { background: C.groupCard, border: `1px solid ${C.line}`, borderRadius: 11, padding: '8px 8px 6px' }
    : { background: C.groupCard, border: `1px solid ${C.line}`, borderRadius: 14, padding: '11px 11px 8px', marginBottom: 12 }

  return (
    <div className="scroll" style={panelStyle}>
      <div style={{ fontSize: 11.5, color: C.dim, lineHeight: 1.45, marginBottom: 11 }}>
        Drag teams to set each group&apos;s finishing order.{' '}
        <span style={{ color: C.green, fontWeight: 600 }}>1st &amp; 2nd</span> advance; the{' '}
        <span style={{ color: C.gold, fontWeight: 600 }}>8 best 3rds</span> qualify automatically.
      </div>
      <div
        style={
          isD
            ? { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, alignContent: 'start' }
            : { display: 'block' }
        }
      >
        {GROUP_KEYS.map((g) => (
          <div key={g} style={cardStyle}>
            <div
              style={{
                fontFamily: FONT_DISPLAY,
                fontWeight: 800,
                fontSize: 11,
                letterSpacing: 1.3,
                color: '#cfe0f0',
                marginBottom: 6,
              }}
            >
              GROUP {g}
            </div>
            {groups[g].map((team, i) => {
              const dragging = !!drag && drag.group === g && drag.team === team
              const dragOffset = dragging ? drag.dy - (i - drag.origIndex) * stride : 0
              return (
                <GroupTeamRow
                  key={team}
                  index={i}
                  team={team}
                  qualifiesThird={i === 2 && qualifiedThirds.has(g)}
                  isDesktop={isD}
                  dragging={dragging}
                  dragOffset={dragOffset}
                  onPointerDown={(e) => startDrag(g, i, team, e)}
                  onPointerMove={moveDrag}
                  onPointerUp={endDrag}
                />
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
