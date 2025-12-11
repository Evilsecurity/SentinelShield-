import React from 'react';
import { Shield, Activity, HardDrive, Wifi, Lock, Cpu, Menu, Info } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard', label: 'لوحة القيادة', icon: <Activity size={20} /> },
    { id: 'scanner', label: 'الفحص العميق', icon: <HardDrive size={20} /> },
    { id: 'network', label: 'مراقبة الشبكة', icon: <Wifi size={20} /> },
    { id: 'permissions', label: 'مدير الصلاحيات', icon: <Lock size={20} /> },
    { id: 'processes', label: 'تحليل العمليات', icon: <Cpu size={20} /> },
    { id: 'about', label: 'حول المطور', icon: <Info size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-cyber-black text-gray-200 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 right-0 z-50 w-64 bg-cyber-gray border-l border-cyber-panel transform transition-transform duration-300 md:relative md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-center h-16 border-b border-cyber-panel">
          <Shield className="text-cyber-green mr-2" size={28} />
          <span className="text-xl font-bold tracking-wider text-white">Sentinel<span className="text-cyber-green">Shield</span></span>
        </div>
        
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                setMobileMenuOpen(false);
              }}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === item.id 
                  ? 'bg-cyber-panel text-cyber-green border-r-2 border-cyber-green' 
                  : 'hover:bg-cyber-panel text-gray-400 hover:text-white'
              }`}
            >
              <span className="ml-3">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-cyber-panel">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-cyber-green animate-pulse ml-2"></div>
            <span className="text-xs text-cyber-green">النظام محمي ومراقب</span>
          </div>
          <div className="text-xs text-gray-600 mt-1 font-mono">Kernel v5.10.102-secure</div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-cyber-gray border-b border-cyber-panel">
          <Shield className="text-cyber-green" size={24} />
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white">
            <Menu size={24} />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-black/50 relative">
           {/* Scan Line Effect Background */}
           <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5 overflow-hidden z-0">
             <div className="scan-line"></div>
           </div>
           
           <div className="relative z-10 max-w-7xl mx-auto">
             {children}
           </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;