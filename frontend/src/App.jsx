import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LiveSensorPage from '../pages/LiveSensorPage'; // Make sure to adjust the import path
import HistoryPage from '../pages/HistoryPage'; // Adjust path as needed
import { ThemeProvider } from '../context/ThemeContext';

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <div style={styles.appContainer}>
          {/* Navigation Bar */}
          <nav style={styles.nav}>
            <Link to="/" style={styles.navLink}>
              Live Sensor
            </Link>
            <Link to="/history" style={styles.navLink}>
              History
            </Link>
          </nav>

          {/* Main Content Routes */}
          <div style={styles.contentContainer}>
            <Routes>
              <Route path="/" element={<LiveSensorPage />} />
              <Route path="/history" element={<HistoryPage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
};

const styles = {
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh', // Full viewport height
    justifyContent: 'flex-start', // Place nav at top, content below
    overflow: 'hidden', // Prevent overflow on the root container
  },
  nav: {
    display: 'flex',
    justifyContent: 'center',
    padding: '20px',
    backgroundColor: '#007bff',
  },
  navLink: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '18px',
    margin: '0 15px',
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1, // Ensure content takes the remaining space
    overflowY: 'auto', // Allow content to scroll if it's too tall
    padding: '20px',
    backgroundColor: '#f9f9f9', // Light background for contrast
  },
};

export default App;
