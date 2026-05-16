// Desktop variant C — "Stage" — dark, theatrical. Parrot lit by a
// spotlight in the middle of an empty stage; talk button glows below.

function DesktopStage({ accent = '#FF5B2E' }) {
  const bg = '#0E0E0C';
  const ink = '#F2EFE8';
  const muted = 'rgba(242,239,232,0.55)';
  const [speaking, setSpeaking] = React.useState(false);

  return (
    <div style={{
      width: '100%', height: '100%', background: bg, color: ink,
      fontFamily: 'Inter', display: 'flex', flexDirection: 'column',
      overflow: 'hidden', position: 'relative',
      backgroundImage: `radial-gradient(ellipse 50% 60% at 50% 55%, ${accent}26 0%, transparent 65%)`,
    }}>
      {/* top nav */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '24px 40px', flexShrink: 0, position: 'relative', zIndex: 2,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ParryMark size={22} color={ink}/>
          <ParryWord size={24} color={ink}/>
        </div>
        <div style={{ display: 'flex', gap: 26, fontSize: 13, color: ink }}>
          <span>Manifesto</span><span>Privacy</span><span>Download</span>
        </div>
        <MicroTag color={muted}>● running locally · 0 ms</MicroTag>
      </div>

      {/* stage */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '0 40px',
        position: 'relative', zIndex: 2,
      }}>
        {/* eyebrow */}
        <h1 style={{
          fontFamily: '"Instrument Serif", serif',
          fontWeight: 400, fontSize: 76, lineHeight: 0.95,
          margin: 0, letterSpacing: -1.8, color: ink,
          textAlign: 'center', textWrap: 'balance',
        }}>
          One parrot. <em style={{ color: accent }}>One person.</em>
        </h1>
        <p style={{
          margin: '16px 0 28px', fontSize: 16, lineHeight: 1.5,
          color: muted, textAlign: 'center', maxWidth: 540,
        }}>
          A model trained by you, for you, on the chip in your pocket.
          Press and speak.
        </p>

        <ParrotMascot size={300} bodyColor={accent}
                      bellyColor="#3B2E1F" wingColor="#C9381B"
                      branchColor={ink} speaking={speaking}/>

        <div style={{ marginTop: 16 }}>
          <TalkButton size={104} color={accent} dark
            onPressStart={() => setSpeaking(true)}
            onPressEnd={() => setTimeout(() => setSpeaking(false), 600)} />
        </div>
      </div>

      {/* bottom strip */}
      <div style={{
        padding: '20px 40px', display: 'flex', justifyContent: 'space-between',
        flexShrink: 0, position: 'relative', zIndex: 2,
        borderTop: `1px solid rgba(255,255,255,0.06)`,
      }}>
        <MicroTag color={muted}>iOS 18+ · Android 14+</MicroTag>
        <MicroTag color={muted}>open weights · MIT</MicroTag>
        <MicroTag color={muted}>github.com/parry/parry ↗</MicroTag>
      </div>

      {/* faint floor line */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 78, height: 1,
        background: `linear-gradient(90deg, transparent, ${accent}55 50%, transparent)`,
        zIndex: 1,
      }}/>
    </div>
  );
}

window.DesktopStage = DesktopStage;
