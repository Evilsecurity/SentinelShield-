import React, { useState, useEffect } from 'react';
import { Search, FileWarning, CheckCircle, Loader, BrainCircuit } from 'lucide-react';
import { analyzeThreat } from '../services/geminiService';
import { ThreatLevel, ScanResult } from '../types';

const Scanner: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState('');
  const [results, setResults] = useState<ScanResult[]>([]);
  const [selectedThreat, setSelectedThreat] = useState<ScanResult | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);

  const mockFiles = [
    '/system/bin/su',
    '/data/data/com.suspicious.app/databases/user_data.db',
    '/sdcard/Download/update_fix_v2.apk',
    '/proc/3412/maps',
    '/system/framework/framework.jar'
  ];

  const startScan = () => {
    setScanning(true);
    setProgress(0);
    setResults([]);
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      setProgress((prev) => Math.min(prev + 5, 100));
      setCurrentFile(mockFiles[currentStep % mockFiles.length] + ` [Checking Signature...]`);

      // Simulate finding a threat
      if (currentStep === 10) {
        setResults(prev => [...prev, {
          id: '1',
          target: 'com.suspicious.app',
          type: 'Process',
          timestamp: Date.now(),
          status: ThreatLevel.CRITICAL,
          details: 'Hidden background service attempting unauthorized upload.'
        }]);
      }
      if (currentStep === 15) {
         setResults(prev => [...prev, {
          id: '2',
          target: 'update_fix_v2.apk',
          type: 'File',
          timestamp: Date.now(),
          status: ThreatLevel.WARNING,
          details: 'Self-signed certificate detected, permission mismatch.'
        }]);
      }

      if (currentStep >= 20) {
        clearInterval(interval);
        setScanning(false);
        setProgress(100);
        setCurrentFile('اكتمل الفحص');
      }
    }, 300);
  };

  const handleAnalyzeWithAI = async (threat: ScanResult) => {
    setSelectedThreat(threat);
    setAnalyzing(true);
    setAiAnalysis('');
    
    const context = `Android Security Scan. Item Type: ${threat.type}. Status: ${threat.status}.`;
    const dataTrace = `Target: ${threat.target}. Details: ${threat.details}. Heuristics: Signature mismatch, excessive wake_locks detected.`;
    
    const report = await analyzeThreat(context, dataTrace);
    setAiAnalysis(report);
    setAnalyzing(false);
  };

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <div className="bg-cyber-gray p-6 rounded-lg border border-cyber-panel flex flex-col items-center justify-center text-center space-y-4">
        <div className={`relative w-32 h-32 rounded-full border-4 flex items-center justify-center transition-all ${scanning ? 'border-cyber-green animate-pulse shadow-[0_0_20px_#00ff41]' : 'border-cyber-panel'}`}>
          {scanning ? (
            <span className="text-2xl font-mono text-cyber-green">{progress}%</span>
          ) : (
            <Search size={48} className="text-gray-400" />
          )}
        </div>
        
        <div>
           <h2 className="text-xl font-bold text-white">الماسح الضوئي العميق (Deep Scanner)</h2>
           <p className="text-gray-400 text-sm mt-1">فحص ملفات النظام، الذاكرة العشوائية، والتطبيقات المخفية</p>
        </div>

        <button 
          onClick={startScan} 
          disabled={scanning}
          className={`px-8 py-3 rounded font-bold uppercase tracking-wider transition-all ${
            scanning 
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
            : 'bg-cyber-green text-black hover:bg-green-400 shadow-[0_0_15px_rgba(0,255,65,0.4)]'
          }`}
        >
          {scanning ? 'جارٍ الفحص...' : 'بدء الفحص الشامل'}
        </button>
        
        {scanning && (
          <div className="w-full max-w-md mt-4 p-2 bg-black rounded border border-cyber-panel font-mono text-xs text-cyber-green text-left overflow-hidden">
            <span className="animate-pulse">_ {currentFile}</span>
          </div>
        )}
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* List */}
          <div className="bg-cyber-gray border border-cyber-panel rounded-lg overflow-hidden">
            <div className="p-4 bg-cyber-panel border-b border-cyber-panel flex justify-between items-center">
              <h3 className="font-bold text-white">التهديدات المكتشفة ({results.length})</h3>
            </div>
            <div className="divide-y divide-cyber-panel">
              {results.map(r => (
                <div key={r.id} className="p-4 hover:bg-white/5 cursor-pointer" onClick={() => handleAnalyzeWithAI(r)}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <FileWarning className={r.status === ThreatLevel.CRITICAL ? 'text-cyber-red' : 'text-cyber-yellow'} />
                      <div>
                        <p className="font-bold text-gray-200">{r.target}</p>
                        <p className="text-xs text-gray-500">{r.type} | {r.details}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded border ${
                      r.status === ThreatLevel.CRITICAL ? 'border-cyber-red text-cyber-red' : 'border-cyber-yellow text-cyber-yellow'
                    }`}>
                      {r.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Analysis Panel */}
          <div className="bg-cyber-gray border border-cyber-panel rounded-lg flex flex-col h-full">
            <div className="p-4 bg-cyber-panel border-b border-cyber-panel flex items-center gap-2">
              <BrainCircuit className="text-cyber-blue" />
              <h3 className="font-bold text-white">تحليل الذكاء الاصطناعي (Gemini)</h3>
            </div>
            <div className="p-6 flex-1 bg-black/30 text-sm font-mono leading-relaxed">
              {!selectedThreat ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-600">
                  <p>اختر تهديداً للتحليل</p>
                </div>
              ) : analyzing ? (
                <div className="flex flex-col items-center justify-center h-full gap-3">
                  <Loader className="animate-spin text-cyber-blue" />
                  <p className="text-cyber-blue animate-pulse">جاري تحليل الكود السلوكي...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="border-b border-cyber-panel pb-2 mb-2">
                     <span className="text-gray-400">Target:</span> <span className="text-white">{selectedThreat.target}</span>
                  </div>
                  <div className="whitespace-pre-line text-gray-300">
                    {aiAnalysis}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 py-2 bg-cyber-red/20 border border-cyber-red text-cyber-red hover:bg-cyber-red/40 rounded transition">
                      عزل (Quarantine)
                    </button>
                    <button className="flex-1 py-2 bg-cyber-panel border border-gray-600 text-gray-300 hover:bg-gray-700 rounded transition">
                      تجاهل
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scanner;