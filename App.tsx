import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Scanner from './components/Scanner';
import NetworkPanel from './components/NetworkPanel';
import ProcessMonitor from './components/ProcessMonitor';
import About from './components/About';
import { Lock } from 'lucide-react';

const Placeholder: React.FC<{ title: string; icon: React.ReactNode }> = ({ title, icon }) => (
  <div className="flex flex-col items-center justify-center h-96 text-gray-500">
    <div className="text-6xl mb-4 opacity-50">{icon}</div>
    <h2 className="text-2xl font-bold mb-2">{title}</h2>
    <p>هذه الوحدة قيد التطوير...</p>
  </div>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'scanner':
        return <Scanner />;
      case 'network':
        return <NetworkPanel />;
      case 'permissions':
        return <Placeholder title="مدير الصلاحيات (Permission Manager)" icon={<Lock />} />;
      case 'processes':
        return <ProcessMonitor />;
      case 'about':
        return <About />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="animate-fade-in">
        {renderContent()}
      </div>
    </Layout>
  );
};

export default App;