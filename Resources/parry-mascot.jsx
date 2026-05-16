// Parrot mascot — geometric SVG, gentle idle animation.
// Built from primitives (ellipses, circles, paths). On `speaking`, the
// mouth opens and sound rings emit.

function ParrotMascot({
  size = 220,
  bodyColor = '#FF5B2E',
  wingColor = '#E0481E',
  bellyColor = '#FFD9A8',
  beakColor = '#1A1815',
  eyeColor = '#1A1815',
  branchColor = '#1A1815',
  showBranch = true,
  speaking = false,
  blinking = true,
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 240 240"
         style={{ overflow: 'visible', display: 'block' }}>
      <defs>
        <clipPath id="pp-belly-clip">
          {/* belly is the lower-front quadrant of the body ellipse */}
          <ellipse cx="118" cy="128" rx="46" ry="54" />
        </clipPath>
      </defs>

      <style>{`
        @keyframes pp-bob   { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-3px) rotate(-1.2deg); } }
        @keyframes pp-blink { 0%,92%,100% { transform: scaleY(1); } 96% { transform: scaleY(0.05); } }
        @keyframes pp-ring  { 0% { r: 70; opacity: 0.55; } 100% { r: 110; opacity: 0; } }
        @keyframes pp-jaw   { 0%,100% { transform: translateY(0); } 50% { transform: translateY(2.5px); } }
        .pp-body  { transform-origin: 120px 130px; animation: pp-bob 4.2s ease-in-out infinite; }
        .pp-eye   { transform-origin: 142px 76px; animation: ${blinking ? 'pp-blink 5.5s ease-in-out infinite' : 'none'}; }
        .pp-jaw   { transform-origin: 175px 96px; animation: ${speaking ? 'pp-jaw 0.42s ease-in-out infinite' : 'none'}; }
        .pp-ring  { animation: pp-ring 1.6s ease-out infinite; transform-origin: 195px 86px; }
        .pp-ring2 { animation-delay: 0.4s; }
        .pp-ring3 { animation-delay: 0.8s; }
      `}</style>

      {/* Branch / perch */}
      {showBranch && (
        <g>
          <rect x="20" y="200" width="200" height="6" rx="3" fill={branchColor} />
          <rect x="60" y="206" width="4" height="14" rx="2" fill={branchColor} />
          <rect x="170" y="206" width="4" height="14" rx="2" fill={branchColor} />
        </g>
      )}

      <g className="pp-body">
        {/* Tail (behind body) */}
        <path d="M 78 158 Q 38 172 30 210 L 70 198 Q 78 184 88 174 Z" fill={wingColor} />
        <path d="M 84 168 Q 56 182 52 208 L 76 200 Q 82 188 92 178 Z" fill={bodyColor} />

        {/* Feet */}
        <path d="M104 198 L100 214 M112 198 L114 214 M108 198 L108 214"
              stroke={branchColor} strokeWidth="3" strokeLinecap="round" />
        <path d="M138 198 L134 214 M146 198 L148 214 M142 198 L142 214"
              stroke={branchColor} strokeWidth="3" strokeLinecap="round" />

        {/* Body */}
        <ellipse cx="124" cy="140" rx="52" ry="58" fill={bodyColor} />
        {/* Belly */}
        <ellipse cx="118" cy="148" rx="32" ry="40" fill={bellyColor} clipPath="url(#pp-belly-clip)"/>

        {/* Wing */}
        <path d="M 130 96 Q 178 116 166 174 Q 138 182 116 168 Q 108 132 130 96 Z" fill={wingColor} />
        {/* Wing feather lines */}
        <path d="M 132 110 Q 158 122 158 156" stroke={bodyColor} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M 124 126 Q 146 140 150 168" stroke={bodyColor} strokeWidth="2.5" fill="none" strokeLinecap="round"/>

        {/* Head */}
        <circle cx="138" cy="84" r="42" fill={bodyColor} />
        {/* Crest tuft */}
        <path d="M 116 50 Q 122 28 132 30 Q 130 42 124 52 Z" fill={wingColor} />
        <path d="M 130 44 Q 142 24 152 30 Q 146 44 138 54 Z" fill={wingColor} />

        {/* Cheek patch */}
        <circle cx="124" cy="98" r="9" fill="#FFB199" opacity="0.7" />

        {/* Eye */}
        <g>
          <circle cx="142" cy="76" r="8" fill="#fff" stroke={eyeColor} strokeWidth="1.5"/>
          <g className="pp-eye">
            <circle cx="143" cy="76" r="4.5" fill={eyeColor} />
            <circle cx="144.5" cy="74" r="1.4" fill="#fff" />
          </g>
        </g>

        {/* Beak */}
        {/* upper beak */}
        <path d="M 168 78 Q 200 82 198 96 L 184 102 Q 172 96 160 92 Z"
              fill={beakColor} />
        {/* lower beak (animates open/close when speaking) */}
        <g className="pp-jaw">
          <path d="M 172 96 Q 192 100 190 108 Q 178 110 168 102 Z" fill="#3B2E1F" />
        </g>
        {/* nostril */}
        <circle cx="190" cy="88" r="1.6" fill="#fff" opacity="0.7" />
      </g>

      {/* Speaking sound rings */}
      {speaking && (
        <g fill="none" stroke={bodyColor} strokeWidth="2" strokeLinecap="round">
          <circle className="pp-ring"  cx="195" cy="86" r="70" />
          <circle className="pp-ring pp-ring2" cx="195" cy="86" r="70" />
          <circle className="pp-ring pp-ring3" cx="195" cy="86" r="70" />
        </g>
      )}
    </svg>
  );
}

// "Hold to talk" button — a circular primary action with a
// progress ring that fills while pressed. Triggers `onSpeak` on press.
function TalkButton({
  size = 88, color = '#FF5B2E', dark = false,
  onPressStart, onPressEnd, label = 'Hold to talk',
}) {
  const [pressed, setPressed] = React.useState(false);
  const start = () => { setPressed(true); onPressStart && onPressStart(); };
  const end   = () => { setPressed(false); onPressEnd && onPressEnd(); };

  const ringCol = dark ? '#fff' : '#fff';
  const bg = pressed ? '#0E0E0C' : color;

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <button
        onMouseDown={start} onMouseUp={end} onMouseLeave={end}
        onTouchStart={(e) => { e.preventDefault(); start(); }}
        onTouchEnd={end}
        aria-label={label}
        style={{
          width: size, height: size, borderRadius: '50%',
          background: bg, border: 0, cursor: 'pointer',
          boxShadow: pressed
            ? `0 4px 14px -4px ${color}66, inset 0 0 0 4px rgba(255,255,255,0.14)`
            : `0 14px 28px -10px ${color}66, 0 1px 0 rgba(0,0,0,0.08)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
          transition: 'transform 120ms ease, background 200ms ease, box-shadow 200ms ease',
          transform: pressed ? 'scale(0.96)' : 'scale(1)',
        }}
      >
        {/* mic glyph */}
        <svg width={size * 0.42} height={size * 0.42} viewBox="0 0 24 24" fill="none">
          <rect x="9" y="3" width="6" height="12" rx="3" fill="#fff"/>
          <path d="M5 11a7 7 0 0014 0M12 18v3" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        {/* breathing pulse when idle */}
        {!pressed && (
          <span style={{
            position: 'absolute', inset: -6, borderRadius: '50%',
            border: `2px solid ${color}55`,
            animation: 'pp-breathe 2.4s ease-out infinite',
          }} />
        )}
        <style>{`
          @keyframes pp-breathe {
            0%   { transform: scale(0.92); opacity: 0; }
            40%  { opacity: 0.8; }
            100% { transform: scale(1.18); opacity: 0; }
          }
        `}</style>
      </button>
      <span style={{
        fontFamily: '"JetBrains Mono", ui-monospace, monospace',
        fontSize: 11, letterSpacing: 1.6, textTransform: 'uppercase',
        color: dark ? 'rgba(255,255,255,0.7)' : '#7A736A',
      }}>
        {pressed ? 'listening…' : label}
      </span>
    </div>
  );
}

window.ParrotMascot = ParrotMascot;
window.TalkButton = TalkButton;
