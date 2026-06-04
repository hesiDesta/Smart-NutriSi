import React, { useState, useCallback } from 'react';
import { useAuth } from './context/AuthContext';
import Onboarding      from './pages/Onboarding';
import Login           from './pages/Login';
import Register        from './pages/Register';
import Personalisasi   from './pages/Personalisasi';
import Home            from './pages/Home';
import LogMakanan      from './pages/LogMakanan';
import Riwayat         from './pages/Riwayat';
import Profile         from './pages/Profile';
import LupaSandi       from './pages/LupaSandi';
import DetailAKG       from './pages/DetailAKG';
import Rekomendasi     from './pages/Rekomendasi';
import EditProfile     from './pages/EditProfile';
import KalenderNotifikasi from './pages/KalenderNotifikasi';
import LoadingErrorDemo, { LoadingScreen } from './pages/LoadingError';

/* Peta tab index bottom nav → halaman */
const NAV_MAP = { 0:'home', 1:'riwayat', 2:'rekomendasi', 3:'profile' };

function App() {
  const { token, user } = useAuth();
  const initialPage = token
    ? (user?.childProfile ? 'home' : 'personalisasi')
    : 'onboarding';
  const [page, setPage]       = useState(initialPage);
  const [loading, setLoading] = useState(false);

  /* Navigasi dengan transisi loading singkat */
  const go = useCallback((target, fast = false) => {
    if (target === page) return;
    if (fast) { setPage(target); return; }
    setLoading(true);
    setTimeout(() => { setPage(target); setLoading(false); }, 700);
  }, [page]);

  const goNav = (i) => go(NAV_MAP[i] ?? 'home', true);

  if (loading) return <LoadingScreen />;

  return (
    <div>
      {page === 'onboarding'   && <Onboarding    onMulai={() => go('login', true)} />}
      {page === 'login'        && <Login          onKeRegister={() => go('register', true)}
                                                  onLupaSandi={() => go('lupaSandi', true)}
                                                  onLoginSuccess={(u) => go(u?.childProfile ? 'home' : 'personalisasi')} />}
      {page === 'register'     && <Register       onKeLogin={() => go('login', true)}
                                                  onDaftar={() => go('personalisasi')} />}
      {page === 'personalisasi'&& <Personalisasi  onSelesai={() => go('home')} />}

      {page === 'home'         && <Home           onLogMakanan={() => go('logMakanan')}
                                                  onDetailAKG={() => go('detailAKG')}
                                                  onRekomendasi={() => go('rekomendasi')}
                                                  onNavigate={goNav} />}

      {page === 'logMakanan'   && <LogMakanan     onBack={() => go('home', true)}
                                                  onNavigate={goNav} />}
      {page === 'riwayat'      && <Riwayat        onBack={() => go('home', true)}
                                                  onNavigate={goNav} />}
      {page === 'profile'      && <Profile        onBack={() => go('home', true)}
                                                  onNavigate={goNav}
                                                  onLogout={() => go('login', true)}
                                                  onEditProfile={() => go('editProfile', true)}
                                                  onKalenderNotifikasi={() => go('kalenderNotifikasi', true)} />}

      {page === 'editProfile'  && <EditProfile    onBack={() => go('profile', true)}
                                                  onNavigate={goNav}
                                                  onSave={() => go('profile', true)} />}
      {page === 'kalenderNotifikasi' && <KalenderNotifikasi onBack={() => go('profile', true)}
                                                  onNavigate={goNav} />}

      {page === 'lupaSandi'    && <LupaSandi      onBack={() => go('login', true)}
                                                  onKeLogin={() => go('login', true)} />}
      {page === 'detailAKG'    && <DetailAKG      onBack={() => go('home', true)}
                                                  onNavigate={goNav} />}
      {page === 'rekomendasi'  && <Rekomendasi    onBack={() => go('home', true)}
                                                  onNavigate={goNav} />}
      {page === 'stateDemo'    && <LoadingErrorDemo onBack={() => go('home', true)} />}
    </div>
  );
}

export default App;
