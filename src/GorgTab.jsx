import React, { useState } from 'react';

export default function GorgTab() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [chatLog, setChatLog] = useState([
    { sender: 'GORG', text: 'WHAT DO YOU WANT, PUNY HUMAN? SPEAK BEFORE I SMASH THIS TERMINAL!' }
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput('');
    setChatLog((prev) => [...prev, { sender: 'HUMAN', text: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('https://gorg-backend.onrender.com/api/ask-gorg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) throw new Error('Terminal uplink failed.');

      const data = await response.json();
      setChatLog((prev) => [...prev, { sender: 'GORG', text: data.reply }]);
      setVideoUrl(data.video_url);
    } catch (err) {
      setChatLog((prev) => [
        ...prev,
        { sender: 'SYSTEM', text: `ERROR: ${err.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={{ margin: 0, color: '#39ff14' }}>☢️ ROBCO INDUSTRIES GORG-OS ☢️</h3>
        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#00cc44' }}>
          TACTICAL SUPER MUTANT DIRECT DIALOGUE LINK
        </p>
      </div>

      <div style={styles.screen}>
        {videoUrl && (
          <div style={styles.videoContainer}>
            <video key={videoUrl} controls autoPlay style={styles.video}>
              <source src={videoUrl} type="video/mp4" />
            </video>
          </div>
        )}

        <div style={styles.log}>
          {chatLog.map((msg, i) => (
            <div key={i} style={styles.message}>
              <strong style={{ color: msg.sender === 'GORG' ? '#39ff14' : msg.sender === 'HUMAN' ? '#00ff66' : '#ff4444' }}>
                [{msg.sender}]:
              </strong>{' '}
              <span style={{ color: '#c8ffc8' }}>{msg.text}</span>
            </div>
          ))}
          {loading && (
            <div style={styles.loading}>
              * TRANSMITTING TO WASTELAND... MODULATING MUTANT VOCALS... *
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <span style={styles.prompt}>&gt;</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message to Gorg..."
          style={styles.input}
          disabled={loading}
          autoFocus
        />
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'WAIT' : 'TRANSMIT'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#050c05',
    color: '#39ff14',
    fontFamily: '"Courier New", Courier, monospace',
    padding: '16px',
    borderRadius: '6px',
    border: '1px solid #39ff14',
    boxShadow: '0 0 12px rgba(57, 255, 20, 0.15)',
    maxWidth: '800px',
    margin: '10px auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: '12px',
    borderBottom: '1px solid #1c521c',
    paddingBottom: '8px',
  },
  screen: {
    minHeight: '220px',
    maxHeight: '400px',
    overflowY: 'auto',
    marginBottom: '12px',
    paddingRight: '6px',
  },
  videoContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '12px',
  },
  video: {
    maxWidth: '100%',
    maxHeight: '220px',
    borderRadius: '4px',
    border: '1px solid #39ff14',
  },
  log: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  message: {
    fontSize: '14px',
    lineHeight: '1.4',
  },
  loading: {
    color: '#80ff80',
    fontStyle: 'italic',
    fontSize: '13px',
    marginTop: '6px',
  },
  form: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    borderTop: '1px solid #1c521c',
    paddingTop: '12px',
  },
  prompt: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#39ff14',
  },
  input: {
    flex: 1,
    backgroundColor: '#020602',
    color: '#39ff14',
    border: '1px solid #1c521c',
    borderRadius: '3px',
    padding: '8px 12px',
    fontFamily: 'inherit',
    fontSize: '14px',
    outline: 'none',
  },
  button: {
    backgroundColor: '#0d2b0d',
    color: '#39ff14',
    border: '1px solid #39ff14',
    borderRadius: '3px',
    padding: '8px 16px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '13px',
    fontWeight: 'bold',
  },
};