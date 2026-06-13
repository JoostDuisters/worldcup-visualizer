import { C, FONT_BODY, FONT_DISPLAY } from '../theme'

export function Header({ isDesktop, onReset }: { isDesktop: boolean; onReset: () => void }) {
  return (
    <div
      style={{
        flexShrink: 0,
        padding: isDesktop ? '13px 20px' : '14px 16px 12px',
        background: 'linear-gradient(180deg,#0e1830,#0b1322)',
        borderBottom: '1px solid #1a2c45',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div>
        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 700,
            fontSize: 9.5,
            letterSpacing: 2.5,
            color: C.green,
            textTransform: 'uppercase',
          }}
        >
          World Cup 2026 · USA · CAN · MEX
        </div>
        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 800,
            fontSize: 21,
            letterSpacing: -0.4,
            color: C.text,
            marginTop: 1,
          }}
        >
          Group → Bracket Planner
        </div>
      </div>
      <button
        onClick={onReset}
        style={{
          background: 'transparent',
          border: `1px solid ${C.resetBorder}`,
          color: C.dim,
          borderRadius: 9,
          padding: '7px 12px',
          fontFamily: FONT_BODY,
          fontWeight: 600,
          fontSize: 12,
          cursor: 'pointer',
        }}
      >
        Reset
      </button>
    </div>
  )
}
