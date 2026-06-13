import { C, FONT_DISPLAY } from '../theme'
import { R32, ROUNDS, type MatchId } from '../data/bracket'
import type { TeamCode } from '../data/teams'
import type { Resolution } from '../lib/resolve'
import { MatchCard } from './MatchCard'

// Bracket geometry (px) — the prototype's verified working values.
const CARD_W = 156
const COL_GAP = 36
const SLOT = 78 // vertical pitch per R32 match; exceeds card height to avoid overlap
const CARD_H = 63 // 30 + 30 rows + 1px divider + 2px border
const TITLE_H = 30

const colX = (round: number) => round * (CARD_W + COL_GAP)

/** Y-centre of every card, by round. Later rounds sit at their children's midpoint. */
function columnCenters(): number[][] {
  const y: number[][] = []
  y[0] = R32.map((_, i) => i * SLOT + SLOT / 2)
  for (let r = 1; r < ROUNDS.length; r++) {
    const prev = y[r - 1]
    const count = ROUNDS[r].matchIds.length
    const cur: number[] = []
    for (let j = 0; j < count; j++) cur.push((prev[2 * j] + prev[2 * j + 1]) / 2)
    y[r] = cur
  }
  return y
}

interface Props {
  resolution: Resolution
  onPick: (id: MatchId, team: TeamCode | null) => void
}

export function DesktopBracket({ resolution, onPick }: Props) {
  const y = columnCenters()
  const svgW = colX(ROUNDS.length - 1) + CARD_W
  const svgH = TITLE_H + R32.length * SLOT + 12

  // Elbow connectors: out of each child pair → vertical to the parent → into it.
  const connectors: string[] = []
  for (let r = 0; r < ROUNDS.length - 1; r++) {
    const count = ROUNDS[r + 1].matchIds.length
    for (let j = 0; j < count; j++) {
      const x0 = colX(r) + CARD_W
      const xMid = x0 + COL_GAP / 2
      const x1 = colX(r + 1)
      const yA = TITLE_H + y[r][2 * j]
      const yB = TITLE_H + y[r][2 * j + 1]
      const yP = TITLE_H + y[r + 1][j]
      connectors.push(
        // horizontal stub from each child → vertical spine joining both children
        // → horizontal into the parent at the midpoint (yP).
        `M${x0} ${yA} H ${xMid} M${x0} ${yB} H ${xMid} M${xMid} ${yA} V ${yB} M${xMid} ${yP} H ${x1}`,
      )
    }
  }

  return (
    <div style={{ position: 'relative', width: svgW, height: svgH, margin: '0 auto' }}>
      <svg
        width={svgW}
        height={svgH}
        style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}
      >
        {connectors.map((d, i) => (
          <path key={i} d={d} style={{ fill: 'none', stroke: C.connector, strokeWidth: 1.5 }} />
        ))}
      </svg>

      {ROUNDS.map((rd, r) => (
        <div
          key={rd.key}
          style={{
            position: 'absolute',
            left: colX(r),
            top: 4,
            width: CARD_W,
            textAlign: 'center',
            fontFamily: FONT_DISPLAY,
            fontWeight: 800,
            fontSize: 10,
            letterSpacing: 1,
            textTransform: 'uppercase',
            color: rd.key === 'final' ? C.gold : C.dim,
          }}
        >
          {rd.title}
        </div>
      ))}

      {ROUNDS.map((rd, r) =>
        rd.matchIds.map((id, j) => (
          <div
            key={id}
            style={{
              position: 'absolute',
              left: colX(r),
              top: TITLE_H + y[r][j] - CARD_H / 2,
              width: CARD_W,
            }}
          >
            <MatchCard match={resolution.matches[id]} isDesktop onPick={(team) => onPick(id, team)} />
          </div>
        )),
      )}
    </div>
  )
}
