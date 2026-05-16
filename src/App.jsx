import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [booting, setBooting] = useState(true);
  const [activeTab, setActiveTab] = useState("HOME");
  const [text, setText] = useState("");
  
  const fullText = "INITIALIZING BASIM-OS v2.5...\nCHECKING SYSTEM INTEGRITY... OK\nLOADING PERSONAL DATA TERMINAL...\nWELCOME, BASIM AHMED ELOSTAZ.";

  // Function to play the terminal button sound
  const playClick = () => {
    const audio = new Audio('/click.mp3');
    audio.volume = 0.4; // Keeps it from being too loud
    audio.play().catch(err => console.log("Audio playback blocked until user interaction."));
  };

  // Wrapper to handle tab changes and sound effects at once
  const handleTabChange = (tabName) => {
    playClick();
    setActiveTab(tabName);
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
                <img src="/src/assets/vault-basim.png" alt="Vault Basim" className="vault-boy-img" />
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
          <div className="tab-content">
            <h2>[ S.P.E.C.I.A.L. ]</h2>
            <p>STRENGTH: 8 (BOXING TRAINED)</p>
            <p>PERCEPTION: 7 (IT TROUBLESHOOTING)</p>
            <p>ENDURANCE: 6 (6'0" // 225 LBS)</p>
            <p>LUCK: 9 (FISHING BONUS ACTIVE)</p>
          </div>
        )}

        {activeTab === "DATA" && (
          <div className="tab-content">
            <h2>QUEST LOG</h2>
            <p>[ ACTIVE ] IT SUPPORT INTERN - ERICKSON SENIOR LIVING</p>
            <p>[ COMPLETE ] COMPTIA A+ CERTIFICATION</p>
            <p>[ COMPLETE ] GOOGLE IT SUPPORT CERTIFICATE</p>
            <p>[ ONGOING ] IT DEGREE - UNIVERSITY OF PHOENIX</p>
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