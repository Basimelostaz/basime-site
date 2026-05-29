import { useState, useEffect } from 'react'
import './App.css'
import vaultBasimImg from './assets/vault-basim.png'

// Hacking Mini-game Configuration Data
const WORD_LIST = ["NETWORK", "ROUTING", "GATEWAY", "FIREWALL", "SUBSETS", "SYSLOGS", "COOKIES", "PACKETS", "CONSOLE", "DESKTOP"];
const SECRET_PASSWORD = "FIREWALL"; // The winning target word

function App() {
  const [booting, setBooting] = useState(true);
  const [activeTab, setActiveTab] = useState("HOME");
  const [text, setText] = useState("");
  
  // Hacking Game State Logic
  const [inGame, setInGame] = useState(false);
  const [attempts, setAttempts] = useState(4);
  const [logs, setLogs] = useState(["ENTER AUTHORIZATION CREDENTIALS..."]);
  const [gameWon, setGameWon] = useState(false);
  const [gameLost, setGameLost] = useState(false);

  const fullText = "INITIALIZING BASIM-OS v2.5...\nCHECKING SYSTEM INTEGRITY... OK\nLOADING PERSONAL DATA TERMINAL...\nWELCOME, BASIM AHMED ELOSTAZ.";

  const playClick = () => {
    const audio = new Audio('/click.mp3');
    audio.volume = 0.4;
    audio.play().catch(err => console.log("Audio muted until interaction."));
  };

  const handleTabChange = (tabName) => {
    playClick();
    setActiveTab(tabName);
    // Automatically reset or close the game if navigating away
    if (tabName !== "DATA") setInGame(false);
  };

  // Algorithm to check matching character indexes
  const checkLikeness = (word) => {
    let likeness = 0;
    for (let i = 0; i < word.length; i++) {
      if (word[i] === SECRET_PASSWORD[i]) {
        likeness++;
      }
    }
    return likeness;
  };

  const handleWordGuess = (word) => {
    playClick();
    if (gameWon || gameLost) return;

    if (word === SECRET_PASSWORD) {
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
        setLogs([...logs, `> ${word}`, `> ERROR: LINK EXP_FACTOR: LIKENESS=${likeness}/${SECRET_PASSWORD.length}`]);
      }
    }
  };

  const resetHackingGame = () => {
    playClick();
    setAttempts(4);
    setLogs(["ENTER AUTHORIZATION CREDENTIALS..."]);
    setGameWon(false);
    setGameLost(false);
  };

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) {
        clearInterval(interval);
        setTimeout(() => setBooting(false), 1000); 
      }
    }, 40);
    return () => clearInterval(interval);
  }, []);

  if (booting) {
    return (
      <div className="terminal-boot">
        <pre>{text}</pre>
        <div className="cursor"></div>
      </div>
    );
  }

  return (
    <div className="pip-interface">
      <nav className="tabs">
        <button onClick={() => handleTabChange("HOME")}>HOME</button>
        <button onClick={() => handleTabChange("STAT")}>STAT</button>
        <button onClick={() => handleTabChange("DATA")}>DATA</button>
        <button onClick={() => handleTabChange("INV")}>INV</button>
        <button onClick={() => handleTabChange("MAP")}>MAP</button>
        <button onClick={() => handleTabChange("RADIO")}>RADIO</button>
      </nav>
      
      <main className="screen-content">
        {activeTab === "HOME" && (
          <div className="home-container">
            <div className="profile-header">
              <p>STATUS: ONLINE</p>
              <p>SYSTEM: BASIM-OS v2.5</p>
            </div>

            <div className="avatar-display">
              <h3>IT SUPPORT SPECIALIST</h3>
              
              <div className="avatar-frame">
                <img src={vaultBasimImg} alt="Vault Basim" className="vault-boy-img" />
              </div>
              
              <p className="quote-text">
                "SPECIALIZING IN SYSTEM DIAGNOSTICS, NETWORK ARCHITECTURE, AND BUILDING EXCEPTIONAL DIGITAL WASTELAND EXPERIENCES."
              </p>
              <h2 className="user-name">BASIM AHMED ELOSTAZ</h2>
            </div>

            <div className="home-footer">
              <hr />
              <p>&gt; SELECT A TAB TO BEGIN NAVIGATION</p>
            </div>
          </div>
        )}

        {activeTab === "STAT" && (
          <div className="tab-content special-layout">
            <h2>[ S.P.E.C.I.A.L. ATTRIBUTES ]</h2>
            <div className="special-grid">
              <div className="stat-card">
                <div className="stat-row"><span className="stat-name">STRENGTH</span><span className="stat-value">8</span></div>
                <p className="stat-desc">Heavy punching bag routines active. Equipped with boxing glove mastery (+5 Melee Modifier).</p>
              </div>
              <div className="stat-card">
                <div className="stat-row"><span className="stat-name">PERCEPTION</span><span className="stat-value">7</span></div>
                <p className="stat-desc">Exceptional system log scanning and deep ticket troubleshooting instincts. Spotting network anomalies instantly.</p>
              </div>
              <div className="stat-card">
                <div className="stat-row"><span className="stat-name">ENDURANCE</span><span className="stat-value">6</span></div>
                <p className="stat-desc">Frame build: 6'0" // 225 lbs. High stamina calibration via rope jumping and conditioning drills.</p>
              </div>
              <div className="stat-card">
                <div className="stat-row"><span className="stat-name">CHARISMA</span><span className="stat-value">7</span></div>
                <p className="stat-desc">User-support tier empathy. Capable of translating complex network jargon into safe corporate-speak under fire.</p>
              </div>
              <div className="stat-card">
                <div className="stat-row"><span className="stat-name">INTELLIGENCE</span><span className="stat-value">9</span></div>
                <p className="stat-desc">Dual-certified (CompTIA A+ & Google IT Support). High processing speeds fueled by active academic tracks.</p>
              </div>
              <div className="stat-card">
                <div className="stat-row"><span className="stat-name">AGILITY</span><span className="stat-value">8</span></div>
                <p className="stat-desc">High precision rendering. Smooth execution loops while manipulating complex 3D low-poly meshes or refining fine pixel art frames.</p>
              </div>
              <div className="stat-card">
                <div className="stat-row"><span className="stat-name">LUCK</span><span className="stat-value">9</span></div>
                <p className="stat-desc">Saltwater angling perk active. Grants a permanent critical multiplier bonus when near coastlines or piers.</p>
              </div>
            </div>
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
                  <p>[ ONGOING ] IT DEGREE - UNIVERSITY OF PHOENIX</p>
                </div>
                <div className="executable-container">
                  <hr className="dashed-hr" />
                  <p className="blink-text">&gt; SYSTEM THREAT DETECTED: UNLINKED ENCRYPTION</p>
                  <button className="exec-btn" onClick={() => { playClick(); setInGame(true); }}>
                    RUN CODESEC.EXE (ROUTING ENCRYPTION INTERACTION)
                  </button>
                </div>
              </div>
            ) : (
              <div className="hacking-game-container">
                <h2>ROUTING OVERRIDE IN PROGRESS: CODESEC.EXE</h2>
                <p className="attempts-indicator">
                  {attempts} ATTEMPT(S) REMAINING: {"█ ".repeat(attempts)}
                </p>

                <div className="hacking-grid">
                  <div className="hex-word-column">
                    <p className="dim-text">0xF42C  _#$%^!!*</p>
                    <p className="dim-text">0xF438  []=--+_\</p>
                    {WORD_LIST.map((word, idx) => (
                      <button 
                        key={idx} 
                        className={`word-guess-btn ${gameWon || gameLost ? 'disabled' : ''}`}
                        onClick={() => handleWordGuess(word)}
                        disabled={gameWon || gameLost}
                      >
                        0x{ (62508 + idx * 12).toString(16).toUpperCase() } {word}
                      </button>
                    ))}
                    <p className="dim-text">0xF51A  {}|:*&lt;&gt;?</p>
                  </div>

                  <div className="hacking-logs">
                    <h3>DIAGNOSTIC STATUS OUTPUT:</h3>
                    <div className="log-scroll-box">
                      {logs.map((log, idx) => (
                        <p key={idx} className="log-line">{log}</p>
                      ))}
                    </div>
                    {(gameWon || gameLost) && (
                      <button className="exec-btn reset-btn" onClick={resetHackingGame}>
                        REBOOT FIREWALL COMPILER
                      </button>
                    )}
                  </div>
                </div>
                
                <button className="back-link-btn" onClick={() => { playClick(); setInGame(false); }}>
                  &lt; TERMINATE PROCESS AND RETURN TO LOGS
                </button>
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
              <div className="map-radar">
                <div className="radar-circle"></div>
                <div className="radar-ping"></div>
              </div>
              <p>CURRENT SECTOR: SUGAR LAND, TX</p>
              <p>REGION: HOUSTON WASTELAND AREA</p>
              <p>FACTION: UNIVERSITY OF PHOENIX (IT SECTOR)</p>
            </div>
          </div>
        )}

        {activeTab === "RADIO" && (
          <div className="tab-content radio-signals">
            <h2>[ ENCRYPTED SIGNAL FREQUENCIES ]</h2>
            <p>TUNING INTO BROADCAST... CONTACT CHANNELS AVAILABLE:</p>
            <ul className="radio-list">
              <li>📡 <a href="mailto:basimelostaz@gmail.com" onClick={playClick} target="_blank" rel="noreferrer">EMAIL: BASIMELOSTAZ@GMAIL.COM</a></li>
              <li>🌐 <a href="https://www.linkedin.com/in/basim-elostaz/" onClick={playClick} target="_blank" rel="noreferrer">LINKEDIN // SECURE_COMMS_01</a></li>
              <li>💻 <a href="https://github.com/Basimelostaz" onClick={playClick} target="_blank" rel="noreferrer">GITHUB // SOURCE_VAULT</a></li>
            </ul>
            <div className="radio-chatter">
              <p className="dim-text">BACKGROUND NOISE: *AM METEOROLOGICAL DATA STATIC INTERMITTENT*</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App