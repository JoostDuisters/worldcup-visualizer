import { C, FONT_BODY, FONT_DISPLAY } from '../theme'
import { flagOf, nameOf, type TeamCode } from '../data/teams'
import type { ResolvedMatch } from '../lib/resolve'

interface RowProps {
  team: TeamCode | null
  label: string
  isWin: boolean
  pinned: boolean
  isDesktop: boolean
  onTap: () => void
}

function Row({ team, label, isWin, pinned, isDesktop: isD, onTap }: RowProps) {
  return (
    <button
      onClick={() => team && onTap()}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: isD ? 6 : 8,
        width: '100%',
        border: 'none',
        height: isD ? 30 : 42,
        padding: isD ? '0 8px' : '0 10px',
        boxSizing: 'border-box',
        cursor: team ? 'pointer' : 'default',
        fontFamily: FONT_BODY,
        background: isWin ? 'rgba(37,210,154,0.13)' : 'transparent',
        color: team ? (isWin ? C.green : C.text) : C.dim,
        fontWeight: isWin ? 700 : 600,
        fontSize: isD ? 11.5 : 13.5,
        borderLeft: `3px solid ${isWin ? C.green : 'transparent'}`,
      }}
    >
      <span
        style={{
          flexShrink: 0,
          minWidth: label ? (isD ? 20 : 30) : 0,
          fontFamily: FONT_DISPLAY,
          fontWeight: 700,
          fontSize: isD ? 8 : 9,
          letterSpacing: 0.3,
          color: C.dim,
          background: label ? 'rgba(255,255,255,0.05)' : 'transparent',
          borderRadius: 4,
          padding: label ? (isD ? '2px 4px' : '3px 5px') : 0,
          textAlign: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
      <span style={{ fontSize: isD ? 13 : 16, flexShrink: 0 }}>{team ? flagOf(team) : ''}</span>
      <span
        style={{
          flex: 1,
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          textAlign: 'left',
        }}
      >
        {team ? nameOf(team) : '—'}
      </span>
      <span style={{ flexShrink: 0, fontSize: isD ? 8 : 10, color: C.green }}>
        {pinned ? '●' : ''}
      </span>
    </button>
  )
}

interface Props {
  match: ResolvedMatch
  isDesktop: boolean
  onPick: (team: TeamCode | null) => void
}

export function MatchCard({ match, isDesktop, onPick }: Props) {
  const winHome = match.winner != null && match.winner === match.home
  const winAway = match.winner != null && match.winner === match.away
  return (
    <div
      style={{
        background: C.matchCard,
        borderRadius: isDesktop ? 9 : 11,
        overflow: 'hidden',
        border: `1px solid ${C.line}`,
      }}
    >
      <Row
        team={match.home}
        label={match.homeLabel}
        isWin={winHome}
        pinned={match.pinned && winHome}
        isDesktop={isDesktop}
        onTap={() => onPick(match.home)}
      />
      <div style={{ height: 1, background: C.line }} />
      <Row
        team={match.away}
        label={match.awayLabel}
        isWin={winAway}
        pinned={match.pinned && winAway}
        isDesktop={isDesktop}
        onTap={() => onPick(match.away)}
      />
    </div>
  )
}
