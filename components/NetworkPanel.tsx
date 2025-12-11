import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Globe, Server, Smartphone, ShieldAlert } from 'lucide-react';
import { NetworkPacket } from '../types';

const NetworkPanel: React.FC = () => {
  const [data, setData] = useState<NetworkPacket[]>([]);
  const [connections, setConnections] = useState([
    { id: 1, ip: '192.168.1.105', protocol: 'TCP', app: 'System', status: 'Safe', country: 'Local' },
    { id: 2, ip: '142.250.180.14', protocol: 'HTTPS', app: 'Chrome', status: 'Safe', country: 'US' },
    { id: 3, ip: '45.33.22.11', protocol: 'UDP', app: 'com.unknown.miner', status: 'Suspicious', country: 'RU' },
  ]);

  useEffect(() => {
    // Simulate real-time data
    const interval = setInterval(() => {
      setData(prev => {
        const newPoint = {
          time: new Date().toLocaleTimeString('en-US', { hour12: false }),
          upload: Math.floor(Math.random() * 500),
          download: Math.floor(Math.random() * 1000),
          connections: Math.floor(Math.random() * 20) + 5
        };
        const newData = [...prev, newPoint];
        if (newData.length > 20) newData.shift();
        return newData;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Real-time Graph */}
        <div className="lg:col-span-2 bg-cyber-gray border border-cyber-panel p-4 rounded-lg">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Globe className="text-cyber-blue" size={20} />
            حركة البيانات المباشرة (Live Traffic)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis dataKey="time" stroke="#666" fontSize={10} tick={false} />
                <YAxis stroke="#666" fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }}
                />
                <Legend />
                <Line type="monotone" dataKey="upload" stroke="#ff003c" strokeWidth={2} dot={false} name="Upload (KB/s)" />
                <Line type="monotone" dataKey="download" stroke="#00ff41" strokeWidth={2} dot={false} name="Download (KB/s)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-4">
          <div className="bg-cyber-gray border border-cyber-panel p-4 rounded-lg flex items-center justify-between">
             <div>
               <p className="text-gray-400 text-xs">Total Upload</p>
               <h4 className="text-xl font-mono text-cyber-red">450 MB</h4>
             </div>
             <div className="bg-cyber-red/10 p-2 rounded">
               <Server className="text-cyber-red" size={20} />
             </div>
          </div>
          <div className="bg-cyber-gray border border-cyber-panel p-4 rounded-lg flex items-center justify-between">
             <div>
               <p className="text-gray-400 text-xs">Total Download</p>
               <h4 className="text-xl font-mono text-cyber-green">2.1 GB</h4>
             </div>
             <div className="bg-cyber-green/10 p-2 rounded">
               <Smartphone className="text-cyber-green" size={20} />
             </div>
          </div>
           <div className="bg-cyber-gray border border-cyber-panel p-4 rounded-lg border-l-4 border-l-cyber-yellow">
             <p className="text-cyber-yellow text-sm font-bold flex items-center gap-2">
               <ShieldAlert size={16} />
               تنبيه Firewall
             </p>
             <p className="text-gray-400 text-xs mt-1">تم حظر اتصال خارجي من تطبيق غير معروف (Port 4444).</p>
          </div>
        </div>
      </div>

      {/* Connection Table */}
      <div className="bg-cyber-gray border border-cyber-panel rounded-lg overflow-hidden">
        <div className="p-4 bg-cyber-panel border-b border-cyber-panel">
          <h3 className="font-bold text-white">الاتصالات النشطة</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="text-gray-400 bg-black/20 font-mono">
              <tr>
                <th className="p-3">التطبيق</th>
                <th className="p-3">IP Address</th>
                <th className="p-3">البروتوكول</th>
                <th className="p-3">الموقع</th>
                <th className="p-3">الحالة</th>
                <th className="p-3">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-panel text-gray-300">
              {connections.map((conn) => (
                <tr key={conn.id} className="hover:bg-white/5">
                  <td className="p-3 font-medium text-white">{conn.app}</td>
                  <td className="p-3 font-mono text-cyber-blue">{conn.ip}</td>
                  <td className="p-3">{conn.protocol}</td>
                  <td className="p-3">{conn.country}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      conn.status === 'Safe' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400 animate-pulse'
                    }`}>
                      {conn.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <button className="text-xs text-cyber-red hover:underline hover:text-red-400">
                      قطع الاتصال
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NetworkPanel;