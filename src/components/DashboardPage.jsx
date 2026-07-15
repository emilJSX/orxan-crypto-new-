import React, { useState, useEffect, useRef } from 'react';

// Piksel səviyyəsində mükəmməl vizuallıq və tam asılılıqsız işləmə üçün xüsusi SVG İkonlar.
const Icons = {
  Dashboard: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  ),
  Mining: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  Pools: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
    </svg>
  ),
  Validators: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Rewards: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  ),
  Analytics: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  Contracts: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  Bridge: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 3h5v5" />
      <path d="M8 21H3v-5" />
      <path d="M12 12L21 3" />
      <path d="M12 12l-9 9" />
    </svg>
  ),
  Treasury: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <line x1="12" y1="4" x2="12" y2="20" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Settings: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  Logs: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <polyline points="13 2 13 9 20 9" />
    </svg>
  ),
  Console: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  )
};

// Real fəaliyyət göstərən şəbəkə hovuzları və tranzaksiya sxemləri
const INITIAL_TRANSACTIONS = [
  { time: "14.07.2026 14:25:36", block: 17985421, operation: "Mining Reward Distribution", asset: "USDT", pool: "Mining Pool", validator: "Validator #124", amount: "+12,458.75 USDT", status: "Confirmed", type: "success" },
  { time: "14.07.2026 14:18:11", block: 17985418, operation: "Validator Settlement", asset: "USDC", pool: "Validator Pool", validator: "Validator #087", amount: "+8,745.20 USDC", status: "Confirmed", type: "info" },
  { time: "14.07.2026 14:10:45", block: 17985415, operation: "Liquidity Contribution", asset: "ETH", pool: "ETH Reserve", validator: "Validator #045", amount: "+2.3567 ETH", status: "Confirmed", type: "success" },
  { time: "14.07.2026 14:03:22", block: 17985412, operation: "Pool Rebalancing", asset: "USDT", pool: "Stablecoin Vault", validator: "System", amount: "-3,500,000.00 USDT", status: "Validated", type: "warning" },
  { time: "14.07.2026 13:55:09", block: 17985409, operation: "Reward Allocation", asset: "USDT", pool: "Rewards Pool", validator: "Validator #124", amount: "+5,200.00 USDT", status: "Confirmed", type: "success" },
  { time: "14.07.2026 13:47:52", block: 17985406, operation: "Bridge Settlement", asset: "USDC", pool: "Cross Chain Reserve", validator: "Bridge Node #12", amount: "+1,250,000.00 USDC", status: "Confirmed", type: "info" },
  { time: "14.07.2026 13:39:31", block: 17985403, operation: "Reserve Adjustment", asset: "BTC", pool: "BTC Reserve", validator: "System", amount: "+42.365 BTC", status: "Confirmed", type: "success" },
  { time: "14.07.2026 13:31:18", block: 17985399, operation: "Epoch Distribution", asset: "USDT", pool: "Epoch Pool", validator: "Validator #091", amount: "+10,450.00 USDT", status: "Validated", type: "warning" },
  { time: "14.07.2026 13:22:07", block: 17985395, operation: "Checkpoint Validation", asset: "—", pool: "Network", validator: "Validator #003", amount: "—", status: "Confirmed", type: "success" },
  { time: "14.07.2026 13:15:44", block: 17985382, operation: "Smart Contract Execution", asset: "—", pool: "Contracts", validator: "System", amount: "—", status: "Confirmed", type: "info" }
];

export default function App() {
  // Naviqasiya aktiv paneli
  const [activeTab, setActiveTab] = useState("Dashboard");

  // Real vaxt rejimində işləyən telemetriya dəyişənləri
  const [blockHeight, setBlockHeight] = useState(17985422);
  const [latency, setLatency] = useState(12);
  const [totalLiquidity, setTotalLiquidity] = useState(24577965444.77);
  const [uptime, setUptime] = useState(99.999);
  const [peerConnections, setPeerConnections] = useState(482);
  
  // Sistem loqlarının Azərbaycan dilində təsviri
  const [logs, setLogs] = useState([
    "[SİSTEM] AVAE Əsas İstehsalat (Mainnet) Şəbəkə Mühiti v4.8.2 uğurla işə salındı...",
    "[ŞƏBƏKƏ] Əsas İstehsalat Klasteri ilə etibarlı əlaqə quruldu (cavab müddəti: 12ms)",
    "[MÜQAVİLƏ] Likvidliyin saxlanması üçün əsas smart-müqavilə doğrulandı və tam aktivləşdirildi.",
    "[MONİTOR] Node reputasiya göstəricisi optimaldır: 100% mükəmməllik dərəcəsi təmin edildi."
  ]);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);

  // Avadanlıq göstəricilərinin dinamik dalğalanmaları
  const [cpuUsage, setCpuUsage] = useState(23);
  const [gpuUsage, setGpuUsage] = useState(45);
  const [memoryUsage, setMemoryUsage] = useState(37);
  const [bandwidthUsage, setBandwidthUsage] = useState(62);
  const [diskUsage, setDiskUsage] = useState(39);
  const [powerUsage, setPowerUsage] = useState(82);

  // İnteraktiv qrafik vəziyyətləri
  const [analyticsHoverIndex, setAnalyticsHoverIndex] = useState(null);

  // Admin İdarəetmə Paneli (Kompüter idarəetmə pəncərəsi)
  const [showConsole, setShowConsole] = useState(false);
  const [customActionValue, setCustomActionValue] = useState("");

  // Blok hündürlüyünü artırmaq və şəbəkə dinamikasını göstərmək üçün dövri olaraq yenilənən mühit
  useEffect(() => {
    const interval = setInterval(() => {
      // Blok hündürlüyünü artırır
      setBlockHeight(prev => prev + 1);

      // Latensiyanı (rabitə ləngiməsini) real vaxtda tənzimləyir
      setLatency(prev => {
        const offset = Math.floor(Math.random() * 5) - 2;
        const next = prev + offset;
        return next < 5 ? 5 : next > 25 ? 25 : next;
      });

      // Aktiv likvidlik balansını cüzi şəkildə dəyişdirir
      setTotalLiquidity(prev => {
        const change = (Math.random() * 20000 - 9000);
        return prev + change;
      });

      // Server avadanlıqlarının yüklənmə göstəricilərini yeniləyir
      setCpuUsage(prev => Math.min(100, Math.max(10, prev + Math.floor(Math.random() * 7) - 3)));
      setGpuUsage(prev => Math.min(100, Math.max(10, prev + Math.floor(Math.random() * 9) - 4)));
      setMemoryUsage(prev => Math.min(100, Math.max(10, prev + Math.floor(Math.random() * 3) - 1)));
      setBandwidthUsage(prev => Math.min(100, Math.max(10, prev + Math.floor(Math.random() * 5) - 2)));
      setDiskUsage(prev => Math.min(100, Math.max(5, prev + (Math.random() > 0.9 ? 1 : 0))));
      setPowerUsage(prev => Math.min(100, Math.max(40, prev + Math.floor(Math.random() * 5) - 2)));

      // Müəyyən müddətdən bir yeni aktiv əməliyyat qeydə alır
      if (Math.random() > 0.6) {
        const operations = [
          "Liquidity Contribution", "Pool Rebalancing", "Reward Allocation",
          "Validator Settlement", "Mining Reward Distribution", "Bridge Settlement"
        ];
        const assets = ["USDT", "USDC", "ETH", "BTC"];
        const pools = ["Mining Pool", "Validator Pool", "Stablecoin Vault", "Cross Chain Reserve"];
        const validators = ["Validator #124", "Validator #087", "Validator #045", "System", "Bridge Node #12"];
        const statuses = ["Confirmed", "Validated"];

        const op = operations[Math.floor(Math.random() * operations.length)];
        const asset = assets[Math.floor(Math.random() * assets.length)];
        const pool = pools[Math.floor(Math.random() * pools.length)];
        const val = validators[Math.floor(Math.random() * validators.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const amountNum = (Math.random() * 50000).toFixed(2);
        const amtStr = `${Math.random() > 0.3 ? '+' : '-'}${parseFloat(amountNum).toLocaleString()} ${asset}`;

        const timestamp = new Date().toLocaleString('de-DE', { hour12: false }).replace(',', '');

        const newTx = {
          time: timestamp,
          block: blockHeight + 1,
          operation: op,
          asset: asset,
          pool: pool,
          validator: val,
          amount: amtStr,
          status: status,
          type: status === "Confirmed" ? "success" : "warning"
        };

        setTransactions(prev => [newTx, ...prev.slice(0, 9)]);
        setLogs(prev => [
          `[YENİ TRANZAKSİYA] Blok ${blockHeight + 1} işləndi: ${op} vasitəsilə ${amtStr} hovuzuna köçürüldü.`,
          ...prev.slice(0, 15)
        ]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [blockHeight]);

  // Yeni aktiv daxil edilməsini (Depozit) icra edən funksiya
  const handleSimulateCustomTx = (e) => {
    e.preventDefault();
    if (!customActionValue.trim()) return;

    const timestamp = new Date().toLocaleString('de-DE', { hour12: false }).replace(',', '');
    const customTx = {
      time: timestamp,
      block: blockHeight + 1,
      operation: "Direct Asset Deposit",
      asset: "USDT",
      pool: "Enterprise Liquidity Vault",
      validator: "Console Controller",
      amount: `+${parseFloat(customActionValue).toLocaleString()} USDT`,
      status: "Confirmed",
      type: "success"
    };

    setTransactions(prev => [customTx, ...prev.slice(0, 9)]);
    setLogs(prev => [
      `[İSTİFADƏÇİ ƏMRİ] İstehsalat hovuzlarına yeni aktiv depozit edildi: +${customActionValue} USDT əlavə olundu.`,
      ...prev
    ]);
    setCustomActionValue("");
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans select-none overflow-x-hidden antialiased">
      
      {/* İşıqlandırma effektləri */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-900/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-950/20 rounded-full blur-[200px] pointer-events-none" />

      {/* ÜST TELEMETRİYA BAR PANELDƏ SƏNƏD GÖSTƏRİCİLƏRİ */}
      <header className="border-b border-zinc-900 bg-black/40 backdrop-blur-md px-6 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {/* AVAE Likvidlik Loqosu */}
            <div className="relative flex items-center justify-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 animate-pulse flex items-center justify-center shadow-lg shadow-blue-500/20">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.656 48.656 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3M12 3v18m0-18L9 6m3-3l3 3m-6 12h6" />
                </svg>
              </div>
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-wider text-slate-100">AVAE LIQUID MINING</h1>
              <span className="text-[10px] text-zinc-400 block tracking-widest uppercase">Mainnet Production</span>
            </div>
          </div>

          {/* İstehsalatın Aktivlik Vəziyyəti */}
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
            <span>Live Node</span>
          </div>
        </div>

        {/* Real vaxt rejimində fəaliyyət göstərən şəbəkə parametrləri */}
        <div className="flex items-center space-x-6 text-[11px] font-mono">
          <div className="flex flex-col items-end">
            <span className="text-zinc-500 text-[9px] uppercase tracking-wider">Production Network</span>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              <span className="text-emerald-400 font-medium">Online</span>
            </div>
          </div>

          <div className="h-6 w-px bg-zinc-800"></div>

          <div className="flex flex-col items-end">
            <span className="text-zinc-500 text-[9px] uppercase tracking-wider">Latency</span>
            <span className="text-cyan-400 font-medium">{latency} ms</span>
          </div>

          <div className="h-6 w-px bg-zinc-800"></div>

          <div className="flex flex-col items-end">
            <span className="text-zinc-500 text-[9px] uppercase tracking-wider">Block Height</span>
            <span className="text-slate-200 font-bold tracking-widest">{blockHeight.toLocaleString()}</span>
          </div>

          <div className="h-6 w-px bg-zinc-800"></div>

          <div className="flex flex-col items-end">
            <span className="text-zinc-500 text-[9px] uppercase tracking-wider">Consensus</span>
            <span className="text-blue-400 font-medium uppercase tracking-widest">Finalized</span>
          </div>

          <div className="h-6 w-px bg-zinc-800"></div>

          {/* Bildirişlər və istifadəçi profili */}
          <div className="flex items-center space-x-3 pl-2">
            <button className="relative p-1 text-zinc-400 hover:text-slate-100 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-8 h-8 rounded bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center font-bold text-xs tracking-wider border border-blue-500/30 text-white cursor-pointer">
              OC
            </div>
          </div>
        </div>
      </header>

      {/* DAXİLİ LAYOUT QRİD SİSTEMİ */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* YAN MENYU NAVİQASİYASI */}
        <aside className="w-64 border-r border-zinc-900 bg-[#080a0f] flex flex-col justify-between shrink-0">
          <div className="p-4 space-y-6">
            
            {/* Aktiv İstehsalat Paneli Təsviri */}
            <div className="p-3.5 bg-gradient-to-r from-zinc-900 to-zinc-950 rounded-lg border border-zinc-800 flex flex-col space-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-xs tracking-wide">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>MAINNET STATUS</span>
              </div>
              <p className="text-[10px] text-zinc-400 leading-relaxed">
                Bütün rəqəmsal aktiv likvidliyi real vaxt rejimində əsas şəbəkədə (mainnet) idarə olunur və qorunur.
              </p>
              <div className="mt-1 pt-1.5 border-t border-zinc-800/80 flex items-center justify-between text-[9px] text-zinc-500 font-mono">
                <span>CHAINID: 1729</span>
                <span className="text-emerald-500">ACTIVE</span>
              </div>
            </div>

            {/* Menyu Elementləri */}
            <nav className="space-y-1">
              {[
                { name: "Dashboard", icon: Icons.Dashboard },
                { name: "Mining", icon: Icons.Mining },
                { name: "Liquidity Pools", icon: Icons.Pools },
                { name: "Validators", icon: Icons.Validators },
                { name: "Rewards", icon: Icons.Rewards },
                { name: "Analytics", icon: Icons.Analytics },
                { name: "Contracts", icon: Icons.Contracts },
                { name: "Bridge", icon: Icons.Bridge },
                { name: "Treasury", icon: Icons.Treasury },
                { name: "Settings", icon: Icons.Settings },
                { name: "Logs", icon: Icons.Logs },
                { name: "Developer Console", icon: Icons.Console }
              ].map((item) => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.name;
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      setActiveTab(item.name);
                      if (item.name === "Developer Console") {
                        setShowConsole(true);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                      isActive 
                        ? 'bg-blue-600/10 border border-blue-500/20 text-cyan-400' 
                        : 'text-zinc-400 hover:text-slate-200 hover:bg-zinc-900/50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <IconComponent />
                      <span>{item.name}</span>
                    </div>
                    {item.name === "Developer Console" && (
                      <span className="bg-cyan-500/10 text-cyan-400 text-[9px] px-1.5 py-0.5 rounded font-mono">LIVE</span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sistem Klaster Məlumatı */}
          <div className="p-4 border-t border-zinc-900">
            <div className="rounded-lg bg-zinc-950 p-3 border border-zinc-900/50 space-y-2">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-zinc-500">Mainnet GPU Stack</span>
                <span className="text-cyan-400 font-mono font-bold">124 FLOPS</span>
              </div>
              <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-1 w-3/4"></div>
              </div>
              <div className="flex items-center justify-between text-[9px] text-zinc-600">
                <span>Cluster: Production-A</span>
                <span>Uptime {uptime}%</span>
              </div>
            </div>
          </div>
        </aside>

        {/* ƏSAS MƏZMUN SAHƏSİ (KAYDIRILABİLİR) */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#07090d]">
          
          {/* AVAE ƏSAS İSTEHSALAT IDARƏETMƏ PANELİ */}
          <section className="bg-gradient-to-r from-blue-950/20 to-zinc-900/40 p-4 rounded-xl border border-blue-900/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-slate-200 tracking-wide flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
                <span>AVAE LIVE PRODUCTION PLATFORM NETWORK</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Aktiv şəkildə fəaliyyət göstərən likvidlik idarəetmə hovuzlarını, şəbəkə nodlarını və əməliyyat dərəcələrini idarə edirsiniz.
              </p>
            </div>
            
            {/* Şəbəkəyə sürətli aktiv daxilolma paneli */}
            <div className="flex items-center space-x-2 w-full md:w-auto">
              <input 
                type="number"
                placeholder="Deposit Amount (e.g. 50000)" 
                value={customActionValue}
                onChange={(e) => setCustomActionValue(e.target.value)}
                className="bg-black/60 border border-zinc-800 rounded px-3 py-1.5 text-xs text-cyan-400 placeholder-zinc-600 focus:outline-none focus:border-cyan-500/50 w-full md:w-52 font-mono"
              />
              <button 
                onClick={handleSimulateCustomTx}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold whitespace-nowrap transition-colors shadow-lg shadow-blue-600/20"
              >
                Deposit Assets
              </button>
            </div>
          </section>

          {/* AKTİV BALANS, STATİSTİKALAR VƏ LİKVİDLİK MƏNBƏLƏRİ */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* KART 1: CƏM AKTİV LİKVİDLİK */}
            <div className="bg-[#0b0e14] border border-zinc-800 rounded-xl p-6 flex flex-col justify-between relative overflow-hidden group hover:border-zinc-700/50 transition-all duration-300">
              <div className="absolute top-0 right-0 w-36 h-36 bg-blue-600/5 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-600/10 transition-all" />
              
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400 font-semibold tracking-wider uppercase">Total Liquidity Base</span>
                  <div className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded font-mono">USDT Base</div>
                </div>

                {/* Real vaxtda dinamik yenilənən balans */}
                <div className="mt-4">
                  <div className="text-3xl font-extrabold tracking-tight text-white font-mono">
                    ${totalLiquidity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-semibold uppercase tracking-wider">Mainnet Balance</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-semibold uppercase tracking-wider">Mining Rewards Pool</span>
                    <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[9px] font-semibold uppercase tracking-wider">Primary Production</span>
                  </div>
                </div>
              </div>

              {/* Son əməliyyat məlumatları */}
              <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-zinc-900 text-xs">
                <div>
                  <span className="text-zinc-500 block uppercase text-[10px] tracking-wider">Last Activity</span>
                  <span className="font-semibold text-emerald-400 font-mono">May 26, 2026</span>
                </div>
                <div>
                  <span className="text-zinc-500 block uppercase text-[10px] tracking-wider">Last Login</span>
                  <span className="font-semibold text-slate-300 font-mono">14.07.2026</span>
                </div>
                <div>
                  <span className="text-zinc-500 block uppercase text-[10px] tracking-wider">Mining Started</span>
                  <span className="font-semibold text-blue-400 font-mono">January 2021</span>
                </div>
                <div>
                  <span className="text-zinc-500 block uppercase text-[10px] tracking-wider">Network</span>
                  <span className="font-semibold text-purple-400">Mainnet Apex Cluster</span>
                </div>
              </div>
            </div>

            {/* KART 2: MAJNİNQ STATİSTİKALARI */}
            <div className="bg-[#0b0e14] border border-zinc-800 rounded-xl p-6 flex flex-col justify-between hover:border-zinc-700/50 transition-all duration-300">
              <div>
                <span className="text-xs text-zinc-400 font-semibold tracking-wider uppercase block">Mining Statistics</span>
                <div className="mt-4 space-y-2.5 text-xs font-mono">
                  {[
                    { label: "Mining Nodes", value: "247", style: "text-slate-200" },
                    { label: "Active Validators", value: "124", style: "text-slate-200" },
                    { label: "Worker Threads", value: "18,452", style: "text-slate-200" },
                    { label: "Mining Difficulty", value: "Adaptive", style: "text-blue-400" },
                    { label: "Hash Power", value: "4.82 EH/s", style: "text-cyan-400" },
                    { label: "Reward Distribution", value: "Automatic", style: "text-purple-400" },
                    { label: "Average Daily Reward", value: "145.2K USDT", style: "text-cyan-400" },
                    { label: "Block Rewards", value: "Confirmed", style: "text-emerald-400" },
                    { label: "Consensus Model", value: "PoS + Liquidity Proof", style: "text-zinc-300" }
                  ].map((stat, i) => (
                    <div key={i} className="flex items-center justify-between py-1 border-b border-zinc-900/50">
                      <span className="text-zinc-500">{stat.label}</span>
                      <span className={`font-bold ${stat.style}`}>{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* KART 3: LİKVİDLİK MƏNBƏLƏRİ - DONUT QRASİFİ */}
            <div className="bg-[#0b0e14] border border-zinc-800 rounded-xl p-6 flex flex-col justify-between hover:border-zinc-700/50 transition-all duration-300 relative overflow-hidden">
              <div>
                <span className="text-xs text-zinc-400 font-semibold tracking-wider uppercase block mb-4">Liquidity Sources</span>
                
                <div className="flex items-center justify-around gap-2 mt-2">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      {/* Mining Rewards 62% (Cyan) */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#06b6d4" strokeWidth="3" strokeDasharray="62 38" strokeDashoffset="0" />
                      {/* Validator Rewards 18% (Blue) */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#2563eb" strokeWidth="3" strokeDasharray="18 82" strokeDashoffset="-62" />
                      {/* Liquidity Incentives 12% (Purple) */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#8b5cf6" strokeWidth="3" strokeDasharray="12 88" strokeDashoffset="-80" />
                      {/* Bridge Rewards 5% (Amber) */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="5 95" strokeDashoffset="-92" />
                      {/* Treasury 3% (Emerald) */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="3 97" strokeDashoffset="-97" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0b0e14] rounded-full m-3 border border-zinc-900">
                      <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Total</span>
                      <span className="text-sm font-bold text-white font-mono">100%</span>
                    </div>
                  </div>

                  {/* Likvidlik mənbələri göstəriciləri */}
                  <div className="space-y-2 text-[10px] font-mono">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded bg-cyan-500 inline-block"></span>
                      <span className="text-zinc-400">Mining Rewards</span>
                      <span className="text-slate-200 font-bold ml-auto">62%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded bg-blue-600 inline-block"></span>
                      <span className="text-zinc-400">Validator Rewards</span>
                      <span className="text-slate-200 font-bold ml-auto">18%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded bg-purple-500 inline-block"></span>
                      <span className="text-zinc-400">Liquidity Incentives</span>
                      <span className="text-slate-200 font-bold ml-auto">12%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded bg-amber-500 inline-block"></span>
                      <span className="text-zinc-400">Bridge Rewards</span>
                      <span className="text-slate-200 font-bold ml-auto">5%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block"></span>
                      <span className="text-zinc-400">Treasury</span>
                      <span className="text-slate-200 font-bold ml-auto">3%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ƏTRAFLI ANALİTİK VƏ TELEMETRİYA GRİDİ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* SOL SÜTUN: ALLOCATION & HARDWARE MONITOR (8 COL) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* LİKVİDLİK BÖLGÜSÜ (RESERVES) */}
              <div className="bg-[#0b0e14] border border-zinc-800 rounded-xl p-5 hover:border-zinc-700/50 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-300 tracking-wider uppercase">Liquidity Allocation</h3>
                    <p className="text-[10px] text-zinc-500">Asset distribution breakdown for the live platform reserves</p>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono">Dynamic Rebalance System Active</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-xs font-mono">
                  {[
                    { token: "BTC Reserve", value: 18.52, color: "bg-amber-500", raw: "~45,450 BTC" },
                    { token: "ETH Reserve", value: 17.35, color: "bg-indigo-500", raw: "~620,000 ETH" },
                    { token: "USDT Reserve", value: 28.41, color: "bg-emerald-500", raw: "~6,980,000,000 USDT" },
                    { token: "USDC Reserve", value: 15.23, color: "bg-blue-500", raw: "~3,740,000,000 USDC" },
                    { token: "Wrapped Assets", value: 8.74, color: "bg-purple-500", raw: "~2,140,000,000 WBTC/WETH" },
                    { token: "Stablecoin Vault", value: 6.12, color: "bg-cyan-500", raw: "~1,500,000,000 DAI" },
                    { token: "Cross Chain Reserve", value: 3.85, color: "bg-rose-500", raw: "~945,000,000 LINK/AVAX" },
                    { token: "Liquidity Buffer", value: 1.78, color: "bg-teal-500", raw: "~437,000,000 Contingency" }
                  ].map((asset, i) => (
                    <div key={i} className="space-y-1.5 p-2 rounded hover:bg-zinc-900/30 transition-colors">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-300 font-medium flex items-center space-x-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${asset.color}`} />
                          <span>{asset.token}</span>
                        </span>
                        <div className="space-x-1.5 text-right">
                          <span className="text-zinc-500 text-[9px]">{asset.raw}</span>
                          <span className="text-slate-200 font-bold">{asset.value}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-zinc-900/80 h-1.5 rounded-full overflow-hidden">
                        <div className={`${asset.color} h-1.5 rounded-full transition-all duration-1000`} style={{ width: `${asset.value}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* MAJNİNQ PANELDƏ OPERASİYA VƏZİYYƏTİ */}
              <div className="bg-[#0b0e14] border border-zinc-800 rounded-xl p-5 space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                  <div>
                    <h3 className="text-xs font-bold text-slate-300 tracking-wider uppercase flex items-center space-x-1.5">
                      <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <span>Mining Dashboard</span>
                    </h3>
                    <p className="text-[10px] text-zinc-500">Live operational telemetry feed from hardware worker threads</p>
                  </div>
                  <div className="flex items-center space-x-4 text-[10px] font-mono">
                    <span className="text-emerald-400 flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block"></span>
                      <span>Worker Engine Sync Status: Normal</span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Göstərici 1 */}
                  <div className="bg-[#0e1119] border border-zinc-900 p-3.5 rounded-lg text-xs">
                    <div className="text-zinc-500 uppercase text-[9px] tracking-wider">Workers Online</div>
                    <div className="text-xl font-extrabold text-white font-mono mt-1">247</div>
                    <div className="text-[9px] text-zinc-600 mt-2 flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Dedicated Nodes Active</span>
                    </div>
                  </div>

                  {/* Göstərici 2 */}
                  <div className="bg-[#0e1119] border border-zinc-900 p-3.5 rounded-lg text-xs">
                    <div className="text-zinc-500 uppercase text-[9px] tracking-wider">Blocks Validated</div>
                    <div className="text-xl font-extrabold text-white font-mono mt-1">18,524</div>
                    <div className="text-[9px] text-zinc-600 mt-2 flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      <span>Height: {blockHeight}</span>
                    </div>
                  </div>

                  {/* Göstərici 3 */}
                  <div className="bg-[#0e1119] border border-zinc-900 p-3.5 rounded-lg text-xs">
                    <div className="text-zinc-500 uppercase text-[9px] tracking-wider">Pending Rewards</div>
                    <div className="text-xl font-extrabold text-cyan-400 font-mono mt-1">1,254,875.43 <span className="text-[10px] text-zinc-500 font-normal">USDT</span></div>
                    <div className="text-[9px] text-zinc-600 mt-2 flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span>Platform Liquidity Pool</span>
                    </div>
                  </div>

                  {/* Göstərici 4 */}
                  <div className="bg-[#0e1119] border border-zinc-900 p-3.5 rounded-lg text-xs">
                    <div className="text-zinc-500 uppercase text-[9px] tracking-wider">Mining Efficiency</div>
                    <div className="text-xl font-extrabold text-emerald-400 font-mono mt-1">99.94%</div>
                    <div className="text-[9px] text-zinc-600 mt-2 flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>Hash Collision Minimal</span>
                    </div>
                  </div>
                </div>

                {/* Fiziki Node-ların Gücü və Yüklənməsi */}
                <div className="bg-[#080b10] border border-zinc-900 rounded-lg p-4">
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-3">Mainnet Node Hardware Utilization</div>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-xs font-mono">
                    {[
                      { label: "CPU", value: cpuUsage, color: "text-emerald-400", bg: "bg-emerald-500" },
                      { label: "GPU", value: gpuUsage, color: "text-blue-400", bg: "bg-blue-500" },
                      { label: "Memory", value: memoryUsage, color: "text-indigo-400", bg: "bg-indigo-500" },
                      { label: "Bandwidth", value: bandwidthUsage, color: "text-cyan-400", bg: "bg-cyan-500" },
                      { label: "Disk", value: diskUsage, color: "text-purple-400", bg: "bg-purple-500" },
                      { label: "Power Usage", value: powerUsage, color: "text-amber-400", bg: "bg-amber-500" }
                    ].map((hw, idx) => (
                      <div key={idx} className="bg-[#0e1119] p-2.5 rounded border border-zinc-900 text-center">
                        <div className="text-zinc-500 text-[9px] uppercase tracking-wider">{hw.label}</div>
                        <div className={`text-sm font-bold my-1 ${hw.color}`}>{hw.value}%</div>
                        <div className="w-full bg-zinc-950 h-1 rounded-full overflow-hidden">
                          <div className={`${hw.bg} h-1 rounded-full transition-all duration-300`} style={{ width: `${hw.value}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* LİKVİDLİK HOVUZU ANALİTİKLƏRİ */}
              <div className="bg-[#0b0e14] border border-zinc-800 rounded-xl p-5 space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-300 tracking-wider uppercase">Liquidity Pool Analytics</h3>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Real-time charts representing active production yield indexes</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { title: "TVL Growth", percentage: "+24.58%", points: "5,30 20,25 40,35 60,15 80,45 100,20 120,50 140,10 160,40", stroke: "#06b6d4" },
                    { title: "Reward Curve", percentage: "+18.34%", points: "5,45 20,40 40,42 60,30 80,35 100,20 120,22 140,15 160,5", stroke: "#8b5cf6" },
                    { title: "Network Throughput", percentage: "1.24M TPS", points: "5,40 20,45 40,25 60,35 80,10 100,30 120,15 140,25 160,20", stroke: "#f59e0b" }
                  ].map((chart, i) => (
                    <div 
                      key={i} 
                      className="bg-[#0e1119] border border-zinc-900 rounded-lg p-3.5 space-y-3 cursor-pointer hover:border-zinc-700/50 transition-all"
                      onMouseEnter={() => setAnalyticsHoverIndex(i)}
                      onMouseLeave={() => setAnalyticsHoverIndex(null)}
                    >
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-zinc-400 font-medium">{chart.title}</span>
                        <span className="text-emerald-400 font-bold font-mono">{chart.percentage}</span>
                      </div>
                      
                      {/* Vektor şəklində interaktiv analitika qrafikləri */}
                      <div className="h-12 w-full">
                        <svg viewBox="0 0 160 50" className="w-full h-full overflow-visible">
                          <polyline
                            fill="none"
                            stroke={chart.stroke}
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            points={chart.points}
                          />
                          {analyticsHoverIndex === i && (
                            <line x1="80" y1="0" x2="80" y2="50" stroke="#4b5563" strokeDasharray="2" strokeWidth="1" />
                          )}
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* SAĞ SÜTUN: VALİDATOR PANEL VƏ SMART MÜQAVİLƏ GÖSTƏRİCİLƏRİ (4 COL) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* VALİDATOR ŞƏBƏKƏSİ PANALİ */}
              <div className="bg-[#0b0e14] border border-zinc-800 rounded-xl p-5 space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-300 tracking-wider uppercase">Validator Panel</h3>
                  <p className="text-[10px] text-zinc-500">Live state of main liquidity orchestrator node</p>
                </div>

                <div className="flex items-center space-x-3.5 bg-zinc-950 p-3 rounded border border-zinc-900">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <svg className="w-5 h-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-zinc-950"></span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200">Mainnet Gateway #124</div>
                    <span className="text-[10px] text-emerald-400 font-mono">Consensus Node Synced</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  {[
                    { label: "Validator Status", val: "Healthy", style: "text-emerald-400" },
                    { label: "Consensus State", val: "Synced", style: "text-emerald-400" },
                    { label: "Last Block", val: "2 sec ago", style: "text-slate-200" },
                    { label: "Node Reputation", val: "Excellent", style: "text-cyan-400" },
                    { label: "Peer Connections", val: "482 Nodes", style: "text-slate-300" },
                    { label: "Uptime Metric", val: "99.999%", style: "text-emerald-400" },
                    { label: "Jailed / Slashed", val: "0 / 0", style: "text-zinc-500" }
                  ].map((row, i) => (
                    <div key={i} className="flex justify-between items-center py-1.5 border-b border-zinc-900/50">
                      <span className="text-zinc-500">{row.label}</span>
                      <span className={`font-semibold ${row.style}`}>{row.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SMART-MÜQAVİLƏ TƏHLÜKƏSİZLİK ANALİTİKASI */}
              <div className="bg-[#0b0e14] border border-zinc-800 rounded-xl p-5 space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-300 tracking-wider uppercase">Smart Contract Telemetry</h3>
                  <p className="text-[10px] text-zinc-500">Security audits, upgradeability parameters & deployed code</p>
                </div>

                <div className="space-y-2.5 text-xs font-mono">
                  {[
                    { key: "Contract Status", val: "Active Production", style: "text-emerald-400" },
                    { key: "Verified Safe Bytecode", val: "Yes", style: "text-emerald-400" },
                    { key: "Upgradeable Proxy", val: "Yes (Timelock 48h)", style: "text-purple-400" },
                    { key: "Proxy Pattern Enabled", val: "Yes", style: "text-emerald-400" },
                    { key: "Audited Production Build", val: "Yes (Certik + Consensys)", style: "text-emerald-400" },
                    { key: "Mainnet Version Hash", val: "v4.8.2-Release", style: "text-blue-400" },
                    { key: "Gas Optimization Factor", val: "98.9% Perfect", style: "text-emerald-400" }
                  ].map((row, i) => (
                    <div key={i} className="flex justify-between items-center py-1 border-b border-zinc-900/50">
                      <span className="text-zinc-500">{row.key}</span>
                      <span className={`font-semibold ${row.style}`}>{row.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* QLOBAL ŞƏBƏKƏ COĞRAFİYASI */}
              <div className="bg-[#0b0e14] border border-zinc-800 rounded-xl p-5 space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-300 tracking-wider uppercase">Network Overview</h3>
                    <p className="text-[10px] text-zinc-500">Live active server and validator cluster nodes mapped globally</p>
                  </div>
                  <span className="text-[10px] text-cyan-400 font-mono">3 Hubs</span>
                </div>

                {/* Aktiv şəbəkə xəritəsinin topoloji vizualı */}
                <div className="relative h-32 bg-zinc-950 rounded border border-zinc-900 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#1e1b4b_1px,transparent_1px)] [background-size:16px_16px]"></div>
                  
                  <svg className="w-full h-full text-zinc-800" viewBox="0 0 300 120" fill="none" stroke="currentColor">
                    <path d="M 30,50 L 70,30 L 120,60 L 190,20 L 250,80 L 280,30" strokeWidth="1" strokeDasharray="3 3"/>
                    <circle cx="30" cy="50" r="2" fill="#4f46e5" />
                    <circle cx="70" cy="30" r="3" fill="#06b6d4" className="animate-ping" />
                    <circle cx="70" cy="30" r="2.5" fill="#06b6d4" />
                    <circle cx="120" cy="60" r="2" fill="#4f46e5" />
                    <circle cx="190" cy="20" r="3.5" fill="#8b5cf6" className="animate-pulse" />
                    <circle cx="250" cy="80" r="2" fill="#4f46e5" />
                    <circle cx="280" cy="30" r="3" fill="#06b6d4" />
                  </svg>

                  <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-1 rounded text-[9px] font-mono border border-zinc-800 text-zinc-400">
                    S-MAIN-A: <span className="text-emerald-400">Operational</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                  <div className="bg-zinc-950 p-2 rounded border border-zinc-900">
                    <span className="text-zinc-500 block">Total Staked</span>
                    <span className="text-white font-bold font-mono">12.45B USDT</span>
                  </div>
                  <div className="bg-zinc-950 p-2 rounded border border-zinc-900">
                    <span className="text-zinc-500 block">Inflation Rate</span>
                    <span className="text-emerald-400 font-bold font-mono">2.34%</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* SƏNƏDLƏŞDİRİLMİŞ AKTİV TRANZAKSİYALAR */}
          <section className="bg-[#0b0e14] border border-zinc-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <div>
                <h3 className="text-xs font-bold text-slate-300 tracking-wider uppercase flex items-center space-x-1.5">
                  <svg className="w-4.5 h-4.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span>Real-time Platform Transactions Ledger</span>
                </h3>
                <p className="text-[10px] text-zinc-500">Live ledger reflecting production-level digital asset operations and validation states</p>
              </div>
              <span className="text-[9px] text-zinc-400 bg-zinc-900 px-2.5 py-1 rounded font-mono border border-zinc-800/60">
                Auto Updates Live
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="border-b border-zinc-900 text-zinc-500 text-[10px] uppercase tracking-wider">
                    <th className="py-2.5 px-3">Time</th>
                    <th className="py-2.5 px-3">Block</th>
                    <th className="py-2.5 px-3">Operation</th>
                    <th className="py-2.5 px-3">Asset</th>
                    <th className="py-2.5 px-3">Pool Target</th>
                    <th className="py-2.5 px-3">Validator Node</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {transactions.map((tx, idx) => (
                    <tr 
                      key={idx} 
                      className={`hover:bg-zinc-900/40 transition-colors ${idx === 0 ? 'bg-blue-950/10' : ''}`}
                    >
                      <td className="py-3 px-3 text-zinc-400 text-[11px] whitespace-nowrap">{tx.time}</td>
                      <td className="py-3 px-3 text-cyan-500 font-bold">{tx.block}</td>
                      <td className="py-3 px-3 text-slate-200 font-medium whitespace-nowrap">{tx.operation}</td>
                      <td className="py-3 px-3">
                        <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-slate-300">
                          {tx.asset}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-zinc-400">{tx.pool}</td>
                      <td className="py-3 px-3 text-zinc-500 text-[11px]">{tx.validator}</td>
                      <td className={`py-3 px-3 text-right font-bold ${
                        tx.amount.startsWith('+') ? 'text-emerald-400' : tx.amount.startsWith('-') ? 'text-rose-400' : 'text-slate-400'
                      }`}>
                        {tx.amount}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

        </main>

      </div>

      {/* SİSTEMİN DETALLI JURNAL / DEFEF KONSOLU */}
      {showConsole && (
        <div className="border-t border-zinc-800 bg-[#06080b] p-4 text-xs font-mono h-60 flex flex-col justify-between shrink-0 relative z-50">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-2 mb-2">
            <span className="text-cyan-400 font-bold flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block animate-ping"></span>
              <span>AVAE MAINNET PRODUCTION CORE DEPLOYMENT MOTOR CONSOLE</span>
            </span>
            <button 
              onClick={() => setShowConsole(false)}
              className="text-zinc-500 hover:text-slate-200 transition-colors"
            >
              [CLOSE]
            </button>
          </div>
          
          {/* Loqların Azərbaycan dilində izlənilmə pəncərəsi */}
          <div className="flex-1 overflow-y-auto space-y-1.5 text-zinc-400 pr-4 custom-scrollbar bg-black/30 p-2.5 rounded border border-zinc-900/60">
            {logs.map((log, i) => (
              <div key={i} className="text-[11px] leading-relaxed select-text hover:bg-zinc-900/40 p-0.5 rounded">
                <span className="text-zinc-600 mr-2">[{new Date().toLocaleTimeString()}]</span>
                <span className={
                  log.includes('[YENİ TRANZAKSİYA]') ? 'text-indigo-400' :
                  log.includes('[İSTİFADƏÇİ ƏMRİ]') ? 'text-amber-400' :
                  log.includes('optimal') ? 'text-emerald-400' : 'text-zinc-300'
                }>{log}</span>
              </div>
            ))}
          </div>

          <div className="mt-2 pt-2 border-t border-zinc-900 flex justify-between text-[10px] text-zinc-500">
            <span>SYS_MEM_CLEAN: TRUE</span>
            <span>PRODUCTION_ACTIVE_EPOCH: 4122</span>
            <span>THREADS: 18,452/18,452 ONLINE</span>
          </div>
        </div>
      )}

      {/* RƏSMİ APARAT VE SƏYYAH SAYT SONLUĞU (FOOTER) */}
      <footer className="border-t border-zinc-900 bg-black py-2.5 px-6 flex flex-col md:flex-row items-center justify-between text-[10px] font-mono text-zinc-500 relative z-40">
        <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center">
          <span className="flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            <span>Mainnet Production Environment</span>
          </span>
          <span>Secured Liquidity Vaults Active</span>
          <span>Production Build v4.8.2</span>
          <span>Build Date: 2026.07.14</span>
          <span>Engine: Live Production Engine</span>
          <span>Target Cluster: AVAE Primary Cluster</span>
        </div>

        <div className="flex items-center space-x-4 mt-2 md:mt-0">
          <span className="flex items-center space-x-1 text-emerald-400">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>AES-256</span>
          </span>
          <span className="text-blue-400">TLS 1.3 Secure Channels</span>
        </div>
      </footer>

    </div>
  );
}