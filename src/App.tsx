import { useState, useEffect, useCallback } from 'react';
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
import Simulator from './pages/Simulator';
import { hasToken, clearToken, getMe, getTraps, getTrap, getAlerts } from './services/api';
import type { Trap, Alert, Farmer } from './types';

type Screen = 'splash' | 'home' | 'traps' | 'trapDetail' | 'alerts' | 'profile' | 'addTrap' | 'simulator';

const emptyFarmer: Farmer = {
  name: '',
  farmName: '',
  municipality: '',
  department: '',
  hectares: 0,
  cooperative: null,
  activeTraps: 0,
  totalTraps: 0,
};

export default function App() {
  // Check if URL is /simulator
  const isSimulator = window.location.pathname === '/simulator';
  
  const [screen, setScreen] = useState<Screen>(
    isSimulator ? 'simulator' : (hasToken() ? 'home' : 'splash')
  );
  const [selectedTrap, setSelectedTrap] = useState<Trap | null>(null);
  const [currentTab, setCurrentTab] = useState('home');
  const [traps, setTraps] = useState<Trap[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [farmer, setFarmer] = useState<Farmer>(emptyFarmer);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportTrapName, setReportTrapName] = useState('');
  const [reportTrapId, setReportTrapId] = useState('');
  const [loading, setLoading] = useState(false);

  const unreadAlerts = alerts.filter(a => !a.read).length;

  // Load all data from API
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [farmerData, trapsData, alertsData] = await Promise.all([
        getMe(),
        getTraps(),
        getAlerts(),
      ]);

      setFarmer({
        name: farmerData.name,
        farmName: farmerData.farmName,
        municipality: farmerData.municipality || '',
        department: farmerData.department || '',
        hectares: farmerData.hectares || 0,
        cooperative: farmerData.cooperative || null,
        activeTraps: farmerData.activeTraps || 0,
        totalTraps: farmerData.totalTraps || 0,
      });

      // Map backend traps to frontend Trap type
      setTraps(
        trapsData.map((t: any) => ({
          id: t._id,
          name: t.name,
          location: t.location,
          status: t.status,
          batteryLevel: t.batteryLevel,
          lastDetection: t.lastDetection,
          connectivity: t.connectivity,
          weeklyActivity: t.weeklyActivity || [0, 0, 0, 0, 0, 0, 0],
          lastAlerts: [], // loaded on detail
        }))
      );

      setAlerts(
        alertsData.map((a: any) => ({
          id: a._id,
          trapId: a.trapId,
          trapName: a.trapName,
          date: a.date,
          time: a.time,
          level: a.level,
          message: a.message,
          read: a.read,
        }))
      );
      
      // Only set screen to home if we're coming from splash
      if (screen === 'splash') {
        setScreen('home');
      }
    } catch (err) {
      console.error('Error loading data:', err);
      // If unauthorized, go to splash
      clearToken();
      setScreen('splash');
    } finally {
      setLoading(false);
    }
  }, [screen]);

  // Auto-load data if token exists
  useEffect(() => {
    if (hasToken() && screen === 'splash' && !isSimulator) {
      loadData();
    }
  }, [loadData, screen, isSimulator]);

  const handleEnter = async () => {
    // Called after successful login/register in Splash
    await loadData();
    setScreen('home');
    setCurrentTab('home');
  };

  const handleLogout = () => {
    clearToken();
    setFarmer(emptyFarmer);
    setTraps([]);
    setAlerts([]);
    setScreen('splash');
    setCurrentTab('home');
    setSelectedTrap(null);
  };

  const handleNav = (tab: string) => {
    setCurrentTab(tab);
    switch (tab) {
      case 'home':
        setScreen('home');
        loadData(); // refresh
        break;
      case 'traps':
        setScreen('traps');
        setSelectedTrap(null);
        break;
      case 'alerts':
        setScreen('alerts');
        loadData(); // refresh alerts
        break;
      case 'profile':
        setScreen('profile');
        break;
    }
  };

  const handleViewTrapDetail = async (trap: Trap) => {
    try {
      const detail = await getTrap(trap.id);
      const fullTrap: Trap = {
        id: detail._id,
        name: detail.name,
        location: detail.location,
        status: detail.status,
        batteryLevel: detail.batteryLevel,
        lastDetection: detail.lastDetection,
        connectivity: detail.connectivity,
        weeklyActivity: detail.weeklyActivity || [0, 0, 0, 0, 0, 0, 0],
        lastAlerts: (detail.lastAlerts || []).map((a: any) => ({
          id: a._id,
          trapId: a.trapId,
          trapName: a.trapName,
          date: a.date,
          time: a.time,
          level: a.level,
          message: a.message,
          read: a.read,
        })),
      };
      setSelectedTrap(fullTrap);
      setScreen('trapDetail');
    } catch (err) {
      console.error('Error loading trap detail:', err);
    }
  };

  const handleBackFromDetail = () => {
    setScreen('traps');
    setCurrentTab('traps');
  };

  const handleAddTrap = async () => {
    // Called after AddTrapForm successfully creates via API
    // Refresh traps list and navigate back
    await loadData();
    setScreen('traps');
    setCurrentTab('traps');
  };

  const handleOpenAddTrap = () => {
    setScreen('addTrap');
  };

  const handleBackFromAddTrap = () => {
    setScreen('traps');
    setCurrentTab('traps');
  };

  const handleOpenReportProblem = (trapName: string, trapId?: string) => {
    setReportTrapName(trapName);
    setReportTrapId(trapId || '');
    setReportModalOpen(true);
  };

  const showNav = screen !== 'splash' && screen !== 'trapDetail' && screen !== 'addTrap' && screen !== 'simulator';
  const activeTrap = selectedTrap;

  // Simulator screen (full screen, no frame)
  if (screen === 'simulator') {
    return <Simulator />;
  }

  if (loading && screen === 'splash') {
    return (
      <PhoneFrame>
        <div className="flex-1 flex items-center justify-center bg-cg-cream">
          <div className="animate-pulse text-cg-medium font-bold text-lg">Cargando...</div>
        </div>
      </PhoneFrame>
    );
  }

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
          onReportProblem={(name) => handleOpenReportProblem(name, activeTrap.id)}
        />
      )}

      {screen === 'alerts' && (
        <Alerts
          alerts={alerts}
          showBack={false}
          onAlertRead={loadData}
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
          trapId={reportTrapId}
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
