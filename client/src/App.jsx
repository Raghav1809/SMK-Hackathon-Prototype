import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider, useNotifications } from './context/NotificationContext';
import Header from './components/common/Header';
import BottomNav from './components/common/BottomNav';
import NotificationDrawer from './components/common/NotificationDrawer';

// Pages & Components
import LandingPage from './pages/LandingPage';
import CitizenHome from './pages/CitizenHome';
import EngineerDashboard from './pages/EngineerDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Modals
import ReportingModal from './components/citizen/ReportingModal';
import ReportDetailModal from './components/citizen/ReportDetailModal';
import VerificationModal from './components/citizen/VerificationModal';
import EngineerWorkOrderModal from './components/engineer/EngineerWorkOrderModal';
import BeforeAfterUploadModal from './components/engineer/BeforeAfterUploadModal';

// APIs & Sample Data
import { potholesAPI, analyticsAPI } from './services/api';
import { INITIAL_POTHOLES } from './data/sampleData';

function MainApp() {
  const { user } = useAuth();
  const { addToast } = useNotifications();

  const [showLanding, setShowLanding] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  // Data States
  const [potholes, setPotholes] = useState(INITIAL_POTHOLES);
  const [analytics, setAnalytics] = useState(null);

  // Modal Control States
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedPothole, setSelectedPothole] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [verificationPothole, setVerificationPothole] = useState(null);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  const [workOrderPothole, setWorkOrderPothole] = useState(null);
  const [isWorkOrderModalOpen, setIsWorkOrderModalOpen] = useState(false);

  const [beforeAfterPothole, setBeforeAfterPothole] = useState(null);
  const [isBeforeAfterModalOpen, setIsBeforeAfterModalOpen] = useState(false);

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Fetch Potholes Data from Backend API (or keep fallback sample data)
  const loadData = async () => {
    try {
      const data = await potholesAPI.getAll();
      if (data && data.potholes && data.potholes.length > 0) {
        setPotholes(data.potholes);
      }
      const dash = await analyticsAPI.getDashboard();
      if (dash && dash.analytics) {
        setAnalytics(dash.analytics);
      }
    } catch (err) {
      console.log('Using local client dataset fallback.');
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleReportCreated = (newReport) => {
    setPotholes(prev => [newReport, ...prev]);
    loadData();
  };

  const handleSelectPothole = (pothole) => {
    if (user.role === 'Engineer') {
      setWorkOrderPothole(pothole);
      setIsWorkOrderModalOpen(true);
    } else {
      setSelectedPothole(pothole);
      setIsDetailModalOpen(true);
    }
  };

  const handleOpenVerification = (pothole) => {
    setVerificationPothole(pothole);
    setIsVerificationModalOpen(true);
  };

  const handleOpenBeforeAfter = (pothole) => {
    setBeforeAfterPothole(pothole);
    setIsBeforeAfterModalOpen(true);
  };

  if (showLanding) {
    return <LandingPage onEnterApp={(role) => setShowLanding(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans flex flex-col">
      
      {/* App Top Header */}
      <Header onOpenNotifications={() => setIsNotificationsOpen(true)} />

      {/* Role-Based Primary Page Views */}
      <main className="flex-1 pb-16">
        {user.role === 'Citizen' && (
          <CitizenHome
            user={user}
            potholes={potholes}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenReportModal={() => setIsReportModalOpen(true)}
            onSelectPothole={handleSelectPothole}
            onOpenVerification={handleOpenVerification}
          />
        )}

        {user.role === 'Engineer' && (
          <EngineerDashboard
            user={user}
            potholes={potholes}
            onSelectWorkOrder={(p) => { setWorkOrderPothole(p); setIsWorkOrderModalOpen(true); }}
            onOpenBeforeAfter={handleOpenBeforeAfter}
          />
        )}

        {user.role === 'Admin' && (
          <AdminDashboard
            potholes={potholes}
            analytics={analytics}
            onSelectPothole={handleSelectPothole}
          />
        )}
      </main>

      {/* Citizen iOS Bottom Navigation Bar */}
      {user.role === 'Citizen' && (
        <BottomNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenReportModal={() => setIsReportModalOpen(true)}
        />
      )}

      {/* Slide-over Notifications Center */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      {/* Multi-Step Pothole Reporting Modal */}
      <ReportingModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onReportSuccess={handleReportCreated}
      />

      {/* Report Details & SLA Timeline Modal */}
      <ReportDetailModal
        pothole={selectedPothole}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onRefresh={loadData}
        onOpenVerification={handleOpenVerification}
      />

      {/* Citizen Closed-Loop Verification Modal */}
      <VerificationModal
        pothole={verificationPothole}
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        onVerificationSuccess={loadData}
      />

      {/* Engineer Work Order Drawer Modal */}
      <EngineerWorkOrderModal
        pothole={workOrderPothole}
        isOpen={isWorkOrderModalOpen}
        onClose={() => setIsWorkOrderModalOpen(false)}
        onRefresh={loadData}
        onOpenBeforeAfter={handleOpenBeforeAfter}
      />

      {/* Proof of Work Upload Modal */}
      <BeforeAfterUploadModal
        pothole={beforeAfterPothole}
        isOpen={isBeforeAfterModalOpen}
        onClose={() => setIsBeforeAfterModalOpen(false)}
        onResolveSuccess={loadData}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <MainApp />
      </NotificationProvider>
    </AuthProvider>
  );
}
