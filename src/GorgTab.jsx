import React, { useState, useRef, useEffect } from 'react';

export default function GorgTab() {
  const [messages, setMessages] = useState([
    { sender: 'GORG', text: 'WHAT DO YOU WANT, PUNY HUMAN? SPEAK BEFORE I SMASH THIS TERMINAL!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [renderMode, setRenderMode] = useState('gif'); // 'gif' or 'video'
  const [videoUrl, setVideoUrl] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const audioRef = useRef(null);
  const terminalBottomRef = useRef(null);

  // Preload talking GIF in browser cache on component mount
  useEffect(() => {
    const img = new Image();
    img.src = '/gorg_talking.gif';
  }, []);

  // Auto-scroll terminal log to bottom on new messages
  useEffect(() => {
    if (terminalBottomRef.current) {
      terminalBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const handleTransmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input;
    setInput('');
    setMessages((prev) => [...prev, { sender: 'HUMAN', text: userText }]);
    setLoading(true);

    try {
      const res = await fetch('https://gorg-backend.onrender.com/api/ask-gorg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userText, 
          mode: renderMode 
        })
      });

      if (!res.ok) throw new Error('Uplink failed');

      const data = await res.json();
      setMessages((prev) => [...prev, { sender: 'GORG', text: data.reply }]);

      if (data.mode === 'video') {
        setVideoUrl(data.video_url);
        setIsSpeaking(false);
      } else if (data.mode === 'gif' && data.audio_url) {
        setVideoUrl(null);
        setIsSpeaking(true);
        if (audioRef.current) {
          audioRef.current.src = data.audio_url;
          audioRef.current.play().catch((err) => console.error("Playback error:", err));
          audioRef.current.onended = () => setIsSpeaking(false);
        }
      }
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'SYSTEM', text: 'ERROR: Terminal uplink failed.' }]);
      setIsSpeaking(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '16px', color: '#00ff66', fontFamily: 'monospace' }}>
      {/* Hidden audio element for GIF voice playback */}
      <audio ref={audioRef} style={{ display: 'none' }} />

      {/* Visual Display Screen */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        {videoUrl ? (
          <video
            src={videoUrl}
            autoPlay
            controls
            style={{ 
              width: '280px', 
              height: '280px', 
              border: '2px solid #00ff66', 
              objectFit: 'cover',
              background: '#000'
            }}
          />
        ) : (
          <div 
            style={{ 
              width: '280px', 
              height: '280px', 
              margin: '0 auto', 
              border: '2px solid #00ff66', 
              position: 'relative',
              background: '#000',
              overflow: 'hidden'
            }}
          >
            <img
              src="/super_mutant.png"
              alt="Gorg Idle"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: isSpeaking ? 'none' : 'block'
              }}
            />
            <img
              src="/gorg_talking.gif"
              alt="Gorg Speaking"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: isSpeaking ? 'block' : 'none'
              }}
            />
          </div>
        )}
      </div>

      {/* Mode Selector Toggle */}
      <div style={{ marginBottom: '12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', letterSpacing: '1px' }}>FEED MODE:</span>
        <button
          type="button"
          onClick={() => {
            setRenderMode('gif');
            setVideoUrl(null);
          }}
          style={{
            background: renderMode === 'gif' ? '#00ff66' : 'transparent',
            color: renderMode === 'gif' ? '#000' : '#00ff66',
            border: '1px solid #00ff66',
            cursor: 'pointer',
            padding: '4px 10px',
            fontWeight: 'bold',
            fontFamily: 'monospace'
          }}
        >
          ⚡ FAST (GIF)
        </button>
        <button
          type="button"
          onClick={() => setRenderMode('video')}
          style={{
            background: renderMode === 'video' ? '#00ff66' : 'transparent',
            color: renderMode === 'video' ? '#000' : '#00ff66',
            border: '1px solid #00ff66',
            cursor: 'pointer',
            padding: '4px 10px',
            fontWeight: 'bold',
            fontFamily: 'monospace'
          }}
        >
          🎬 AI VIDEO (HQ)
        </button>
      </div>

      {/* Terminal Log */}
      <div 
        style={{ 
          height: '180px', 
          overflowY: 'auto', 
          border: '1px solid #00ff66', 
          padding: '8px', 
          marginBottom: '12px',
          background: 'rgba(0, 20, 0, 0.4)'
        }}
      >
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: '6px', lineHeight: '1.4' }}>
            <strong style={{ color: m.sender === 'GORG' ? '#00ff66' : m.sender === 'HUMAN' ? '#ffffff' : '#ff3333' }}>
              [{m.sender}]:
            </strong>{' '}
            <span>{m.text}</span>
          </div>
        ))}
        {loading && (
          <div style={{ color: '#88ff88', fontStyle: 'italic' }}>
            [SYSTEM]: {renderMode === 'video' ? 'GENERATING VIDEO FEED...' : 'TRANSMITTING VOICE...'}
          </div>
        )}
        <div ref={terminalBottomRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleTransmit} style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Speak to Gorg..."
          disabled={loading}
          style={{ 
            flex: 1, 
            background: '#000', 
            color: '#00ff66', 
            border: '1px solid #00ff66', 
            padding: '8px',
            fontFamily: 'monospace',
            outline: 'none'
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{ 
            background: '#00ff66', 
            color: '#000', 
            border: 'none', 
            padding: '8px 18px', 
            fontWeight: 'bold', 
            fontFamily: 'monospace',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          TRANSMIT
        </button>
      </form>
    </div>
  );
}