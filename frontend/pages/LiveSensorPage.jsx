import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const LiveSensorPage = () => {
  const [hallValue, setHallValue] = useState(null);
  const [socket, setSocket] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ws = new WebSocket('ws://192.168.29.196:8080'); // WebSocket for live data

    ws.onopen = () => {
      console.log('Connected to WebSocket server');
      setError(null);
    };

    ws.onmessage = async (event) => {
      try {
        const data = event.data instanceof Blob ? await event.data.text() : event.data;
        setHallValue(data);
      } catch (err) {
        console.error('Error processing message:', err);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('Failed to connect to the server. Please try again later.');
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setError('Connection to the server was closed.');
    };

    setSocket(ws);

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={styles.container}
    >
      <h1 style={styles.title}>ESP32 Hall Effect Sensor</h1>
      {error && <p style={styles.error}>{error}</p>}
      <div style={styles.sensorBox}>
        <h2 style={styles.sensorLabel}>Live Sensor Reading:</h2>
        <motion.p
          style={styles.sensorValue}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {hallValue !== null ? hallValue : 'Waiting for data...'}
        </motion.p>
      </div>
    </motion.div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1, // Fill the available space
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '16px',
    color: '#333',
  },
  sensorBox: {
    marginTop: '16px',
    width: '100%',
    maxWidth: '400px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  sensorLabel: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#555',
  },
  sensorValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#007bff',
    marginTop: '8px',
  },
  error: {
    color: 'red',
    fontSize: '16px',
    marginBottom: '16px',
  },
};

export default LiveSensorPage;
