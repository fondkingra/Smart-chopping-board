import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import LineChart from '../components/LineChart';

const HistoryPage = () => {
  const [hallValues, setHallValues] = useState([]);
  const [socket, setSocket] = useState(null);
  const [error, setError] = useState(null);
  const [downloadFormat, setDownloadFormat] = useState('PDF'); // Default format

  useEffect(() => {
    const ws = new WebSocket('ws://192.168.29.196:8080');

    ws.onopen = () => {
      console.log('Connected to WebSocket server');
      setError(null);
    };

    ws.onmessage = async (event) => {
      try {
        const data = event.data instanceof Blob ? await event.data.text() : event.data;
        setHallValues((prevValues) => [...prevValues, data]);
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

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Hall Effect Sensor History', 10, 10);
    hallValues.forEach((value, index) => {
      doc.text(`${index + 1}. ${value}`, 10, 20 + index * 10);
    });
    doc.save('hall_effect_history.pdf');
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      hallValues.map((value, index) => ({ '#': index + 1, Value: value }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'History');
    XLSX.writeFile(workbook, 'hall_effect_history.xlsx');
  };

  const downloadCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      hallValues.map((value, index) => `${index + 1},${value}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'hall_effect_history.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownload = () => {
    switch (downloadFormat) {
      case 'PDF':
        downloadPDF();
        break;
      case 'Excel':
        downloadExcel();
        break;
      case 'CSV':
        downloadCSV();
        break;
      default:
        alert('Please select a valid download format.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={styles.container}
    >
      <h1 style={styles.title}>Sensor History</h1>
      {error && <p style={styles.error}>{error}</p>}
      <div style={styles.downloadSection}>
        <select
          value={downloadFormat}
          onChange={(e) => setDownloadFormat(e.target.value)}
          style={styles.select}
        >
          <option value="PDF">PDF</option>
          <option value="Excel">Excel</option>
          <option value="CSV">CSV</option>
        </select>
        <button style={styles.downloadButton} onClick={handleDownload}>
          Download History
        </button>
      </div>
      <div style={styles.chartContainer}>
        <LineChart data={hallValues} />
      </div>
      <div style={styles.historyBox}>
        <h2 style={styles.historyLabel}>Sensor Readings:</h2>
        <AnimatePresence>
          {hallValues.map((value, index) => (
            <motion.div
              key={index}
              style={styles.historyItem}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
            >
              <p style={styles.historyValue}>{value}</p>
            </motion.div>
          ))}
        </AnimatePresence>
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
    flex: 1,
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
  downloadSection: {
    display: 'flex',
    gap: '10px',
    marginBottom: '16px',
  },
  select: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  downloadButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s',
  },
  chartContainer: {
    width: '100%',
    maxWidth: '800px',
    margin: '20px 0',
  },
  historyBox: {
    marginTop: '16px',
    width: '100%',
    maxWidth: '400px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  historyLabel: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#555',
  },
  historyItem: {
    margin: '8px 0',
    padding: '8px',
    backgroundColor: '#f0f0f0',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  historyValue: {
    fontSize: '16px',
    color: '#333',
  },
  error: {
    color: 'red',
    fontSize: '16px',
    marginBottom: '16px',
  },
};

export default HistoryPage;