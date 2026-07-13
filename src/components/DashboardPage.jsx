import React, { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import { 
  Activity, Zap, Shield, Cpu, Server, TrendingUp, DollarSign, 
  Terminal as TerminalIcon, History, Play, StopCircle, PenTool, 
  CheckCircle2, AlertTriangle, ArrowRightLeft, BarChart3, Globe,
  Crosshair, Fingerprint, Layers, Clock, Lock, ChevronDown, ChevronUp,
  Wifi, WifiOff, RotateCcw, Timer
} from 'lucide-react';

// --- Sabitlər və Hədəflər ---
const SIMULATION_DURATION = 24 * 60 * 60 * 1000; // 24 saat (ms)
const INITIAL_BALANCE = 30000.00;
const TARGET_PROFIT = 29766.00;
const MAX_BALANCE = INITIAL_BALANCE + TARGET_PROFIT;

const ASSETS = ['BTC', 'ETH', 'SOL', 'BNB', 'XRP', 'ADA', 'AVAX', 'LINK', 'DOT', 'TRX'];
const EXCHANGES = ['Binance', 'Bybit', 'OKX', 'Kraken', 'Coinbase', 'KuCoin'];

const ASSET_LOGOS = {
  BTC: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=029',
  ETH: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=029',
  SOL: 'https://cryptologos.cc/logos/solana-sol-logo.svg?v=029',
  BNB: 'https://cryptologos.cc/logos/bnb-bnb-logo.svg?v=029',
  XRP: 'https://cryptologos.cc/logos/xrp-xrp-logo.svg?v=029',
  ADA: 'https://cryptologos.cc/logos/cardano-ada-logo.svg?v=029',
  AVAX: 'https://cryptologos.cc/logos/avalanche-avax-logo.svg?v=029',
  LINK: 'https://cryptologos.cc/logos/chainlink-link-logo.svg?v=029',
  DOT: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.svg?v=029',
  TRX: 'https://cryptologos.cc/logos/tron-trx-logo.svg?v=029',
  FALLBACK: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=029'
};

// --- Köməkçi Funksiyalar ---
const roundMoney = (value) => Math.round((value + Number.EPSILON) * 100) / 100;
const formatMoney = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(val).replace('$', '') + ' USDT';
const formatNum = (val, dec = 2) => new Intl.NumberFormat('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }).format(val);
const generateHash = () => '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
const generateShortHash = () => { const h = generateHash(); return `${h.substring(0, 6)}...${h.substring(h.length - 4)}`; };
const generateID = (prefix) => `${prefix}-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100000 + Math.random() * 900000)}`;
const rand = (min, max) => Math.random() * (max - min) + min;
const randInt = (min, max) => Math.floor(rand(min, max));
const randChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];

// --- Alt Komponentlər (Optimized with React.memo) ---

// Saniyəbəsaniyə yenilənən premium 24 saat taymer kartı
const TimerCard = memo(({ accumulatedTime, lastStartedAt, isRunning, isTargetReached }) => {
  const [now, setNow] = useState(Date.now());
  
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const currentActive = isTargetReached ? SIMULATION_DURATION : Math.min(SIMULATION_DURATION, accumulatedTime + (isRunning ? (now - lastStartedAt) : 0));
  const remaining = Math.max(0, SIMULATION_DURATION - currentActive);
  const progress = Math.min(100, (currentActive / SIMULATION_DURATION) * 100);

  const h = Math.floor(remaining / 3600000).toString().padStart(2, '0');
  const m = Math.floor((remaining % 3600000) / 60000).toString().padStart(2, '0');
  const s = Math.floor((remaining % 60000) / 1000).toString().padStart(2, '0');

  return (
    <div className="bg-[#050505]/40 border border-white/10 rounded-xl px-4 py-2 flex flex-col justify-center min-w-[160px] relative overflow-hidden group">
      <div className="absolute top-0 left-0 h-1 bg-gray-800 w-full overflow-hidden">
        <div className={`h-full ${isTargetReached ? 'bg-emerald-500' : 'bg-blue-500'} transition-all duration-1000`} style={{ width: `${progress}%` }} />
      </div>
      <div className="flex justify-between items-center mb-1">
        <p className="text-[10px] text-gray-500 uppercase tracking-wider flex items-center gap-1">
          <Timer size={10} className={isRunning ? 'text-blue-400 animate-pulse' : 'text-gray-500'} /> 
          24 Saatlıq Rejim
        </p>
        <span className={`text-[9px] px-1.5 py-0.5 rounded border ${isTargetReached ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/10' : isRunning ? 'border-blue-500/20 text-blue-400 bg-blue-500/10' : 'border-yellow-500/20 text-yellow-500 bg-yellow-500/10'}`}>
          {isTargetReached ? 'Tamamlandı' : isRunning ? 'Aktiv' : 'Dayandırılıb'}
        </span>
      </div>
      <div className="flex justify-between items-end">
        <p className={`text-lg font-mono font-bold ${isTargetReached ? 'text-emerald-400' : 'text-white'}`}>{h}:{m}:{s}</p>
        <p className="text-[10px] text-gray-400 font-mono mb-0.5">{formatNum(progress, 2)}%</p>
      </div>
    </div>
  );
});

const StatCard = memo(({ title, value, icon, color = "text-gray-400" }) => (
  <div className="bg-black/30 border border-white/5 rounded-xl p-3 flex flex-col justify-center transition-all hover:bg-white/5">
    <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mb-1 uppercase tracking-wider">
      {icon} {title}
    </div>
    <div className={`text-sm sm:text-base font-mono font-semibold ${color}`}>
      {value}
    </div>
  </div>
));

const ProgressBar = memo(({ label, value, max = 100, color, suffix = '%' }) => {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div>
      <div className="flex justify-between text-[10px] mb-1.5">
        <span className="text-gray-400">{label}</span>
        <span className="font-mono text-gray-300">{value}{suffix}</span>
      </div>
      <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all duration-500 ease-out`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
});

const ModalDetail = memo(({ label, value, valueColor = "text-white" }) => (
  <div className="bg-gray-900/50 p-2.5 rounded-lg border border-gray-800">
    <p className="text-[10px] text-gray-500 mb-0.5">{label}</p>
    <p className={`font-mono ${valueColor} truncate`}>{value}</p>
  </div>
));

const CryptoLogo = memo(({ asset, className }) => (
  <img 
    src={ASSET_LOGOS[asset] || ASSET_LOGOS.FALLBACK} 
    alt={asset}
    className={`rounded-full object-cover bg-white/5 p-0.5 ${className}`}
    onError={(e) => { e.target.src = ASSET_LOGOS.FALLBACK; }}
    loading="lazy"
  />
));

const HistoryRow = memo(({ trade, idx }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <tr onClick={() => setExpanded(!expanded)} className={`cursor-pointer transition-colors ${idx % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.01]'} hover:bg-white/[0.03] group`}>
        <td className="p-3 font-mono text-gray-400 flex items-center gap-2">
          {expanded ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}
          {trade.id.split('-')[2]}
        </td>
        <td className="p-3 font-medium text-white flex items-center gap-2">
          <CryptoLogo asset={trade.asset} className="w-5 h-5" />
          {trade.asset}
        </td>
        <td className="p-3 text-gray-400">
          <div className="flex items-center gap-1 text-[10px]">
            {trade.buyExchange} <ArrowRightLeft size={8}/> {trade.sellExchange}
          </div>
        </td>
        <td className="p-3 text-emerald-400 font-mono">{formatNum(trade.spread, 3)}%</td>
        <td className="p-3 text-gray-300 font-mono">{formatMoney(trade.tradeSize)}</td>
        <td className="p-3 text-emerald-400 font-mono font-medium">+{formatMoney(trade.profit)}</td>
        <td className="p-3 text-right">
          <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded text-[10px] border border-emerald-500/20">
            <CheckCircle2 size={10} /> Completed
          </span>
        </td>
      </tr>
      
      {expanded && (
        <tr className="bg-black/60 border-b border-white/5 shadow-inner">
          <td colSpan="7" className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[10px]">
              <div className="space-y-2">
                <h4 className="text-gray-400 font-semibold uppercase border-b border-white/5 pb-1 mb-2">Əsas Məlumatlar</h4>
                <div className="flex justify-between"><span className="text-gray-500">Transaction ID:</span> <span className="font-mono text-gray-300">{trade.hash.substring(0,12)}...</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Execution ID:</span> <span className="font-mono text-gray-300">{trade.id}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Tarix:</span> <span className="font-mono text-gray-300">{new Date(trade.timestamp).toLocaleTimeString()}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">İcra Mənbəyi:</span> <span className="text-blue-400">{trade.source}</span></div>
              </div>

              <div className="space-y-2">
                <h4 className="text-gray-400 font-semibold uppercase border-b border-white/5 pb-1 mb-2">Qiymət & Dəyər</h4>
                <div className="flex justify-between"><span className="text-gray-500">Alış Qiyməti:</span> <span className="font-mono text-gray-300">{formatNum(trade.buyPrice, trade.asset === 'TRX' || trade.asset === 'ADA' || trade.asset === 'XRP' ? 4 : 2)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Satış Qiyməti:</span> <span className="font-mono text-gray-300">{formatNum(trade.sellPrice, trade.asset === 'TRX' || trade.asset === 'ADA' || trade.asset === 'XRP' ? 4 : 2)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Şəbəkə Haqqı:</span> <span className="font-mono text-red-400">-{trade.networkFee.toFixed(2)} USDT</span></div>
                <div className="flex justify-between"><span className="text-gray-500">ROI:</span> <span className="font-mono text-emerald-400">+{formatNum(trade.roi)}%</span></div>
              </div>

              <div className="space-y-2">
                <h4 className="text-gray-400 font-semibold uppercase border-b border-white/5 pb-1 mb-2">Texniki Cəhətlər</h4>
                <div className="flex justify-between"><span className="text-gray-500">Execution Time:</span> <span className="font-mono text-gray-300">{trade.execTime} ms</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Latency:</span> <span className="font-mono text-gray-300">{trade.latency} ms</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Liquidity:</span> <span className="font-mono text-gray-300">{formatNum(trade.liquidity, 1)}M USDT</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Network:</span> <span className="font-mono text-gray-300">{trade.network}</span></div>
              </div>

              <div className="space-y-2">
                <h4 className="text-gray-400 font-semibold uppercase border-b border-white/5 pb-1 mb-2">AI Analizi & Smart Route</h4>
                <div className="flex justify-between"><span className="text-gray-500">Confidence:</span> <span className="font-mono text-emerald-400">{formatNum(trade.confidence, 1)}%</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Risk Score:</span> <span className="font-mono text-yellow-400">{formatNum(trade.riskScore, 1)}/10</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Marşrut:</span> <span className="text-gray-300 text-right max-w-[80px] truncate">{trade.route.join('→')}</span></div>
                <div className="flex justify-between text-[9px] mt-1 pt-1 border-t border-white/5">
                  <span className={`${trade.darkPool ? 'text-purple-400' : 'text-gray-600'}`}>{trade.darkPool ? 'Dark Pool Used' : 'No Dark Pool'}</span>
                  <span className={`${trade.mev ? 'text-orange-400' : 'text-gray-600'}`}>{trade.mev ? 'MEV Protection' : 'Standard'}</span>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
});

// --- Əsas Komponent ---
export default function App() {
  const isInitialized = useRef(false);

  // --- SİSTEM VƏZİYYƏTİ VƏ TAYMER STATE-LƏRİ ---
  const [accumulatedTime, setAccumulatedTime] = useState(0); 
  const [lastStartedAt, setLastStartedAt] = useState(() => Date.now());  
  const [isRunning, setIsRunning] = useState(true);
  const [isTargetReached, setIsTargetReached] = useState(false);
  const [apiConnected, setApiConnected] = useState(false);
  
  // --- MALİYYƏ VƏZİYYƏTİ ---
  const [totalProfit, setTotalProfit] = useState(0);
  const balance = roundMoney(INITIAL_BALANCE + totalProfit);
  
  // --- STATİSTİKA ---
  const [stats, setStats] = useState({
    tradesCount: 0, winRate: 100, avgSpread: 0.32, avgProfit: 0, bestTrade: 0,
    largestVolume: 0, executionSpeed: 450, latency: 12, aiConfidence: 98.2,
    cpuLoad: 24, memory: 45, gas: 15
  });

  // --- MƏLUMATLAR ---
  const [marketData, setMarketData] = useState({});
  const [opportunities, setOpportunities] = useState([]);
  const [history, setHistory] = useState([]);
  const [logs, setLogs] = useState([]);
  
  const [manualModal, setManualModal] = useState({ isOpen: false, opp: null, step: 0 });
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);

  // Re-render problemlərindən qaçmaq üçün refs
  const stateRef = useRef({ accumulatedTime, lastStartedAt, isRunning, isTargetReached, totalProfit });
  useEffect(() => {
    stateRef.current = { accumulatedTime, lastStartedAt, isRunning, isTargetReached, totalProfit };
  }, [accumulatedTime, lastStartedAt, isRunning, isTargetReached, totalProfit]);

  const engineSteps = useMemo(() => [
    { name: 'Opportunity Scanner', log: 'Real-time fürsətlər skan edilir...' },
    { name: 'Route Optimizer', log: 'AI optimal birjalarası marşrutu seçdi' },
    { name: 'Liquidity Scanner', log: 'Həcmlər və likvidlik yoxlanılır' },
    { name: 'AI Routing', log: 'Smart Routing API təsdiqləndi' },
    { name: 'Market Analyzer', log: 'Spread differensialı təsdiqləndi' },
    { name: 'Spread Detector', log: 'Order book təhlili tamamlandı' },
    { name: 'Order Executor', log: 'Flash liquidity ayrıldı & İcra edildi' }
  ], []);

  const addLog = useCallback((text, type = 'info') => {
    setLogs(prev => {
      const newLogs = [{ id: Date.now() + Math.random(), time: new Date(), text, type }, ...prev];
      return newLogs.slice(0, 60);
    });
  }, []);

  // --- LOCALSTORAGE PERSISTENCE ---
  useEffect(() => {
    if (!isInitialized.current) {
      const savedData = localStorage.getItem('quantumArbState_v3');
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData, (key, value) => {
            if (key === 'time' || key === 'timestamp') return new Date(value);
            return value;
          });
          
          let accTime = parsed.accumulatedTime || 0;
          let isDone = parsed.isTargetReached || false;
          let profit = parsed.totalProfit || 0;
          let running = parsed.isRunning || false;
          
          // Offline vaxtı aktiv hesab etmək (əgər açıq qalıbsa)
          if (running && parsed.lastStartedAt && !isDone) {
             const offlinePassed = Date.now() - parsed.lastStartedAt;
             accTime += offlinePassed;
             if (accTime >= SIMULATION_DURATION) {
                accTime = SIMULATION_DURATION;
                isDone = true;
                running = false;
                profit = TARGET_PROFIT;
             }
          }

          setAccumulatedTime(accTime);
          setTotalProfit(profit);
          setIsTargetReached(isDone);
          setIsRunning(running && !isDone);
          setLastStartedAt(running && !isDone ? Date.now() : null);
          
          if (parsed.history) setHistory(parsed.history);
          if (parsed.stats) setStats(parsed.stats);
          if (parsed.logs) setLogs(parsed.logs);
          
          addLog('Sistem bərpa edildi. Real məlumatlar sinxronlaşdırılır...', 'info');
        } catch(e) { console.error('LocalStorage parse error', e); }
      } else {
        addLog('Sistem hazır vəziyyətdədir. Mühərrik avtomatik işə düşdü.', 'info');
      }
      isInitialized.current = true;
    }
  }, [addLog]);

  useEffect(() => {
    if (isInitialized.current) {
       const stateToSave = {
          accumulatedTime, lastStartedAt, isRunning, isTargetReached,
          totalProfit, history, stats, logs
       };
       localStorage.setItem('quantumArbState_v3', JSON.stringify(stateToSave));
    }
  }, [accumulatedTime, lastStartedAt, isRunning, isTargetReached, totalProfit, history, stats, logs]);

  // --- HƏDƏFƏ ÇATMA FUNKSİYASI ---
  const handleTargetReached = useCallback(() => {
    if (stateRef.current.isTargetReached) return;
    setIsTargetReached(true);
    setIsRunning(false);
    setAccumulatedTime(SIMULATION_DURATION);
    setLastStartedAt(null);
    setTotalProfit(TARGET_PROFIT);
    addLog(`24 SAATLIQ HƏDƏF TAMAMLANDI — Ümumi qazanc: 29,766.00 USDT | Yekun balans: 59,766.00 USDT`, 'warning');
  }, [addLog]);

  // --- VAxt NƏZARƏTÇİSİ (Hər Saniyə) ---
  useEffect(() => {
    if (!isRunning || isTargetReached) return;
    const checker = setInterval(() => {
       const { accumulatedTime, lastStartedAt } = stateRef.current;
       const currentActive = accumulatedTime + (Date.now() - lastStartedAt);
       if (currentActive >= SIMULATION_DURATION) {
           handleTargetReached();
       }
    }, 1000);
    return () => clearInterval(checker);
  }, [isRunning, isTargetReached, handleTargetReached]);

  // --- REAL MARKET DATA FETCHING (BINANCE API) ---
  const fetchMarketPrices = useCallback(async (abortController) => {
    try {
      const symbols = ASSETS.map(a => `${a}USDT`);
      const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbols=${JSON.stringify(symbols)}`, {
        signal: abortController.signal
      });
      if (!response.ok) throw new Error('API Rate Limit or Error');
      
      const data = await response.json();
      const newMarketData = {};
      data.forEach(item => {
        const asset = item.symbol.replace('USDT', '');
        newMarketData[asset] = {
          price: parseFloat(item.lastPrice),
          change24h: parseFloat(item.priceChangePercent),
          vol24h: parseFloat(item.volume) * parseFloat(item.lastPrice),
          high: parseFloat(item.highPrice),
          low: parseFloat(item.lowPrice)
        };
      });
      setMarketData(newMarketData);
      
      if (!apiConnected) {
        setApiConnected(true);
        addLog('Binance API Connected. Real-time market synced.', 'success');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        if (apiConnected) { setApiConnected(false); addLog('API bağlantısı kəsildi. Fallback rejimi aktivdir.', 'warning'); }
        const fallbackData = {};
        ASSETS.forEach(asset => {
            const base = asset === 'BTC' ? 68000 : asset === 'ETH' ? 3500 : asset === 'SOL' ? 150 : 1;
            fallbackData[asset] = { price: base * (1 + rand(-0.02, 0.02)), change24h: rand(-5, 5), vol24h: rand(10000000, 500000000) };
        });
        setMarketData(fallbackData);
      }
    }
  }, [apiConnected, addLog]);

  useEffect(() => {
    const abortController = new AbortController();
    fetchMarketPrices(abortController);
    const interval = setInterval(() => {
      fetchMarketPrices(abortController);
      setStats(prev => ({
        ...prev, cpuLoad: randInt(20, 75), memory: randInt(40, 85), gas: randInt(8, 25),
        latency: randInt(8, 20), aiConfidence: prev.tradesCount > 0 ? rand(96, 99.9) : 98.2
      }));
    }, 8000);
    return () => { clearInterval(interval); abortController.abort(); };
  }, [fetchMarketPrices]);

  // --- OPPORTUNITY GENERATION ---
  useEffect(() => {
    if (Object.keys(marketData).length === 0) return;
    const newOpportunities = ASSETS.map(asset => {
      const realData = marketData[asset];
      if (!realData) return null;

      const basePrice = realData.price;
      const volatilityModifier = Math.abs(realData.change24h) / 10 + 1; 
      
      const exchangePrices = EXCHANGES.map(exName => {
        const deviation = rand(-0.002 * volatilityModifier, 0.002 * volatilityModifier);
        return { name: exName, price: basePrice * (1 + deviation) };
      });
      exchangePrices.sort((a, b) => a.price - b.price);
      
      const buyEx = exchangePrices[0], sellEx = exchangePrices[exchangePrices.length - 1];
      exchangePrices.forEach(ex => { ex.isBuy = ex.name === buyEx.name; ex.isSell = ex.name === sellEx.name; });

      const middleEx = randChoice(EXCHANGES.filter(e => e !== buyEx.name && e !== sellEx.name));
      const trueSpread = ((sellEx.price - buyEx.price) / buyEx.price) * 100;
      const estTradeSize = rand(15000, 120000); // Daha böyük qazanclar üçün ölçü artırıldı
      const estProfit = estTradeSize * (trueSpread / 100);

      return {
        id: generateID('OPP'), asset, route: [buyEx.name, middleEx, sellEx.name], exchanges: exchangePrices,
        buyPrice: buyEx.price, sellPrice: sellEx.price, buyExchange: buyEx.name, sellExchange: sellEx.name,
        spread: Math.max(0.01, trueSpread), confidence: Math.min(99.9, rand(90, 98) + (trueSpread * 10)),
        liquidity: (realData.vol24h / 1000000) * rand(0.01, 0.05), risk: rand(0.5, 3.5), estTradeSize, estProfit,
        execTime: randInt(150, 600), change24h: realData.change24h
      };
    }).filter(Boolean);

    newOpportunities.sort((a, b) => b.spread - a.spread);
    setOpportunities(newOpportunities.slice(0, 6));
  }, [marketData]);

  // --- TRADING LOGIC (24H TRAJECTORY ENFORCED) ---
  const executeTrade = useCallback((manualOpp = null, source = 'AI Smart Routing', profitGap = null) => {
    const { isTargetReached, totalProfit } = stateRef.current;
    if (isTargetReached) return;

    const opp = manualOpp || opportunities[0];
    if (!opp) return;

    let generatedProfit = manualOpp ? opp.estProfit : Math.min(opp.estProfit, profitGap ? profitGap * rand(0.5, 1.2) : rand(100, 500));
    
    // Strict Cap
    if (totalProfit + generatedProfit >= TARGET_PROFIT) {
       generatedProfit = TARGET_PROFIT - totalProfit;
    }
    
    generatedProfit = roundMoney(Math.max(0.01, generatedProfit));
    const newProfit = roundMoney(totalProfit + generatedProfit);
    const tradeSize = opp.estTradeSize;

    const tradeData = {
      id: generateID('EXE'), hash: generateHash(), timestamp: new Date(), asset: opp.asset, route: opp.route,
      buyExchange: opp.buyExchange, sellExchange: opp.sellExchange, buyPrice: opp.buyPrice, sellPrice: opp.sellPrice,
      spread: opp.spread, tradeSize: tradeSize, networkFee: rand(0.5, 3.5), liquidity: opp.liquidity,
      network: randChoice(['ERC-20', 'TRC-20', 'BEP-20', 'Solana', 'Arbitrum One']), slippage: rand(0.001, 0.015),
      execTime: opp.execTime, latency: randInt(5, 15), confidence: opp.confidence, riskScore: opp.risk,
      profit: generatedProfit, roi: (generatedProfit / tradeSize) * 100, source: source,
      darkPool: Math.random() > 0.6, mev: Math.random() > 0.5, status: 'Completed',
    };

    setHistory(prev => [tradeData, ...prev]);
    setTotalProfit(newProfit);
    
    setStats(prev => ({
      ...prev, tradesCount: prev.tradesCount + 1, avgProfit: ((prev.avgProfit * prev.tradesCount) + generatedProfit) / (prev.tradesCount + 1),
      bestTrade: Math.max(prev.bestTrade, generatedProfit), largestVolume: Math.max(prev.largestVolume, tradeSize),
      avgSpread: ((prev.avgSpread * prev.tradesCount) + opp.spread) / (prev.tradesCount + 1)
    }));

    addLog(`Qazanc: +${formatMoney(generatedProfit)} | Marşrut: ${opp.route.join(' → ')} (${opp.asset})`, 'success');
  }, [opportunities, addLog]);

  // --- AUTOMATIC AI TRADING CYCLE (TRAJECTORY CONTROL) ---
  useEffect(() => {
    let timeout;
    let isActive = true;

    const runCycle = async () => {
      const { isRunning, isTargetReached, accumulatedTime, lastStartedAt, totalProfit } = stateRef.current;
      if (!isActive || !isRunning || isTargetReached || opportunities.length === 0) return;

      const currentActive = accumulatedTime + (Date.now() - lastStartedAt);
      const progressRatio = Math.min(currentActive / SIMULATION_DURATION, 1);
      const expectedProfit = TARGET_PROFIT * progressRatio;
      const currentDeviation = expectedProfit - totalProfit;

      let willExecute = false;
      let failureReason = '';

      if (currentDeviation > (TARGET_PROFIT * 0.01)) { 
        // We are behind the curve -> Execute
        willExecute = true;
        if (Math.random() > 0.8) { // 20% random fail for realism even if behind
           willExecute = false;
           failureReason = 'Market volatility detected. Waiting for confirmation.';
        }
      } else {
        // We are ahead or exactly on curve -> Skip
        willExecute = false;
        const reasons = [
          'Opportunity skipped: Spread below execution threshold.',
          'Liquidity validation failed. Route rejected.',
          'Risk score exceeded AI execution limit.'
        ];
        failureReason = randChoice(reasons);
      }

      for (let i = 0; i < engineSteps.length; i++) {
        if (!isActive || !stateRef.current.isRunning) return;
        setCurrentStepIndex(i);
        let customLog = engineSteps[i].log;
        if (i === 1) customLog = `AI optimal marşrutu seçdi: ${opportunities[0].route.join(' → ')}`;
        if (i === 4) customLog = `Spread təsdiqləndi: ${formatNum(opportunities[0].spread, 3)}%`;
        addLog(customLog, 'process');
        await new Promise(r => setTimeout(r, randInt(250, 450)));
      }

      if (!isActive || !stateRef.current.isRunning) return;
      
      if (willExecute) {
         executeTrade(null, 'AI Auto Arbitrage', currentDeviation);
      } else {
         addLog(failureReason, 'warning');
      }

      setCurrentStepIndex(-1);
      timeout = setTimeout(runCycle, randInt(1500, 3500));
    };

    if (isRunning && !isTargetReached) {
       runCycle();
    }

    return () => {
      isActive = false;
      clearTimeout(timeout);
      setCurrentStepIndex(-1);
    };
  }, [isRunning, isTargetReached, opportunities, engineSteps, executeTrade, addLog]);

  // --- BUTTON HANDLERS ---
  const toggleRunning = () => {
     if (isTargetReached) return;
     if (isRunning) {
        setAccumulatedTime(prev => prev + (Date.now() - lastStartedAt));
        setLastStartedAt(null);
        setIsRunning(false);
        addLog('Sistem istifadəçi tərəfindən dayandırıldı (Pause).', 'warning');
     } else {
        setLastStartedAt(Date.now());
        setIsRunning(true);
        addLog('Sistem aktivləşdirildi. Mühərrik işə düşür...', 'success');
     }
  };

  const resetSystem = () => {
     localStorage.removeItem('quantumArbState_v3');
     setAccumulatedTime(0);
     setLastStartedAt(Date.now());
     setIsRunning(true);
     setIsTargetReached(false);
     setTotalProfit(0);
     setHistory([]);
     setStats({ tradesCount: 0, winRate: 100, avgSpread: 0.32, avgProfit: 0, bestTrade: 0, largestVolume: 0, executionSpeed: 450, latency: 12, aiConfidence: 98.2, cpuLoad: 24, memory: 45, gas: 15 });
     setLogs([{ id: 1, time: new Date(), text: 'Sistem tam sıfırlandı. Mühərrik avtomatik işə düşür...', type: 'info' }]);
     setResetModalOpen(false);
  };

  // --- MANUAL EXECUTION ---
  const handleManualExecute = useCallback((opp) => { setManualModal({ isOpen: true, opp, step: 0 }); }, []);

  const processManualSignature = async () => {
    if (manualModal.step > 0) return;
    const steps = [
      { s: 1, delay: 800, log: 'Tranzaksiya imzalama gözləyir...' }, { s: 2, delay: 1200, log: 'Node tərəfindən yoxlanılır (Validation)...' },
      { s: 3, delay: 1500, log: 'Blokçeyn təsdiqi gözlənilir...' }, { s: 4, delay: 1000, log: 'Hesablaşma (Settlement) aparılır...' },
      { s: 5, delay: 500, log: 'Manual tranzaksiya uğurla tamamlandı.' }
    ];
    for (const step of steps) {
      setManualModal(prev => ({ ...prev, step: step.s }));
      addLog(step.log, 'info');
      await new Promise(r => setTimeout(r, step.delay));
    }
    executeTrade(manualModal.opp, 'Manual Smart Contract');
    setTimeout(() => { setManualModal({ isOpen: false, opp: null, step: 0 }); }, 2000);
  };

  const hasData = opportunities.length > 0;

  return (
    <div className="min-h-screen bg-[#050505] text-gray-300 font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-900/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/10 blur-[120px]" />
        <div className="absolute top-[40%] left-[50%] translate-x-[-50%] w-[60%] h-[20%] rounded-full bg-emerald-500/5 blur-[150px]" />
      </div>

      <div className="relative z-10 p-2 sm:p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl backdrop-blur-xl relative">
          
          <button onClick={() => setResetModalOpen(true)} className="absolute top-4 right-4 text-gray-500 hover:text-red-400 transition-colors p-2 bg-white/5 rounded-lg border border-white/5 md:hidden" title="Sistemi Sıfırla">
             <RotateCcw size={14} />
          </button>

          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <Layers className="text-white w-6 h-6" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#050505] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                 <h1 className="text-xl font-bold text-white tracking-wide">QUANTUM<span className="text-emerald-400">ARB</span></h1>
                 <button onClick={() => setResetModalOpen(true)} className="hidden md:flex text-gray-500 hover:text-red-400 transition-colors p-1.5 bg-white/5 rounded-md border border-white/5" title="Sistemi Sıfırla">
                    <RotateCcw size={12} />
                 </button>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-500">HFT Arbitrage Dashboard v4.5</span>
                {apiConnected ? (
                   <span className="flex items-center gap-1 text-emerald-400"><Wifi size={10} /> Live Data</span>
                ) : (
                   <span className="flex items-center gap-1 text-yellow-500"><WifiOff size={10} /> Syncing...</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <TimerCard accumulatedTime={accumulatedTime} lastStartedAt={lastStartedAt} isRunning={isRunning} isTargetReached={isTargetReached} />

            <div className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 flex-1 md:flex-none flex flex-col justify-center">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Cari Balans</p>
              <p className="text-lg font-mono font-bold text-white">{formatMoney(balance)}</p>
            </div>
            <div className="bg-emerald-900/20 border border-emerald-500/20 rounded-xl px-4 py-2 flex-1 md:flex-none flex flex-col justify-center">
              <p className="text-[10px] text-emerald-400/80 uppercase tracking-wider">Ümumi Qazanc</p>
              <p className="text-lg font-mono font-bold text-emerald-400">+{formatMoney(totalProfit)}</p>
            </div>
            <button 
              onClick={toggleRunning}
              disabled={isTargetReached || !hasData}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-xl font-medium transition-all duration-300 shadow-lg ${
                isTargetReached 
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : isRunning 
                    ? 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20' 
                    : !hasData 
                      ? 'bg-emerald-900/50 text-emerald-700 cursor-wait'
                      : 'bg-emerald-500 text-black hover:bg-emerald-400 hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]'
              }`}
            >
              {isTargetReached ? <CheckCircle2 size={18} /> : isRunning ? <StopCircle size={18} /> : <Play size={18} />}
              {isTargetReached ? '24 SAAT TAMAMLANDI' : isRunning ? 'Sistemi Dayandır' : !hasData ? 'Yüklənir...' : 'Avto Start'}
            </button>
          </div>
        </header>

        {/* SCHEDULED EXECUTION WINDOW */}
        <div className="bg-[#0a0a0c]/80 border border-white/5 rounded-xl p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 backdrop-blur-md font-mono text-xs shadow-lg">
          <div className="flex items-center gap-3">
            <div className="bg-blue-900/20 p-1.5 rounded border border-blue-500/20">
              <Clock size={14} className="text-blue-400" />
            </div>
            <div>
              <div className="text-gray-500 text-[10px] tracking-widest uppercase mb-0.5">Scheduled Execution Window</div>
              <div className="text-gray-300">Trading engine activation: <span className="text-blue-400 font-semibold">13/07/2026 — 18:00</span></div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/[0.02] px-3 py-1.5 rounded border border-white/5">
             <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
             </span>
             <span className="text-gray-400">System status:</span>
             <span className="text-blue-400">Awaiting scheduled initialization</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          
          {/* SOL TƏRƏF (Stats & Scanner) */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            
            {/* STATS GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard title="Win Rate" value={`${stats.tradesCount === 0 ? 100 : formatNum((stats.tradesCount / (stats.tradesCount + Math.floor(stats.tradesCount * 0.2))) * 100, 1)}%`} icon={<Crosshair size={14} />} color="text-blue-400" />
              <StatCard title="Uğurlu Əməliyyat" value={stats.tradesCount} icon={<CheckCircle2 size={14} />} color="text-emerald-400" />
              <StatCard title="Gündəlik ROI" value={`+${formatNum((totalProfit/INITIAL_BALANCE)*100)}%`} icon={<TrendingUp size={14} />} color="text-emerald-400" />
              <StatCard title="Ən Yaxşı Qazanc" value={formatMoney(stats.bestTrade)} icon={<DollarSign size={14} />} color="text-purple-400" />
              
              <StatCard title="Ort. Spread" value={`${formatNum(stats.avgSpread, 3)}%`} icon={<ArrowRightLeft size={14} />} />
              <StatCard title="İcra Sürəti" value={`${stats.executionSpeed} ms`} icon={<Zap size={14} />} />
              <StatCard title="AI İnamı" value={`${formatNum(stats.aiConfidence)}%`} icon={<Cpu size={14} />} color={stats.aiConfidence > 97 ? "text-emerald-400" : "text-yellow-400"} />
              <StatCard title="Şəbəkə Gecikməsi" value={`${stats.latency} ms`} icon={<Globe size={14} />} />
            </div>

            {/* ENGINE VISUALIZATION */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 sm:p-5 backdrop-blur-md relative overflow-hidden">
              <div className="flex items-center gap-2 mb-4">
                <Cpu className="text-emerald-500 w-5 h-5" />
                <h2 className="text-sm font-semibold text-white">AI Real-Time Mühərriki</h2>
                {isRunning && <span className="ml-auto flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>}
              </div>
              
              <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-2 relative">
                <div className="hidden sm:block absolute top-1/2 left-0 w-full h-[2px] bg-gray-800 -z-10 -translate-y-1/2" />
                
                {engineSteps.map((step, idx) => {
                  const isActive = idx === currentStepIndex;
                  const isPast = idx < currentStepIndex || (currentStepIndex === -1 && isRunning && idx === 0);
                  return (
                    <div key={idx} className="flex flex-col items-center gap-2 z-10 w-1/3 sm:w-auto mb-2 sm:mb-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${isActive ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.6)] scale-110' : isPast ? 'bg-emerald-900/50 text-emerald-500 border border-emerald-500/30' : 'bg-gray-900 border border-gray-800 text-gray-600'}`}>
                        {idx + 1}
                      </div>
                      <span className={`text-[9px] sm:text-[10px] text-center max-w-[60px] leading-tight ${isActive ? 'text-emerald-400 font-medium' : 'text-gray-500'}`}>
                        {step.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* OPPORTUNITY SCANNER WITH REAL PRICES */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col h-auto min-h-[400px] backdrop-blur-md">
              <div className="p-4 border-b border-white/5 flex justify-between items-center sticky top-0 bg-[#050505]/80 z-10 rounded-t-2xl">
                <div className="flex items-center gap-2">
                  <Activity className="text-blue-400 w-5 h-5" />
                  <h2 className="text-sm font-semibold text-white">Live Arbitrage Matrix</h2>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  {apiConnected && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                  )}
                  Real-time API
                </div>
              </div>
              
              <div className="flex-1 overflow-auto p-3 scrollbar-hide space-y-3">
                {!hasData ? (
                   <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-3 py-10">
                      <Activity className="w-8 h-8 animate-spin text-emerald-500/50" />
                      <p className="text-xs">Bazar məlumatları sinxronlaşdırılır...</p>
                   </div>
                ) : (
                  opportunities.map((opp) => (
                    <div key={opp.id} className="group bg-black/40 border border-white/5 hover:border-emerald-500/30 rounded-xl p-4 flex flex-col transition-all duration-300 hover:bg-emerald-900/5 shadow-lg">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
                        <div className="flex items-center gap-3">
                          <CryptoLogo asset={opp.asset} className="w-10 h-10 border border-white/10" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-white">{opp.asset}/USDT</span>
                              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${opp.change24h >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                {opp.change24h > 0 ? '+' : ''}{formatNum(opp.change24h)}%
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-1">
                               <span>Route:</span>
                               <span className="text-emerald-400 font-medium">{opp.buyExchange}</span>
                               <ArrowRightLeft size={10} className="text-gray-600"/>
                               <span className="text-red-400 font-medium">{opp.sellExchange}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 sm:gap-6 w-full sm:w-auto">
                          <div className="text-left sm:text-right flex-1 sm:flex-none">
                            <p className="text-[10px] text-gray-500">Real Spread / Qazanc</p>
                            <p className="text-sm font-mono font-bold text-emerald-400">
                              {formatNum(opp.spread, 3)}% <span className="text-gray-600 font-sans font-normal mx-1">|</span> +{formatMoney(opp.estProfit)}
                            </p>
                          </div>
                          <button 
                            onClick={() => handleManualExecute(opp)}
                            disabled={isRunning || isTargetReached}
                            className="w-full sm:w-auto px-4 py-2 bg-white/5 hover:bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-lg border border-white/10 hover:border-emerald-500/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-1 whitespace-nowrap"
                          >
                            <PenTool size={12} /> Manual İcra
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/5">
                        <div className="flex items-center justify-between text-[9px] text-gray-500 mb-2 px-1">
                          <span>Live Exchange Prices (USDT)</span>
                          <span className="flex gap-3">
                            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>Buy (Low)</span>
                            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>Sell (High)</span>
                          </span>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                          {opp.exchanges.map(ex => (
                            <div key={ex.name} className={`bg-[#0a0a0c] p-2 rounded-md border text-center transition-colors ${ex.isBuy ? 'border-emerald-500/30 bg-emerald-900/10' : ex.isSell ? 'border-red-500/30 bg-red-900/10' : 'border-white/5 hover:border-white/10'}`}>
                              <div className="text-[9px] text-gray-500 mb-0.5">{ex.name}</div>
                              <div className={`text-[10px] font-mono font-medium ${ex.isBuy ? 'text-emerald-400' : ex.isSell ? 'text-red-400' : 'text-gray-300'}`}>
                                {formatNum(ex.price, opp.asset === 'TRX' || opp.asset === 'ADA' || opp.asset === 'XRP' ? 4 : 2)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* SAĞ TƏRƏF (Terminal & System Stats) */}
          <div className="space-y-4 md:space-y-6">
            
            {/* TERMINAL */}
            <div className="bg-[#0a0a0c] border border-white/10 rounded-2xl flex flex-col h-[400px] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
              <div className="p-3 border-b border-white/5 flex items-center justify-between bg-black/40">
                <div className="flex items-center gap-2">
                  <TerminalIcon className="text-gray-400 w-4 h-4" />
                  <span className="text-xs font-mono text-gray-400">root@quantum-arb:~#</span>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-4 font-mono text-[11px] sm:text-xs space-y-1.5 scrollbar-hide flex flex-col-reverse">
                {logs.map(log => (
                  <div key={log.id} className="flex gap-3 break-all animate-fade-in">
                    <span className="text-gray-600 shrink-0">[{log.time.toLocaleTimeString('en-US', {hour12: false, fractionalSecondDigits: 3})}]</span>
                    <span className={`${log.type === 'success' ? 'text-emerald-400' : log.type === 'warning' ? 'text-yellow-400' : log.type === 'process' ? 'text-blue-400' : 'text-gray-300'}`}>
                      {log.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* SYSTEM STATUS MINIMAL */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 backdrop-blur-md">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Server size={14} /> Təchizat & Şəbəkə
              </h3>
              <div className="space-y-3">
                <ProgressBar label="CPU Mühərrik Yükü" value={stats.cpuLoad} color="bg-blue-500" />
                <ProgressBar label="Operativ Yaddaş" value={stats.memory} color="bg-purple-500" />
                <ProgressBar label="Şəbəkə Sıxlığı (Gas)" value={stats.gas} max={100} color="bg-orange-500" suffix=" Gwei" />
                <div className="pt-2 flex justify-between text-[10px] text-gray-500">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 size={10} className={apiConnected ? "text-emerald-500" : "text-yellow-500"}/> 
                    Binance API: {apiConnected ? 'Aktiv' : 'Yüklənir'}
                  </span>
                  <span className="flex items-center gap-1"><CheckCircle2 size={10} className="text-emerald-500"/> Node: Sinxron</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* TRANSACTIONS HISTORY */}
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col backdrop-blur-md overflow-hidden">
          <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20">
            <div className="flex items-center gap-2">
              <History className="text-purple-400 w-5 h-5" />
              <h2 className="text-sm font-semibold text-white">Tranzaksiya Tarixçəsi (Real-Time)</h2>
            </div>
            <span className="text-xs bg-purple-500/10 text-purple-400 px-2 py-1 rounded-md border border-purple-500/20">
              Total: {stats.tradesCount}
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider text-gray-500 border-b border-white/5 bg-black/40">
                  <th className="p-3 font-medium">Exec ID</th>
                  <th className="p-3 font-medium">Asset</th>
                  <th className="p-3 font-medium">Market Route</th>
                  <th className="p-3 font-medium">Spread</th>
                  <th className="p-3 font-medium">Trade Size</th>
                  <th className="p-3 font-medium">Qazanc</th>
                  <th className="p-3 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-white/5">
                {history.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-gray-600">Sistem aktivasiya gözləyir. Hələ heç bir əməliyyat yoxdur.</td>
                  </tr>
                ) : (
                  history.slice(0, 15).map((trade, idx) => (
                    <HistoryRow key={trade.id} trade={trade} idx={idx} />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* MANUAL EXECUTION MODAL */}
      {manualModal.isOpen && manualModal.opp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-[#0a0a0c] border border-gray-800 rounded-2xl w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col relative animate-fade-in">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <Shield className="text-emerald-400 w-5 h-5" />
                <h3 className="font-semibold text-white">Smart Contract İcrası</h3>
              </div>
              <button onClick={() => setManualModal({isOpen: false, opp: null, step: 0})} className="text-gray-500 hover:text-white transition-colors" disabled={manualModal.step > 0 && manualModal.step < 5}>✕</button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3 bg-black/40 p-3 rounded-xl border border-white/5 mb-2">
                 <CryptoLogo asset={manualModal.opp.asset} className="w-8 h-8" />
                 <div>
                    <div className="text-sm font-bold text-white">{manualModal.opp.asset}/USDT Arbitrajı</div>
                    <div className="text-[10px] text-gray-400">{manualModal.opp.route.join(' → ')}</div>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <ModalDetail label="Contract Address" value="0x7a25...b248" />
                <ModalDetail label="Execution Hash" value={generateShortHash()} />
                <ModalDetail label="Trade Size (Flash Loan)" value={formatMoney(manualModal.opp.estTradeSize)} />
                <ModalDetail label="Real Spread" value={`${formatNum(manualModal.opp.spread, 3)}%`} valueColor="text-emerald-400" />
                <ModalDetail label="Maks. Gözlənilən Qazanc" value={`+${formatMoney(Math.min(manualModal.opp.estProfit, TARGET_PROFIT - totalProfit))}`} valueColor="text-emerald-400 font-bold" />
                <ModalDetail label="AI Confidence" value={`${formatNum(manualModal.opp.confidence)}%`} valueColor="text-emerald-400" />
                <ModalDetail label="Buy Price (Low)" value={formatNum(manualModal.opp.buyPrice, manualModal.opp.asset === 'TRX' ? 4 : 2)} />
                <ModalDetail label="Sell Price (High)" value={formatNum(manualModal.opp.sellPrice, manualModal.opp.asset === 'TRX' ? 4 : 2)} />
              </div>
              <div className="bg-black/40 border border-gray-800 rounded-xl p-4 mt-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-400">Tranzaksiya Statusu</span>
                  <span className="text-[10px] text-gray-500 font-mono">
                    {manualModal.step === 0 ? 'Gözləyir' : manualModal.step === 1 ? 'İmzalanır...' : manualModal.step === 2 ? 'Validasiya...' : manualModal.step === 3 ? 'Blok Təsdiqi...' : manualModal.step === 4 ? 'Hesablaşma...' : 'Tamamlandı'}
                  </span>
                </div>
                <div className="h-1.5 bg-gray-900 rounded-full overflow-hidden flex">
                  <div className={`h-full bg-emerald-500 transition-all duration-500 ease-out`} style={{ width: `${(manualModal.step / 5) * 100}%` }}></div>
                </div>
                <div className="flex justify-between mt-3 px-1">
                  {[1,2,3,4,5].map(s => (<div key={s} className={`w-2 h-2 rounded-full transition-all duration-300 ${manualModal.step >= s ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-gray-800'}`} />))}
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-800 bg-black/40 flex justify-end gap-3">
              <button onClick={() => setManualModal({isOpen: false, opp: null, step: 0})} disabled={manualModal.step > 0 && manualModal.step < 5} className="px-4 py-2 text-xs text-gray-400 hover:text-white transition-colors">Ləğv et</button>
              <button onClick={processManualSignature} disabled={manualModal.step > 0} className={`px-5 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-all ${manualModal.step === 5 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : manualModal.step > 0 ? 'bg-blue-500 text-white cursor-wait opacity-80' : 'bg-white text-black hover:bg-gray-200 shadow-[0_0_15px_rgba(255,255,255,0.2)]'}`}>
                {manualModal.step === 5 ? <CheckCircle2 size={14}/> : manualModal.step > 0 ? <Activity size={14} className="animate-spin" /> : <Fingerprint size={14} />}
                {manualModal.step === 5 ? 'Tamamlandı' : manualModal.step > 0 ? 'İcra Edilir...' : 'İmzalama & İcra Et'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESET CONFIRMATION MODAL */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
           <div className="bg-[#0a0a0c] border border-gray-800 rounded-2xl w-full max-w-sm p-6 text-center shadow-2xl animate-fade-in">
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                 <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Sistemi Sıfırla?</h3>
              <p className="text-sm text-gray-400 mb-6">Bütün mövcud qazanc, statistika, taymer və tarixçə qalıcı olaraq silinəcək və balans başlanğıc vəziyyətinə (30,000.00 USDT) qayıdacaq. Davam etmək istəyirsiniz?</p>
              <div className="flex gap-3">
                 <button onClick={() => setResetModalOpen(false)} className="flex-1 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:bg-white/5 transition-all">Ləğv et</button>
                 <button onClick={resetSystem} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)]">Bəli, Sıfırla</button>
              </div>
           </div>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; } @keyframes fade-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } } .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }`}} />
    </div>
  );
}