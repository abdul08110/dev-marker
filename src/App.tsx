import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import { getToken } from './utils/auth';
import { Toaster } from './components/ui/toaster';
import ProtectedRoute from './components/common/protectedRoute';
import { Home } from './pages/app/Home';
import { SnookerScoring } from './pages/app/SnookerScoring';
import { ScoreBoard } from './pages/app/ScoreBoard';
import { BilliardsScoring } from './pages/app/billiardsScoring';


const App: React.FC = () => {
  const token = getToken();
  return (
    <Router>
      <Toaster />
      <Routes>
        <Route
          path="/"
          element={token ? <Navigate to="/app/home" /> : <Navigate to="/login" />}
        />
        <Route element={<ProtectedRoute />}>
          <Route path="/app/home" element={<Home />} />
          <Route path="/app/snooker" element={<SnookerScoring />} />
          <Route path="/app/billiards" element={<BilliardsScoring />} />
          <Route path="/app/scoreboard" element={<ScoreBoard />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;