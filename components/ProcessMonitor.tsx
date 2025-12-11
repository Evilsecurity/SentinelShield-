import React, { useState, useEffect } from 'react';
import { Cpu, Zap, Activity, ArrowUp, ArrowDown, EyeOff, PlayCircle, PauseCircle, AlertOctagon, X, FileText, Globe, AlertTriangle, Package, Server, ShieldAlert, ShieldCheck, Search, Pause, Play, Lock, HardDrive, Hash, GitFork, User, Clock, Copy } from 'lucide-react';
import { SystemProcess } from '../types';

interface ProcessDetails {
  apk: string;
  installSource: string;
  permissions: string[];
  openFiles: string[];
  connections: string[];
  anomalies: string[];
  riskScore: number;
  sha256: string;
  parentPid: number;
  user: string;
  startTime: string;
}

const ProcessMonitor: React.FC = () => {
  const [processes, setProcesses] = useState<SystemProcess[]>([]);
  const [sortField, setSortField] = useState<keyof SystemProcess>('cpu');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isPaused, setIsPaused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state
  const [selectedProcess, setSelectedProcess] = useState<SystemProcess | null>(null);
  const [details, setDetails] = useState<ProcessDetails | null>(null);

  // Mock data generation
  useEffect(() => {
    const names = [
      'system_server', 'com.android.systemui', 'zygote64', 'kworker/u16:3', 
      'logd', 'adbd', 'surfaceflinger', 'com.google.android.gms', 
      'com.whatsapp', 'com.instagram.android', 'mm_camera_daemon',
      'netd', 'vold', 'rild', 'audioserver', 'com.unknown.miner', 'jdwp'
    ];
    
    const statusOptions = ['Running', 'Background', 'Suspended'] as const;

    const generateProcesses = (): SystemProcess[] => {
      return Array.from({ length: 25 }, (_, i) => ({
        pid: 1000 + i * 50 + Math.floor(Math.random() * 20),
        name: names[i % names.length] || `process_${i}`,
        cpu: parseFloat((Math.random() * (i % 5 === 0 ? 15 : 2)).toFixed(1)),
        memory: Math.floor(Math.random() * 300) + 10,
        isHidden: i === 15, // Simulate one hidden process
        status: statusOptions[Math.floor(Math.random() * statusOptions.length)]
      }));
    };

    setProcesses(generateProcesses());

    // Update simulation
    const interval = setInterval(() => {
      if (!isPaused) {
        setProcesses(prev => prev.map(p => ({
          ...p,
          cpu: Math.max(0, parseFloat((p.cpu + (Math.random() - 0.5) * 2).toFixed(1))),
          memory: Math.max(10, p.memory + Math.floor((Math.random() - 0.5) * 10))
        })));
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleSort = (field: keyof SystemProcess) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleKillProcess = (pid: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setProcesses(prev => prev.filter(p => p.pid !== pid));
    if (selectedProcess?.pid === pid) {
      closeModal();
    }
  };

  const handleRowClick = (process: SystemProcess) => {
    // Generate specific details based on the process characteristics
    const isSuspicious = process.name.includes('miner') || process.isHidden;
    const isUserApp = process.name.includes('.') && !process.name.startsWith('com.android.') && !process.name.startsWith('com.google.');
    const users = ['root', 'system', 'u0_a123', 'u0_a124', 'radio', 'wifi'];
    
    const mockDetails: ProcessDetails = {
      apk: process.name.includes('.') ? process.name : 'System Process',
      installSource: isSuspicious ? 'Unknown (Sideloaded)' : (isUserApp ? 'Google Play Store' : 'System Partition'),
      permissions: isUserApp 
        ? ['android.permission.INTERNET', 'android.permission.READ_CONTACTS', 'android.permission.ACCESS_FINE_LOCATION']
        : ['CAP_SYS_ADMIN', 'CAP_NET_RAW'],
      openFiles: [
        `/proc/${process.pid}/cmdline`,
        `/proc/${process.pid}/status`,
        `/proc/${process.pid}/maps`,
        isSuspicious ? '/data/local/tmp/payload.so' : `/data/data/${process.name}/databases/main.db`,
        '/system/lib64/libc.so',
        '/dev/binder'
      ],
      connections: [],
      anomalies: [],
      riskScore: 0,
      sha256: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      parentPid: Math.floor(Math.random() * 500) + 100,
      user: users[Math.floor(Math.random() * users.length)],
      startTime: new Date(Date.now() - Math.floor(Math.random() * 10000000)).toLocaleTimeString(),
    };

    // Add fake network connections for some processes
    if (isSuspicious || process.name.includes('whatsapp') || process.name.includes('gms')) {
      mockDetails.connections.push(
        isSuspicious ? '45.33.22.11:4444 (TCP) - ESTABLISHED' : '172.217.16.142:443 (HTTPS) - TIME_WAIT',
        isSuspicious ? '192.168.1.105:5555 (UDP) - LISTEN' : '142.250.185.78:443 (HTTPS) - ESTABLISHED'
      );
    }

    if (process.isHidden) mockDetails.anomalies.push('Process is hidden from standard API calls (Rootkit behavior)');
    if (process.cpu > 10) mockDetails.anomalies.push('Abnormal CPU consumption detected (Possible mining)');
    if (process.name.includes('miner')) mockDetails.anomalies.push('Known crypto-miner signature match');
    if (process.pid < 2000 && process.status === 'Suspended') mockDetails.anomalies.push('System process suspended unexpectedly');

    // Calculate risk score
    let score = 0;
    if (process.isHidden) score += 50;
    if (process.name.includes('miner')) score += 40;
    if (process.cpu > 15) score += 10;
    if (mockDetails.connections.some(c => c.includes('4444') || c.includes('5555'))) score += 20;
    mockDetails.riskScore = Math.min(score, 100);

    setSelectedProcess(process);
    setDetails(mockDetails);
  };

  const closeModal = () => {
    setSelectedProcess(null);
    setDetails(null);
  };

  const filteredProcesses = processes.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.pid.toString().includes(searchQuery)
  );

  const sortedProcesses = [...filteredProcesses].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Running': return 'text-cyber-green';
      case 'Suspended': return 'text-gray-500';
      case 'Background': return 'text-cyber-blue';
      default: return 'text-gray-400';
    }
  };

  const getProcessTypeInfo = (process: SystemProcess) => {
    if (process.isHidden || process.name.includes('miner')) {
      return { icon: <ShieldAlert size={18} />, color: 'text-cyber-red', title: 'Potential Threat' };
    }
    if ((process.name.startsWith('com.') || process.name.startsWith('org.')) && 
        !process.name.includes('.android.') && 
        !process.name.includes('.google.')) {
      return { icon: <Package size={18} />, color: 'text-cyber-blue', title: 'User Application' };
    }
    return { icon: <Cpu size={18} />, color: 'text-gray-500', title: 'System Process' };
  };

  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-cyber-gray border border-cyber-panel p-4 rounded-lg flex items-center gap-4">
          <div className="bg-cyber-panel p-3 rounded-full"><Cpu className="text-cyber-green" /></div>
          <div>
             <p className="text-gray-400 text-xs">Total Processes</p>
             <h3 className="text-xl font-bold font-mono">{processes.length}</h3>
          </div>
        </div>
        <div className="bg-cyber-gray border border-cyber-panel p-4 rounded-lg flex items-center gap-4">
          <div className="bg-cyber-panel p-3 rounded-full"><Zap className="text-cyber-yellow" /></div>
          <div>
             <p className="text-gray-400 text-xs">Avg CPU Usage</p>
             <h3 className="text-xl font-bold font-mono">
               {(processes.reduce((acc, curr) => acc + curr.cpu, 0) / processes.length).toFixed(1)}%
             </h3>
          </div>
        </div>
        <div className="bg-cyber-gray border border-cyber-panel p-4 rounded-lg flex items-center gap-4">
          <div className="bg-cyber-panel p-3 rounded-full"><Activity className="text-cyber-blue" /></div>
          <div>
             <p className="text-gray-400 text-xs">Total Memory</p>
             <h3 className="text-xl font-bold font-mono">
               {(processes.reduce((acc, curr) => acc + curr.memory, 0)).toFixed(0)} MB
             </h3>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-cyber-gray border border-cyber-panel rounded-lg overflow-hidden">
        <div className="p-4 bg-cyber-panel border-b border-cyber-panel flex flex-col md:flex-row justify-between items-center gap-4">
            <h3 className="font-bold text-white flex items-center gap-2">
                <AlertOctagon className="text-cyber-green" size={18} />
                قائمة العمليات النشطة
            </h3>

            <div className="flex items-center gap-3 w-full md:w-auto">
                {/* Search Input */}
                <div className="relative group flex-1 md:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={14} className="text-gray-500 group-focus-within:text-cyber-blue transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-1.5 border border-cyber-panel bg-black/20 rounded-md leading-5 text-gray-300 placeholder-gray-600 focus:outline-none focus:bg-black/40 focus:border-cyber-blue/50 focus:ring-1 focus:ring-cyber-blue/50 sm:text-xs transition-all"
                        placeholder="Search by name or PID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <button 
                      onClick={() => setIsPaused(!isPaused)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold transition-all border ${isPaused ? 'bg-cyber-yellow/20 text-cyber-yellow border-cyber-yellow/50' : 'bg-cyber-panel text-gray-400 border-cyber-panel hover:text-white'}`}
                    >
                      {isPaused ? <Play size={14} /> : <Pause size={14} />}
                      <span className="hidden sm:inline">{isPaused ? 'RESUME' : 'PAUSE'}</span>
                    </button>
                </div>
            </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-black/20 text-gray-400 text-xs uppercase font-medium">
              <tr>
                <th className="p-4 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('pid')}>
                  <div className="flex items-center gap-1">
                    PID {sortField === 'pid' && (sortDirection === 'asc' ? <ArrowUp size={14}/> : <ArrowDown size={14}/>)}
                  </div>
                </th>
                <th className="p-4 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1">
                    Name {sortField === 'name' && (sortDirection === 'asc' ? <ArrowUp size={14}/> : <ArrowDown size={14}/>)}
                  </div>
                </th>
                <th className="p-4 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('cpu')}>
                  <div className="flex items-center gap-1">
                    CPU % {sortField === 'cpu' && (sortDirection === 'asc' ? <ArrowUp size={14}/> : <ArrowDown size={14}/>)}
                  </div>
                </th>
                <th className="p-4 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('memory')}>
                  <div className="flex items-center gap-1">
                    Memory (MB) {sortField === 'memory' && (sortDirection === 'asc' ? <ArrowUp size={14}/> : <ArrowDown size={14}/>)}
                  </div>
                </th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-panel text-sm">
              {sortedProcesses.map((process) => (
                <tr 
                  key={process.pid} 
                  onClick={() => handleRowClick(process)}
                  className={`cursor-pointer hover:bg-white/5 transition-colors group ${process.isHidden ? 'bg-red-900/10' : ''}`}
                >
                  <td className="p-4 font-mono text-gray-500">{process.pid}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {(() => {
                        const typeInfo = getProcessTypeInfo(process);
                        return (
                           <div title={typeInfo.title} className={`${typeInfo.color} p-1.5 rounded bg-white/5 border border-transparent hover:border-white/10 transition-colors`}>
                             {typeInfo.icon}
                           </div>
                        );
                      })()}
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${process.isHidden ? 'text-cyber-red' : 'text-gray-200'}`}>
                          {process.name}
                        </span>
                        {process.isHidden && (
                          <span title="Hidden Process Detected">
                            <EyeOff size={14} className="text-cyber-red animate-pulse" />
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-mono">
                    <span className={process.cpu > 10 ? 'text-cyber-red font-bold' : 'text-gray-300'}>
                      {process.cpu.toFixed(1)}%
                    </span>
                  </td>
                  <td className="p-4 font-mono text-gray-300">{process.memory.toFixed(0)}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                       {process.status === 'Running' ? <PlayCircle size={14} className="text-cyber-green"/> : <PauseCircle size={14} className="text-gray-500"/>}
                       <span className={getStatusColor(process.status)}>{process.status}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button 
                        className="text-cyber-blue text-xs hover:bg-cyber-blue/10 px-3 py-1 rounded border border-cyber-blue/30 opacity-60 hover:opacity-100 transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(process);
                        }}
                      >
                        INFO
                      </button>
                      <button 
                        className="text-cyber-red text-xs hover:bg-cyber-red/10 px-3 py-1 rounded border border-cyber-red/30 opacity-60 hover:opacity-100 transition-all flex items-center gap-1 group"
                        onClick={(e) => handleKillProcess(process.pid, e)}
                        title="Terminate Process"
                      >
                        <X size={12} className="group-hover:scale-125 transition-transform"/>
                        KILL
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedProcess && details && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={closeModal}>
          <div className="bg-cyber-gray border border-cyber-panel w-full max-w-3xl rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className="p-4 border-b border-cyber-panel flex justify-between items-center bg-cyber-panel/50">
               <div className="flex items-center gap-3">
                 <div className={`p-2 rounded ${details.riskScore > 50 ? 'bg-cyber-red/20 text-cyber-red' : 'bg-cyber-blue/20 text-cyber-blue'}`}>
                   {details.riskScore > 50 ? <ShieldAlert size={24} /> : <ShieldCheck size={24} />}
                 </div>
                 <div>
                   <h3 className="font-bold text-white text-lg">{selectedProcess.name}</h3>
                   <div className="flex items-center gap-3 text-xs text-gray-400 font-mono">
                     <span className="flex items-center gap-1"><Hash size={10}/> PID: {selectedProcess.pid}</span>
                     <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                     <span className="flex items-center gap-1"><Clock size={10}/> {details.startTime}</span>
                   </div>
                 </div>
               </div>
               <button onClick={closeModal} className="text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded transition-colors">
                 <X size={20} />
               </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
               
               {/* Risk Score */}
               <div className="bg-black/40 p-4 rounded-lg border border-cyber-panel">
                 <div className="flex justify-between items-end mb-2">
                   <span className="text-gray-400 text-sm font-bold">Threat Score</span>
                   <span className={`text-xl font-mono font-bold ${details.riskScore > 50 ? 'text-cyber-red' : 'text-cyber-green'}`}>
                     {details.riskScore}/100
                   </span>
                 </div>
                 <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                   <div 
                     className={`h-full transition-all duration-1000 ${details.riskScore > 50 ? 'bg-cyber-red shadow-[0_0_10px_#ff003c]' : 'bg-cyber-green shadow-[0_0_10px_#00ff41]'}`} 
                     style={{ width: `${details.riskScore}%` }}
                   ></div>
                 </div>
               </div>

               {/* Anomalies Section (if any) */}
               {details.anomalies.length > 0 && (
                 <div className="bg-red-900/10 border border-cyber-red/30 p-4 rounded-lg animate-pulse">
                   <h4 className="text-cyber-red font-bold mb-2 flex items-center gap-2">
                     <AlertTriangle size={18} />
                     Anomalies Detected
                   </h4>
                   <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                     {details.anomalies.map((anomaly, idx) => (
                       <li key={idx}>{anomaly}</li>
                     ))}
                   </ul>
                 </div>
               )}

               {/* Grid Layout for details */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 
                 {/* App Info */}
                 <div className="space-y-4">
                   <div>
                     <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                       <Package size={16} className="text-cyber-green" />
                       Process Identity
                     </h4>
                     <div className="bg-black/20 p-3 rounded border border-cyber-panel space-y-3">
                       <div className="text-sm">
                         <span className="text-gray-500 block text-xs uppercase tracking-wider mb-1">Process Name / APK</span>
                         <span className="text-gray-200 font-mono break-all">{details.apk}</span>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-2">
                          <div className="text-sm">
                            <span className="text-gray-500 block text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                              <GitFork size={10} /> Parent PID
                            </span>
                            <span className="text-cyber-blue font-mono">{details.parentPid}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500 block text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                              <User size={10} /> User
                            </span>
                            <span className="text-gray-300 font-mono">{details.user}</span>
                          </div>
                       </div>

                       <div className="text-sm">
                          <span className="text-gray-500 block text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                             <Hash size={10} /> SHA-256 Checksum
                          </span>
                          <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded border border-cyber-panel/30">
                            <span className="text-gray-400 font-mono text-[10px] break-all truncate">{details.sha256}</span>
                            <button className="text-gray-500 hover:text-white transition-colors" title="Copy Hash">
                              <Copy size={12} />
                            </button>
                          </div>
                       </div>
                     </div>
                   </div>

                   <div>
                      <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                         <HardDrive size={16} className="text-cyber-yellow" />
                         Resources & Storage
                       </h4>
                       <div className="bg-black/20 p-3 rounded border border-cyber-panel space-y-3">
                         <div className="text-sm">
                           <span className="text-gray-500 block text-xs uppercase tracking-wider mb-1">Install Source</span>
                           <span className={`${details.installSource.includes('Unknown') ? 'text-cyber-yellow' : 'text-cyber-blue'}`}>
                             {details.installSource}
                           </span>
                         </div>
                         <div className="grid grid-cols-2 gap-2 border-t border-cyber-panel/30 pt-2">
                            <div className="text-sm">
                                <span className="text-gray-500 block text-xs uppercase tracking-wider">Memory</span>
                                <span className="text-gray-200 font-mono">{selectedProcess.memory} MB</span>
                            </div>
                            <div className="text-sm">
                                <span className="text-gray-500 block text-xs uppercase tracking-wider">CPU Load</span>
                                <span className="text-gray-200 font-mono">{selectedProcess.cpu}%</span>
                            </div>
                         </div>
                       </div>
                   </div>
                 </div>

                 {/* Network & Files */}
                 <div className="space-y-4">
                   <div>
                     <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                       <Globe size={16} className="text-cyber-blue" />
                       Network Connections
                     </h4>
                     <div className="bg-black/20 p-3 rounded border border-cyber-panel min-h-[100px] max-h-[150px] overflow-y-auto custom-scrollbar">
                       {details.connections.length > 0 ? (
                         <ul className="text-sm font-mono space-y-2">
                           {details.connections.map((conn, idx) => (
                             <li key={idx} className="flex items-center gap-2 text-gray-300 border-b border-cyber-panel/30 last:border-0 pb-1 last:pb-0">
                               <Server size={12} className={conn.includes('ESTABLISHED') ? "text-cyber-green" : "text-cyber-yellow"}/> 
                               <span className="truncate" title={conn}>{conn}</span>
                             </li>
                           ))}
                         </ul>
                       ) : (
                         <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-2 py-4">
                           <Globe size={24} className="opacity-20" />
                           <span className="text-xs italic">No active connections</span>
                         </div>
                       )}
                     </div>
                   </div>

                   <div>
                      <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                         <FileText size={16} className="text-gray-400" />
                         Open Files & Handles
                       </h4>
                       <div className="bg-black/20 p-3 rounded border border-cyber-panel max-h-[150px] overflow-y-auto custom-scrollbar">
                         <ul className="text-xs font-mono space-y-1 text-gray-400">
                           {details.openFiles.map((file, idx) => (
                             <li key={idx} className="hover:text-white transition-colors border-b border-cyber-panel/30 pb-1 last:border-0 last:pb-0 flex items-center gap-2">
                               <span className="w-1.5 h-1.5 rounded-full bg-cyber-panel shrink-0"></span>
                               <span className="truncate" title={file}>{file}</span>
                             </li>
                           ))}
                         </ul>
                       </div>
                   </div>

                   <div>
                      <h4 className="text-white font-bold mb-2 flex items-center gap-2 text-sm">
                        <Lock size={14} className="text-cyber-green" /> Key Permissions
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {details.permissions.map((perm, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 text-[10px] font-mono border border-gray-700">
                            {perm.split('.').pop()}
                          </span>
                        ))}
                      </div>
                   </div>
                 </div>
               </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-cyber-panel bg-cyber-gray flex justify-between gap-3">
              <button className="px-4 py-2 rounded text-sm text-cyber-blue hover:bg-cyber-blue/10 border border-transparent hover:border-cyber-blue/30 transition-all flex items-center gap-2">
                <Search size={16} />
                Deep Scan with Gemini
              </button>
              <div className="flex gap-2">
                <button onClick={closeModal} className="px-4 py-2 rounded text-sm text-gray-300 hover:text-white hover:bg-cyber-panel transition-colors">
                    Close
                </button>
                <button 
                  onClick={() => handleKillProcess(selectedProcess.pid)}
                  className="px-4 py-2 rounded text-sm bg-cyber-red/20 text-cyber-red border border-cyber-red/50 hover:bg-cyber-red/40 transition-colors uppercase font-bold tracking-wider flex items-center gap-2"
                >
                    <X size={16} />
                    Terminate
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessMonitor;