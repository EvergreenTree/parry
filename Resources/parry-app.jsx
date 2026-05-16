const {
  IOSDevice, ChromeWindow,
  PhoneDark,
  DesktopStage,
} = window;

// Phone artboard
const PW = 402, PH = 874;
const PHONE_PAD = 32;
const PAW = PW + PHONE_PAD * 2;
const PAH = PH + PHONE_PAD * 2;

// Desktop artboard
const DW = 1280, DH = 800;
const DESK_PAD = 24;
const DAW = DW + DESK_PAD * 2;
// Browser chrome adds ~80px of height
const DAH = DH + DESK_PAD * 2 + 80;

function PhoneFrame({ children }) {
  return (
    <div style={{
      width: PAW, height: PAH,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <IOSDevice width={PW} height={PH}>{children}</IOSDevice>
    </div>
  );
}

function WebFrame({ children }) {
  return (
    <div style={{
      width: DAW, height: DAH,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <ChromeWindow
        width={DW} height={DH + 80}
        url="parry.app"
        tabs={[{ title: 'Parry — on-device AI', active: true }, { title: 'New Tab' }]}
        activeIndex={0}
      >
        <div style={{ width: '100%', height: '100%' }}>{children}</div>
      </ChromeWindow>
    </div>
  );
}

function App() {
  const useMobileFrame = window.matchMedia('(max-width: 900px)').matches;

  return (
    <div style={{
      margin: 0,
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#050505',
      overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {useMobileFrame ? (
          <PhoneFrame><PhoneDark /></PhoneFrame>
        ) : (
          <WebFrame><DesktopStage /></WebFrame>
        )}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
