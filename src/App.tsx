import { useState } from 'react';
import PhoneFrame from './components/PhoneFrame';
import BottomNav from './components/BottomNav';
import ReportProblemModal from './components/ReportProblemModal';
import Splash from './pages/Splash';
import Dashboard from './pages/Dashboard';
import Traps from './pages/Traps';
import TrapDetail from './pages/TrapDetail';
import Alerts from './pages/Alerts';
import Profile from './pages/Profile';
import AddTrapForm from './pages/AddTrapForm';
import { farmer as mockFarmer, traps as initialTraps, alerts as initialAlerts } from './data/mock';
import type { Trap, Alert, Farmer } from './types';

type Screen = 'splash' | 'home' | 'traps' | 'trapDetail' | 'alerts' | 'profile' | 'addTrap';

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [selectedTrap, setSelectedTrap] = useState<Trap | null>(null);
  const [currentTab, setCurrentTab] = useState('home');
  const [traps, setTraps] = useState<Trap[]>(initialTraps);
  const [alerts] = useState<Alert[]>(initialAlerts);
  const [farmer, setFarmer] = useState<Farmer>(mockFarmer);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportTrapName, setReportTrapName] = useState('');

  const unreadAlerts = alerts.filter(a => !a.read).length;

  const handleEnter = (name?: string, farmName?: string) => {
    if (name) {
      setFarmer((prev) => ({ ...prev, name, farmName: farmName || prev.farmName }));
    }
    setScreen('home');
    setCurrentTab('home');
  };

  const handleLogout = () => {
    setScreen('splash');
    setCurrentTab('home');
    setSelectedTrap(null);
  };

  const handleNav = (tab: string) => {
    setCurrentTab(tab);
    switch (tab) {
      case 'home':
        setScreen('home');
        break;
      case 'traps':
        setScreen('traps');
        setSelectedTrap(null);
        break;
      case 'alerts':
        setScreen('alerts');
        break;
      case 'profile':
        setScreen('profile');
        break;
    }
  };

  const handleViewTrapDetail = (trap: Trap) => {
    setSelectedTrap(trap);
    setScreen('trapDetail');
  };

  const handleBackFromDetail = () => {
    setScreen('traps');
    setCurrentTab('traps');
  };

  const handleAddTrap = (newTrap: Trap) => {
    setTraps((prev) => [...prev, newTrap]);
  };

  const handleOpenAddTrap = () => {
    setScreen('addTrap');
  };

  const handleBackFromAddTrap = () => {
    setScreen('traps');
    setCurrentTab('traps');
  };

  const handleOpenReportProblem = (trapName: string) => {
    setReportTrapName(trapName);
    setReportModalOpen(true);
  };

  const showNav = screen !== 'splash' && screen !== 'trapDetail' && screen !== 'addTrap';
  const activeTrap = selectedTrap ? traps.find((t) => t.id === selectedTrap.id) || selectedTrap : null;

  return (
    <PhoneFrame>
      {/* Screens */}
      {screen === 'splash' && <Splash onEnter={handleEnter} />}

      {screen === 'home' && (
        <Dashboard
          farmerName={farmer.name}
          traps={traps}
          unreadAlerts={unreadAlerts}
          onViewTraps={() => handleNav('traps')}
          onViewAlerts={() => handleNav('alerts')}
        />
      )}

      {screen === 'traps' && (
        <Traps
          traps={traps}
          onViewTrapDetail={handleViewTrapDetail}
          onAddTrap={handleOpenAddTrap}
        />
      )}

      {screen === 'trapDetail' && activeTrap && (
        <TrapDetail
          trap={activeTrap}
          onBack={handleBackFromDetail}
          onReportProblem={handleOpenReportProblem}
        />
      )}

      {screen === 'alerts' && (
        <Alerts
          alerts={alerts}
          showBack={false}
        />
      )}

      {screen === 'profile' && (
        <Profile
          farmer={farmer}
          onLogout={handleLogout}
        />
      )}

      {screen === 'addTrap' && (
        <AddTrapForm
          onBack={handleBackFromAddTrap}
          onAddTrap={handleAddTrap}
        />
      )}

      {/* Report Problem Modal */}
      {reportModalOpen && (
        <ReportProblemModal
          trapName={reportTrapName}
          onClose={() => setReportModalOpen(false)}
        />
      )}

      {/* Bottom Navigation */}
      {showNav && (
        <BottomNav
          current={currentTab}
          onNavigate={handleNav}
        />
      )}
    </PhoneFrame>
  );
}
