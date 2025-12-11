import React from 'react';
import { AlertTriangle, ShieldCheck, Activity, Smartphone } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const data = [
  { time: '00:00', threat: 10, activity: 20 },
  { time: '04:00', threat: 12, activity: 25 },
  { time: '08:00', threat: 5, activity: 60 },
  { time: '12:00', threat: 30, activity: 80 },
  { time: '16:00', threat: 20, activity: 50 },
  { time: '20:00', threat: 8, activity: 30 },
  { time: '24:00', threat: 10, activity: 20 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status Card */}
        <div className="bg-cyber-gray border border-cyber-panel p-6 rounded-lg shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-1 h-full bg-cyber-green"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm">الحالة الأمنية</p>
              <h3 className="text-2xl font-bold text-white mt-1">آمن 98%</h3>
            </div>
            <ShieldCheck className="text-cyber-green opacity-80" size={32} />
          </div>
          <p className="text-xs text-gray-500 mt-4">آخر فحص: منذ 5 دقائق</p>
        </div>

        {/* Threats Card */}
        <div className="bg-cyber-gray border border-cyber-panel p-6 rounded-lg shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1 h-full bg-cyber-yellow"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm">التهديدات المحتملة</p>
              <h3 className="text-2xl font-bold text-white mt-1">3 تحذيرات</h3>
            </div>
            <AlertTriangle className="text-cyber-yellow opacity-80" size={32} />
          </div>
          <p className="text-xs text-gray-500 mt-4">2 صلاحيات، 1 ملف مشبوه</p>
        </div>

        {/* CPU/Memory */}
        <div className="bg-cyber-gray border border-cyber-panel p-6 rounded-lg shadow-lg relative overflow-hidden">
           <div className="absolute top-0 right-0 w-1 h-full bg-cyber-blue"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm">نشاط المعالج</p>
              <h3 className="text-2xl font-bold text-white mt-1">12%</h3>
            </div>
            <Activity className="text-cyber-blue opacity-80" size={32} />
          </div>
          <div className="w-full bg-gray-700 h-1 mt-4 rounded-full overflow-hidden">
            <div className="bg-cyber-blue h-full" style={{ width: '12%' }}></div>
          </div>
        </div>

        {/* Device Info */}
        <div className="bg-cyber-gray border border-cyber-panel p-6 rounded-lg shadow-lg relative overflow-hidden">
           <div className="absolute top-0 right-0 w-1 h-full bg-purple-500"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm">حالة الـ Root</p>
              <h3 className="text-2xl font-bold text-white mt-1">مخفي (Secure)</h3>
            </div>
            <Smartphone className="text-purple-500 opacity-80" size={32} />
          </div>
          <p className="text-xs text-gray-500 mt-4">Magisk Hide: Active</p>
        </div>
      </div>

      {/* Activity Graph */}
      <div className="bg-cyber-gray border border-cyber-panel p-6 rounded-lg">
        <h3 className="text-lg font-bold text-white mb-4">تحليل السلوك الأمني (Behavioral Analytics)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorThreat" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff003c" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ff003c" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ff41" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00ff41" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="time" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#121212', borderColor: '#333' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="threat" stroke="#ff003c" fillOpacity={1} fill="url(#colorThreat)" name="تهديدات" />
              <Area type="monotone" dataKey="activity" stroke="#00ff41" fillOpacity={1} fill="url(#colorActivity)" name="نشاط النظام" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-cyber-gray border border-cyber-panel rounded-lg overflow-hidden">
        <div className="p-4 border-b border-cyber-panel bg-cyber-panel/50">
          <h3 className="font-bold text-white">سجل الأحداث الأخير</h3>
        </div>
        <div className="divide-y divide-cyber-panel">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 hover:bg-white/5 transition-colors flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${i === 1 ? 'bg-cyber-red' : 'bg-cyber-yellow'}`}></div>
                <div>
                  <p className="text-sm font-mono text-gray-200">
                    {i === 1 ? 'محاولة حقن ذاكرة (Memory Injection) تم اكتشافها' : 'طلب صلاحية مشبوه من تطبيق الآلة الحاسبة'}
                  </p>
                  <p className="text-xs text-gray-500">PID: {4000 + i} | Time: 14:3{i}</p>
                </div>
              </div>
              <button className="px-3 py-1 text-xs border border-cyber-panel hover:bg-cyber-panel rounded text-gray-300">
                تحليل
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;