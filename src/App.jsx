import { useState, useEffect, useRef } from 'react'
import './App.css'
import vaultBasimImg from './assets/vault-basim.png'
import GorgTab from './GorgTab'

// Hacking Mini-game Configuration Data
const WORD_LIST = ["NETWORK", "ROUTING", "GATEWAY", "FIREWALL", "SUBSETS", "SYSLOGS", "COOKIES", "PACKETS", "CONSOLE", "DESKTOP"];

// BIOS Boot Sequence Data
const bootMessages = [
  "BIOS Date 08/21/26 12:08:24 Ver 1.00",
  "CPU: RobCo Integrated Processor @ 3.80GHz",
  "Memory Test: 32768K OK",
  "Initializing USB Controllers... Done.",
  "Mounting virtual file systems...",
  "Loading user profile: Basim...",
  "Decrypting terminal protocols... OK.",
  "Starting interactive shell..."
];

const asciiArt = `
 ____           _              ___  ____  
| __ )  __ _ __(_)_ __ ___    / _ \\/ ___| 
|  _ \\ / _\` / __| | '_ \` _ \\ | | | \\___ \\ 
| |_) | (_| \\__ \\ | | | | | || |_| |___) |
|____/ \\__,_|___/_|_| |_| |_| \\___/|____/ 
                              
WELCOME TO THE WASTELAND, BASIM AHMED ELOSTAZ.
`;

// Radio Station Data
const radioStations = [
  { id: "gnr", name: "GALAXY NEWS RADIO", freq: "104.4 FM", src: "/music/gnr.mp3" },
  { id: "lofi", name: "WASTELAND LO-FI", freq: "89.3 FM", src: "/music/lofi.mp3" },
  { id: "static", name: "ENCLAVE DISTRESS", freq: "120.0 AM", src: "/music/static.mp3" }
];

function App() {
  // Navigation & Boot State
  const [booting, setBooting] = useState(true);
  const [activeTab, setActiveTab] = useState("HOME");
  const [visibleLines, setVisibleLines] = useState([]);
  const [showAscii, setShowAscii] = useState(false);
  
  // Ticketing System State
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Radio Player State
  const audioRef = useRef(null);
  const [currentStation, setCurrentStation] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Hacking Game State Logic
  const [inGame, setInGame] = useState(false);
  const [secretPassword, setSecretPassword] = useState("");
  const [attempts, setAttempts] = useState(4);
  const [logs, setLogs] = useState(["ENTER AUTHORIZATION CREDENTIALS..."]);
  const [gameWon, setGameWon] = useState(false);
  const [gameLost, setGameLost] = useState(false);

  // Helpdesk Experience Data
  const ticketData = [
    {
      id: "TKT-3192",
      status: "RESOLVED",
      client: "ERICKSON SENIOR LIVING",
      title: "END-USER HARDWARE & NETWORK FAILURE",
      desc: "Users reporting system crashes, unresponsive peripherals, and intermittent network drops across multiple workstations.",
      resolution: "Ran hardware diagnostics and replaced faulty RAM modules. Updated network interface drivers and reconfigured local routing protocols. Provided empathetic desk-side support to ensure end-users were comfortable with the restored setups."
    },
    {
      id: "TKT-4401",
      status: "CLOSED",
      client: "INTERNAL IT (COMPTIA A+ / GOOGLE IT)",
      title: "SECURITY AUDIT & COMPLIANCE SCAN",
      desc: "Routine vulnerability scan required to verify system integrity and firewall rule configurations.",
      resolution: "Executed full malware sweep, verified secure access protocols, and restricted elevated privileges. All systems optimized and operating within acceptable security parameters."
    },
    {
      id: "TKT-8899",
      status: "IN PROGRESS",
      client: "BASIM-OS INIT",
      title: "DEVELOP CUSTOM TERMINAL OS",
      desc: "Need a centralized web interface to deploy personal projects, React builds, and Node.js environments.",
      resolution: "Constructing dynamic React-based terminal interface. Implementing hacking mini-games, custom CSS scanlines, and seamless routing."
    }
  ];

  const playClick = () => {
    const clickAudio = new Audio('/click.mp3');
    clickAudio.volume = 0.4;
    clickAudio.play().catch(err => console.log("Audio muted until interaction."));
  };

  const handleTabChange = (tabName) => {
    playClick();
    setActiveTab(tabName);
    if (tabName !== "DATA") setInGame(false);
    if (tabName !== "TICKETS") setSelectedTicket(null);
  };

  // Radio Logic
  const toggleRadio = (station) => {
    playClick();
    if (currentStation?.id === station.id) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else {
      setCurrentStation(station);
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (audioRef.current && currentStation) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Radio play blocked by browser:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentStation, isPlaying]);

  // Hacking Logic
  const pickRandomPassword = () => {
    const randomIndex = Math.floor(Math.random() * WORD_LIST.length);
    setSecretPassword(WORD_LIST[randomIndex]);
  };

  useEffect(() => {
    pickRandomPassword();
  }, []);

  const checkLikeness = (word) => {
    let likeness = 0;
    const checkLength = Math.min(word.length, secretPassword.length);
    for (let i = 0; i < checkLength; i++) {
      if (word[i] === secretPassword[i]) {
        likeness++;
      }
    }
    return likeness;
  };

  const handleWordGuess = (word) => {
    playClick();
    if (gameWon || gameLost) return;

    if (word === secretPassword) {
      setGameWon(true);
      setLogs([...logs, `> ${word}`, "> ACCESS GRANTED. CREDENTIALS VERIFIED.", "> STATUS: LEVEL MAX DISCOVERED."]);
    } else {
      const remainingAttempts = attempts - 1;
      setAttempts(remainingAttempts);
      const likeness = checkLikeness(word);
      
      if (remainingAttempts <= 0) {
        setGameLost(true);
        setLogs([...logs, `> ${word}`, "> ACCESS DENIED. LOCKOUT INITIATED."]);
      } else {
        setLogs([...logs, `> ${word}`, `> ERROR: LINK EXP_FACTOR: LIKENESS=${likeness}/7`]);
      }
    }
  };

  const resetHackingGame = () => {
    playClick();
    pickRandomPassword();
    setAttempts(4);
    setLogs(["ENTER AUTHORIZATION CREDENTIALS..."]);
    setGameWon(false);
    setGameLost(false);
  };

  // Boot Sequence
  useEffect(() => {
    let currentIndex = 0;
    const intervalId = setInterval(() => {
      if (currentIndex < bootMessages.length) {
        setVisibleLines(prev => [...prev, bootMessages[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(intervalId);
        setTimeout(() => {
          setShowAscii(true);
          setTimeout(() => { setBooting(false); }, 2500); 
        }, 400);
      }
    }, 250); 
    return () => clearInterval(intervalId);
  }, []);

  if (booting) {
    return (
      <div className="terminal-boot">
        <div style={{ textAlign: "left" }}>
          {visibleLines.map((line, index) => <div key={index}>{line}</div>)}
          {showAscii && <pre className="ascii-logo">{asciiArt}</pre>}
        </div>
        <div className="cursor"></div>
      </div>
    );
  }

  return (
    <div className="pip-interface">
      <nav className="tabs">
        <button className={activeTab === "HOME" ? "active" : ""} onClick={() => handleTabChange("HOME")}>HOME</button>
        <button className={activeTab === "STAT" ? "active" : ""} onClick={() => handleTabChange("STAT")}>STAT</button>
        <button className={activeTab === "TICKETS" ? "active" : ""} onClick={() => handleTabChange("TICKETS")}>TICKETS</button>
        <button className={activeTab === "DATA" ? "active" : ""} onClick={() => handleTabChange("DATA")}>DATA</button>
        <button className={activeTab === "INV" ? "active" : ""} onClick={() => handleTabChange("INV")}>INV</button>
        <button className={activeTab === "MAP" ? "active" : ""} onClick={() => handleTabChange("MAP")}>MAP</button>
        <button className={activeTab === "RADIO" ? "active" : ""} onClick={() => handleTabChange("RADIO")}>RADIO</button>
        <button className={activeTab === "GORG" ? "active" : ""} onClick={() => handleTabChange("GORG")}>☢️ GORG</button>
      </nav>
      
      <main className="screen-content">
        {/* ... (HOME, STAT, TICKETS, DATA, INV, MAP TABS REMAIN EXACTLY THE SAME) ... */}
        {activeTab === "HOME" && (
          <div className="home-container">
            <div className="profile-header">
              <p>STATUS: ONLINE</p>
              <p>SYSTEM: BASIM-OS v2.5</p>
            </div>
            <div className="avatar-display">
              <h3>IT SUPPORT SPECIALIST</h3>
              <div className="avatar-frame"><img src={vaultBasimImg} alt="Vault Basim" className="vault-boy-img" /></div>
              <p className="quote-text">"SPECIALIZING IN SYSTEM DIAGNOSTICS, NETWORK ARCHITECTURE, AND BUILDING EXCEPTIONAL DIGITAL WASTELAND EXPERIENCES."</p>
              <h2 className="user-name">BASIM ELOSTAZ</h2>
            </div>
            <div className="home-footer"><hr /><p>&gt; SELECT A TAB TO BEGIN NAVIGATION</p></div>
          </div>
        )}

        {activeTab === "STAT" && (
          <div className="tab-content special-layout">
            <h2>[ S.P.E.C.I.A.L. ATTRIBUTES ]</h2>
            <div className="special-grid">
              <div className="stat-card"><div className="stat-row"><span className="stat-name">STRENGTH</span><span className="stat-value">8</span></div><p className="stat-desc">Gym workout starting. Building muscle and improving overall physical fitness.</p></div>
              <div className="stat-card"><div className="stat-row"><span className="stat-name">PERCEPTION</span><span className="stat-value">7</span></div><p className="stat-desc">Exceptional system log scanning and deep ticket troubleshooting instincts.</p></div>
              <div className="stat-card"><div className="stat-row"><span className="stat-name">ENDURANCE</span><span className="stat-value">6</span></div><p className="stat-desc">Frame build: 6'0" // 225 lbs. High stamina calibration via heavy bag training.</p></div>
              <div className="stat-card"><div className="stat-row"><span className="stat-name">CHARISMA</span><span className="stat-value">7</span></div><p className="stat-desc">User-support tier empathy. Translates complex jargon into safe corporate-speak.</p></div>
              <div className="stat-card"><div className="stat-row"><span className="stat-name">INTELLIGENCE</span><span className="stat-value">9</span></div><p className="stat-desc">Dual-certified (CompTIA A+ & Google IT). High processing speeds.</p></div>
              <div className="stat-card"><div className="stat-row"><span className="stat-name">AGILITY</span><span className="stat-value">8</span></div><p className="stat-desc">High precision rendering. Smooth execution loops while making indie games.</p></div>
              <div className="stat-card"><div className="stat-row"><span className="stat-name">LUCK</span><span className="stat-value">9</span></div><p className="stat-desc">Saltwater angling perk active. Grants a permanent critical multiplier bonus near coastlines.</p></div>
            </div>
          </div>
        )}

        {activeTab === "TICKETS" && (
          <div className="tab-content ticketing-layout">
            <h2>[ ROBCO HELPDESK : ACTIVE TICKETS ]</h2>
            {!selectedTicket ? (
              <div className="ticket-list">
                <div className="ticket-header"><span className="col-id">ID</span><span className="col-status">STATUS</span><span className="col-title">SUBJECT</span></div>
                {ticketData.map((tkt) => (
                  <button key={tkt.id} className="ticket-row-btn" onClick={() => { playClick(); setSelectedTicket(tkt); }}>
                    <span className="col-id">{tkt.id}</span>
                    <span className={`col-status ${tkt.status === 'RESOLVED' || tkt.status === 'CLOSED' ? 'status-green' : 'status-yellow'}`}>[{tkt.status}]</span>
                    <span className="col-title">{tkt.title}</span>
                  </button>
                ))}
                <div className="executable-container" style={{ marginTop: '40px' }}><hr className="dashed-hr" /><p className="dim-text">ENCOUNTERING AN ERROR? CONTACT THE ADMIN.</p><button className="exec-btn" onClick={() => { playClick(); window.location.href = "mailto:basimelostaz@gmail.com"; }}>+ SUBMIT NEW TICKET</button></div>
              </div>
            ) : (
              <div className="ticket-detail">
                <div className="ticket-detail-header"><h3>LOG: {selectedTicket.id}</h3><button className="back-link-btn" onClick={() => { playClick(); setSelectedTicket(null); }}>&lt; RETURN TO QUEUE</button></div>
                <div className="ticket-body">
                  <p><strong>CLIENT:</strong> {selectedTicket.client}</p>
                  <p><strong>STATUS:</strong> <span className={selectedTicket.status === 'IN PROGRESS' ? 'text-yellow' : ''}>{selectedTicket.status}</span></p>
                  <hr className="dashed-hr" />
                  <p className="tkt-label dim-text">USER DESCRIPTION:</p>
                  <p className="tkt-text">{selectedTicket.desc}</p><br />
                  <p className="tkt-label dim-text">ADMIN RESOLUTION:</p>
                  <p className="tkt-text highlight-text">&gt; {selectedTicket.resolution}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "DATA" && (
          <div className="tab-content">
            {!inGame ? (
              <div>
                <h2>QUEST LOG & SYSTEM ARCHIVES</h2>
                <div className="quest-list">
                  <p>[ ACTIVE ] IT SUPPORT INTERN - ERICKSON SENIOR LIVING</p>
                  <p>[ COMPLETE ] COMPTIA A+ CERTIFICATION</p>
                  <p>[ COMPLETE ] GOOGLE IT SUPPORT CERTIFICATE</p>
                  <p>[ COMPLETE ] GOOGLE AI PROFESSIONAL CERTIFICATE</p>
                  <p>[ ONGOING ] IT DEGREE - UNIVERSITY OF PHOENIX</p>
                </div>
                <div className="executable-container">
                  <hr className="dashed-hr" />
                  <p className="blink-text">&gt; SYSTEM THREAT DETECTED: UNLINKED ENCRYPTION</p>
                  <button className="exec-btn" onClick={() => { playClick(); setInGame(true); }}>RUN CODESEC.EXE (ROUTING ENCRYPTION INTERACTION)</button>
                </div>
              </div>
            ) : (
              <div className="hacking-game-container">
                <h2>ROUTING OVERRIDE IN PROGRESS: CODESEC.EXE</h2>
                <p className="attempts-indicator">{attempts} ATTEMPT(S) REMAINING: {"█ ".repeat(attempts)}</p>
                <div className="hacking-grid">
                  <div className="hex-word-column">
                    <p className="dim-text">0xF42C  _#$%^!!*</p>
                    <p className="dim-text">0xF438  []=--+_\\</p>
                    {WORD_LIST.map((word, idx) => (
                      <button key={idx} className={`word-guess-btn ${gameWon || gameLost ? 'disabled' : ''}`} onClick={() => handleWordGuess(word)} disabled={gameWon || gameLost}>
                        0x{ (62508 + idx * 12).toString(16).toUpperCase() } {word}
                      </button>
                    ))}
                    <p className="dim-text">0xF51A  {}|:*&lt;&gt;?</p>
                  </div>
                  <div className="hacking-logs">
                    <h3>DIAGNOSTIC STATUS OUTPUT:</h3>
                    <div className="log-scroll-box">{logs.map((log, idx) => (<p key={idx} className="log-line">{log}</p>))}</div>
                    {(gameWon || gameLost) && (<button className="exec-btn reset-btn" onClick={resetHackingGame}>REBOOT FIREWALL COMPILER</button>)}
                  </div>
                </div>
                <button className="back-link-btn" onClick={() => { playClick(); setInGame(false); }}>&lt; TERMINATE PROCESS AND RETURN TO LOGS</button>
              </div>
            )}
          </div>
        )}

        {activeTab === "INV" && (
          <div className="tab-content inventory-layout">
            <h2>[ INVENTORY ]</h2>
            <div className="inv-grid">
              <div className="inv-category">
                <h3>WEAPONS & TOOLS (IT SKILLS)</h3>
                <ul>
                  <li>⚡ HARDWARE DIAGNOSTICS (MAX RANK)</li>
                  <li>🔧 NETWORK TROUBLESHOOTING (RANK 2)</li>
                  <li>🎨 BLENDER / 3D MODELING (RANK 1)</li>
                  <li>👾 PIXEL ART RENDERING (RANK 2)</li>
                </ul>
              </div>
              <div className="inv-category">
                <h3>QUEST ITEMS (PROJECTS & HOBBIES)</h3>
                <ul>
                  <li>🐟 "CATCHUP" SOURCE CODE (SOCIAL FISHING GAME)</li>
                  <li>🥊 BOXING GLOVES (EQUIPPED // +5 ENDURANCE)</li>
                  <li>🎣 SALTWATER PIER ROD (+10 LUCK NEAR COASTLINES)</li>
                  <li>🎲 GOLIATH CHARACTER SHEET (DND CAMPAIGN)</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === "MAP" && (
          <div className="tab-content local-map">
            <h2>[ WORLD MAP ]</h2>
            <div className="map-display">
              <p className="blink-text">&gt;&gt; RADAR SCANNING... OVERSEER LOCATED &lt;&lt;</p>
              <div className="map-radar"><div className="radar-circle"></div><div className="radar-ping"></div></div>
              <p>CURRENT SECTOR: SUGAR LAND, TX</p>
              <p>REGION: HOUSTON WASTELAND AREA</p>
              <p>FACTION: UNIVERSITY OF PHOENIX (IT SECTOR)</p>
            </div>
          </div>
        )}

        {/* --- NEW RADIO TAB INTERFACE --- */}
        {activeTab === "RADIO" && (
          <div className="tab-content radio-layout">
            <h2>[ COMM LINK & RADIO TUNER ]</h2>
            
            <div className="radio-grid">
              <div className="comms-section">
                <h3>&gt;&gt; SECURE COMMS</h3>
                <ul className="radio-list">
                  <li>📡 <a href="mailto:basimelostaz@gmail.com" onClick={playClick} target="_blank" rel="noreferrer">EMAIL: BASIMELOSTAZ@GMAIL.COM</a></li>
                  <li>🌐 <a href="https://www.linkedin.com/in/basim-elostaz/" onClick={playClick} target="_blank" rel="noreferrer">LINKEDIN // SECURE_COMMS_01</a></li>
                  <li>💻 <a href="https://github.com/Basimelostaz" onClick={playClick} target="_blank" rel="noreferrer">GITHUB // SOURCE_VAULT</a></li>
                </ul>
                <div className="radio-chatter">
                  <p className="dim-text">BACKGROUND NOISE: *AM METEOROLOGICAL DATA STATIC INTERMITTENT*</p>
                </div>
              </div>

              <div className="tuner-section">
                <h3>&gt;&gt; PIP-BOY FM TUNER</h3>
                
                <div className="tuner-display">
                  <p className="dim-text">CURRENT FREQUENCY:</p>
                  <h4 className="freq-text">{currentStation ? currentStation.freq : "OFFLINE"}</h4>
                  <p className={`station-name ${isPlaying ? 'blink-text' : ''}`}>
                    {currentStation && isPlaying 
                      ? `▶ PLAYING: ${currentStation.name}` 
                      : (currentStation ? `⏸ PAUSED: ${currentStation.name}` : "SELECT A STATION TO TUNE IN")}
                  </p>
                </div>
                
                <div className="station-list">
                  {radioStations.map(station => (
                    <button 
                      key={station.id}
                      className={`exec-btn station-btn ${currentStation?.id === station.id ? 'active-station' : ''}`}
                      onClick={() => toggleRadio(station)}
                    >
                      {currentStation?.id === station.id && isPlaying ? '⏸ STOP' : '▶ TUNE'} :: {station.freq}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "GORG" && <GorgTab playClick={playClick} />}
        
        {/* Hidden Audio Element - Kept outside the tab logic so music persists across tabs! */}
        <audio ref={audioRef} src={currentStation?.src} loop />
      </main>
    </div>
  )
}

export default App