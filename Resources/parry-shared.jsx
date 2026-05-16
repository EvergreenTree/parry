// Shared bits used across Parry hero variations.

// Tiny logo mark — a tilted slash inside a soft square, evoking "parry" (deflect).
function ParryMark({ size = 24, color = 'currentColor', bg = 'transparent' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect x="1" y="1" width="30" height="30" rx="8" fill={bg} stroke={color} strokeWidth="1.6"/>
      <path d="M10 22 L22 10" stroke={color} strokeWidth="2.4" strokeLinecap="round"/>
      <circle cx="22" cy="10" r="2" fill={color}/>
    </svg>
  );
}

// Wordmark — uses Instrument Serif italic to feel literary/personal.
function ParryWord({ size = 22, color = 'currentColor' }) {
  return (
    <span style={{
      fontFamily: '"Instrument Serif", serif',
      fontStyle: 'italic',
      fontSize: size,
      color,
      letterSpacing: 0.2,
      lineHeight: 1,
    }}>parry</span>
  );
}

// Mono micro-tag (caps, very small) — used for technical metadata.
function MicroTag({ children, color = 'currentColor', style = {} }) {
  return (
    <span style={{
      fontFamily: '"JetBrains Mono", ui-monospace, monospace',
      fontSize: 10,
      letterSpacing: 1.4,
      textTransform: 'uppercase',
      color,
      ...style,
    }}>{children}</span>
  );
}

// Soft divider line.
function Hairline({ color = 'rgba(0,0,0,0.12)', style = {} }) {
  return <div style={{ height: 1, width: '100%', background: color, ...style }} />;
}

// Animated dot — used for "running locally" indicator.
function LiveDot({ color = '#16A34A', size = 8 }) {
  return (
    <span style={{
      display: 'inline-block', width: size, height: size, borderRadius: '50%',
      background: color, position: 'relative',
      boxShadow: `0 0 0 0 ${color}`,
      animation: 'parry-pulse 1.8s ease-out infinite',
    }}>
      <style>{`
        @keyframes parry-pulse {
          0%   { box-shadow: 0 0 0 0 ${color}80; }
          70%  { box-shadow: 0 0 0 8px ${color}00; }
          100% { box-shadow: 0 0 0 0 ${color}00; }
        }
      `}</style>
    </span>
  );
}

// Pillish primary button.
function PillButton({ children, dark = false, accent, onClick, full = false, icon = false }) {
  const bg = dark ? '#1A1815' : (accent || '#1A1815');
  const fg = '#fff';
  return (
    <button onClick={onClick} style={{
      appearance: 'none', border: 0, cursor: 'pointer',
      background: bg, color: fg,
      padding: '14px 22px', borderRadius: 999,
      fontFamily: 'Inter', fontSize: 15, fontWeight: 600,
      letterSpacing: -0.1,
      width: full ? '100%' : 'auto',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      transition: 'transform 120ms ease',
    }}
    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      {children}
      {icon && (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5" stroke={fg} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </button>
  );
}

// Ghost button.
function GhostButton({ children, onClick, full = false, color = '#1A1815' }) {
  return (
    <button onClick={onClick} style={{
      appearance: 'none', cursor: 'pointer',
      background: 'transparent', color,
      padding: '13px 20px', borderRadius: 999,
      border: `1px solid ${color}33`,
      fontFamily: 'Inter', fontSize: 15, fontWeight: 500,
      width: full ? '100%' : 'auto',
    }}>{children}</button>
  );
}

// Faux notification card — used by the live demo strip.
function NotifCard({ app, title, body, time, accent = '#FF5B2E', dimmed = false }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRadius: 18,
      padding: '12px 14px',
      display: 'flex', gap: 10, alignItems: 'flex-start',
      opacity: dimmed ? 0.55 : 1,
      boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: 7, background: accent, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontFamily: '"Instrument Serif", serif', fontStyle: 'italic',
        fontSize: 16, lineHeight: 1,
      }}>{app}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          fontSize: 13, fontWeight: 600, color: '#1A1815',
        }}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</span>
          <span style={{ fontSize: 11, fontWeight: 400, color: '#666', marginLeft: 8 }}>{time}</span>
        </div>
        <div style={{ fontSize: 13, color: '#1A1815', lineHeight: 1.35, marginTop: 2 }}>{body}</div>
      </div>
    </div>
  );
}

// Caret used in animated typing.
function Caret({ color = '#1A1815' }) {
  return (
    <span style={{
      display: 'inline-block', width: 2, height: '0.95em', verticalAlign: 'text-bottom',
      background: color, marginLeft: 2,
      animation: 'parry-caret 1s steps(2) infinite',
    }}>
      <style>{`@keyframes parry-caret { 50% { opacity: 0; } }`}</style>
    </span>
  );
}

// Hook: types `text` char-by-char, then holds.
function useTyped(text, { speed = 40, startDelay = 300 } = {}) {
  const [out, setOut] = React.useState('');
  React.useEffect(() => {
    setOut('');
    let i = 0;
    const start = setTimeout(function tick() {
      if (i <= text.length) {
        setOut(text.slice(0, i));
        i++;
        setTimeout(tick, speed);
      }
    }, startDelay);
    return () => clearTimeout(start);
  }, [text, speed, startDelay]);
  return out;
}

Object.assign(window, {
  ParryMark, ParryWord, MicroTag, Hairline, LiveDot,
  PillButton, GhostButton, NotifCard, Caret, useTyped,
});
