import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Overview } from './pages/Overview';
import { SessionDetail } from './pages/SessionDetail';
import { Sessions } from './pages/Sessions';
import { Evaluations } from './pages/Evaluations';
import { Telemetry } from './pages/Telemetry';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/overview" element={<Overview />} />
        <Route path="/sessions" element={<Sessions />} />
        <Route path="/session/:id" element={<SessionDetail />} />
        <Route path="/evaluations" element={<Evaluations />} />
        <Route path="/telemetry" element={<Telemetry />} />
        <Route path="/" element={<Navigate to="/overview" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
