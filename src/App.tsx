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
import { Tv } from './pages/app/Tv';
import { ClientStream } from './pages/app/ClientStream';
import { Tournament } from './pages/app/Tournament';
import { TeamForm } from './pages/app/TeamForm';
import { ScoreBoardRender } from './pages/app/ScoreBoardRender';
import { TvRender } from './pages/app/TvRender';
import { TvHlsRender } from './pages/app/TvHlsRender';
import { BowringArena } from './pages/app/bowringArena';
import { KsbaArena } from './pages/app/ksbaArena';
import { VideoOverlay } from './pages/app/videoOverlay';
import { PortraitOverlay } from './pages/app/portraitOverlay';
import { LiveScoring } from './pages/app/liveScoring';
import { Commentary } from './pages/app/Commentary';
import { BowringArena3412 } from './pages/app/bowringArena3412';
import { HbccTvArena } from './pages/app/hbccTvArena';

const App: React.FC = () => {
  const token = getToken();
  return (
    <Router>
      <Toaster />
      <Routes>
        <Route path="/" element={token ? <Navigate to="/app/home" /> : <Navigate to="/login" />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/app/home" element={<Home />} />
          <Route path="/app/snooker" element={<SnookerScoring />} />
          <Route path="/app/billiards" element={<BilliardsScoring />} />
          <Route path="/app/scoreboard" element={<ScoreBoard />} />
          <Route path="/app/tv" element={<Tv />} />
          <Route path="/app/tournament" element={<Tournament />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/app/stream" element={<ClientStream />} />
        <Route path="/app/team-form" element={<TeamForm />} />
        <Route path="/app/scoreboard-render" element={<ScoreBoardRender />} />
        <Route path="/app/tv-render" element={<TvRender />} />
        <Route path="/app/tv-hls-render" element={<TvHlsRender />} />
        <Route path="/app/bowring-render" element={<BowringArena />} />
        <Route path="/app/ksba-render" element={<KsbaArena />} />
        <Route path="/app/bowring-3412" element={<BowringArena3412   />} />
        <Route path="/app/video-overlay" element={<VideoOverlay />} />
        <Route path="/app/portrait-overlay" element={<PortraitOverlay />} />
        <Route path="/app/live-scoring" element={<LiveScoring />} />
        <Route path="/app/commentary" element={<Commentary />} />
        <Route path="/app/hbcc-tv-arena" element={<HbccTvArena />} />
      </Routes>
    </Router>
  );
};

export default App;
