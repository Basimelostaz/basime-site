import React, { useState, useRef } from 'react';

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

  const handleTransmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { sender: 'HUMAN', text: userText }]);
    setLoading(true);

    try {
      const res = await fetch('https://gorg-backend.onrender.com/api/ask-gorg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, mode: renderMode })
      });

      if (!res.ok) throw new Error('Uplink failed');

      const data = await res.json();
      setMessages(prev => [...prev, { sender: 'GORG', text: data.reply }]);

      if (data.mode === 'video') {
        setVideoUrl(data.video_url);
      } else if (data.mode === 'gif' && data.audio_url) {
        setVideoUrl(null);
        setIsSpeaking(true);
        if (audioRef.current) {
          audioRef.current.src = data.audio_url;
          audioRef.current.play();
          audioRef.current.onended = () => setIsSpeaking(false);
        }
      }
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'SYSTEM', text: 'ERROR: Terminal uplink failed.' }]);
      setIsSpeaking(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '16px', color: '#00ff66', fontFamily: 'monospace' }}>
      {/* Hidden audio element for GIF mode playback */}
      <audio ref={audioRef} style={{ display: 'none' }} />

      {/* Visual Display Container */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        {videoUrl ? (
          <video
            src={videoUrl}
            autoPlay
            controls
            style={{ width: '280px', height: '280px', border: '2px solid #00ff66', objectFit: 'cover' }}
          />
        ) : (
          <img
            src={isSpeaking ? '/gorg_talking.gif' : '/super_mutant.png'}
            alt="Gorg"
            style={{ width: '280px', height: '280px', border: '2px solid #00ff66', objectFit: 'cover' }}
          />
        )}
      </div>

      {/* Mode Selector Toggle */}
      <div style={{ marginBottom: '12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
        <span>VISUAL FEED:</span>
        <button
          type="button"
          onClick={() => setRenderMode('gif')}
          style={{
            background: renderMode === 'gif' ? '#00ff66' : 'transparent',
            color: renderMode === 'gif' ? '#000' : '#00ff66',
            border: '1px solid #00ff66',
            cursor: 'pointer',
            padding: '4px 8px'
          }}
        >
          FAST (GIF)
        </button>
        <button
          type="button"
          onClick={() => setRenderMode('video')}
          style={{
            background: renderMode === 'video' ? '#00ff66' : 'transparent',
            color: renderMode === 'video' ? '#000' : '#00ff66',
            border: '1px solid #00ff66',
            cursor: 'pointer',
            padding: '4px 8px'
          }}
        >
          AI VIDEO (HQ)
        </button>
      </div>

      {/* Terminal Log */}
      <div style={{ height: '180px', overflowY: 'auto', border: '1px solid #00ff66', padding: '8px', marginBottom: '12px' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: '6px' }}>
            <strong>[{m.sender}]:</strong> {m.text}
          </div>
        ))}
        {loading && <div>[SYSTEM]: {renderMode === 'video' ? 'GENERATING VIDEO FEED...' : 'TRANSMITTING VOICE...'}</div>}
      </div>

      {/* Input Form */}
      <form onSubmit={handleTransmit} style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Speak to Gorg..."
          style={{ flex: 1, background: '#000', color: '#00ff66', border: '1px solid #00ff66', padding: '6px' }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{ background: '#00ff66', color: '#000', border: 'none', padding: '6px 16px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          TRANSMIT
        </button>
      </form>
    </div>
  );
}