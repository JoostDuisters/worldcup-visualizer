import type { CSSProperties } from 'react'
import { C, FONT_DISPLAY } from '../theme'

interface Props {
  tab: 'groups' | 'bracket'
  onGroups: () => void
  onBracket: () => void
}

const tabStyle = (active: boolean): CSSProperties => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  padding: '4px 0',
  color: active ? C.green : C.dim,
})

const labelStyle: CSSProperties = {
  fontFamily: FONT_DISPLAY,
  fontWeight: 700,
  fontSize: 10.5,
  letterSpacing: 0.6,
  marginTop: 3,
}

export function BottomTabs({ tab, onGroups, onBracket }: Props) {
  return (
    <div
      style={{
        flexShrink: 0,
        display: 'flex',
        background: '#0c1626',
        borderTop: '1px solid #1a2c45',
        padding: '7px 14px calc(7px + env(safe-area-inset-bottom))',
      }}
    >
      <button onClick={onGroups} style={tabStyle(tab === 'groups')}>
        <div style={{ fontSize: 15, lineHeight: 1 }}>▦</div>
        <div style={labelStyle}>GROUPS</div>
      </button>
      <button onClick={onBracket} style={tabStyle(tab === 'bracket')}>
        <div style={{ fontSize: 15, lineHeight: 1 }}>⛓</div>
        <div style={labelStyle}>BRACKET</div>
      </button>
    </div>
  )
}
