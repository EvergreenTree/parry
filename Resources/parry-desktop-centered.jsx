// Desktop variant A — "Centered" — minimal hero like a meditation app:
// tiny topnav, parrot center, headline below, single talk button.

function DesktopCentered({ accent = '#FF5B2E' }) {
  const ink = '#1A1815';
  const paper = '#F5F0E6';
  const muted = '#7A736A';
  const [speaking, setSpeaking] = React.useState(false);

  return (
    <div style={{
      width: '100%', height: '100%', background: paper, color: ink,
      fontFamily: 'Inter', display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* topnav */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '24px 40px', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ParryMark size={24} color={ink}/>
          <ParryWord size={26} color={ink}/>
        </div>
        <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          {['Manifesto', 'Privacy', 'Download'].map((l) => (
            <span key={l} style={{ fontSize: 14, color: ink, cursor: 'pointer' }}>{l}</span>
          ))}
          <button style={{
            background: ink, color: paper, border: 0, cursor: 'pointer',
            padding: '10px 16px', borderRadius: 999,
            fontFamily: 'Inter', fontWeight: 500, fontSize: 13,
          }}>Get Parry</button>
        </div>
      </div>

      {/* hero */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '0 40px',
        gap: 4,
      }}>
        <MicroTag color={accent}>◆ on-device · free · forever</MicroTag>
        <ParrotMascot size={260} bodyColor={accent} speaking={speaking} />
        <h1 style={{
          fontFamily: '"Instrument Serif", serif',
          fontWeight: 400, fontSize: 88, lineHeight: 0.96,
          margin: '12px 0 0', letterSpacing: -2.2, color: ink,
          textAlign: 'center', textWrap: 'balance',
        }}>
          Say it. <em style={{ color: accent }}>I'll repeat.</em>
        </h1>
        <p style={{
          margin: '18px 0 28px', fontSize: 17, lineHeight: 1.5,
          color: muted, textAlign: 'center', maxWidth: 540, textWrap: 'pretty',
        }}>
          Parry is a small parrot of an AI that lives on your phone.
          It learns from your world — and only yours. Free, forever.
        </p>
        <TalkButton size={108} color={accent}
          onPressStart={() => setSpeaking(true)}
          onPressEnd={() => setTimeout(() => setSpeaking(false), 600)} />
      </div>

      {/* footer strip */}
      <div style={{
        padding: '16px 40px 22px', display: 'flex',
        justifyContent: 'space-between', flexShrink: 0,
      }}>
        <MicroTag color={muted}>made for one person at a time</MicroTag>
        <MicroTag color={muted}>iOS 18+ · Android 14+</MicroTag>
      </div>
    </div>
  );
}

window.DesktopCentered = DesktopCentered;
