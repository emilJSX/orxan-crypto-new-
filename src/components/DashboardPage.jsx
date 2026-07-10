import React, { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import { 
  Activity, Zap, Shield, Cpu, Server, TrendingUp, DollarSign, 
  Terminal as TerminalIcon, History, Play, StopCircle, PenTool, 
  CheckCircle2, AlertTriangle, ArrowRightLeft, BarChart3, Globe,
  Crosshair, Fingerprint, Layers, Clock, Lock, ChevronDown, ChevronUp,
  Wifi, WifiOff, LogOut
} from 'lucide-react';

const INITIAL_BALANCE = 13525.66;
const TARGET_PROFIT = 6527.62;
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

const formatMoney = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(val).replace('$', '') + ' USDT';
const formatNum = (val, dec = 2) => new Intl.NumberFormat('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }).format(val);
const generateHash = () => '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
const generateShortHash = () => { const h = generateHash(); return `${h.substring(0, 6)}...${h.substring(h.length - 4)}`; };
const generateID = (prefix) => `${prefix}-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100000 + Math.random() * 900000)}`;
const rand = (min, max) => Math.random() * (max - min) + min;
const randInt = (min, max) => Math.floor(rand(min, max));

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
      <tr 
        onClick={() => setExpanded(!expanded)}
        className={`cursor-pointer transition-colors ${idx % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.01]'} hover:bg-white/[0.03] group`}
      >
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
            <CheckCircle2 size={10} /> Выполнено
          </span>
        </td>
      </tr>
      
      {expanded && (
        <tr className="bg-black/60 border-b border-white/5 shadow-inner">
          <td colSpan="7" className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[10px]">
              <div className="space-y-2">
                <h4 className="text-gray-400 font-semibold uppercase border-b border-white/5 pb-1 mb-2">Основная информация</h4>
                <div className="flex justify-between"><span className="text-gray-500">ID транзакции:</span> <span className="font-mono text-gray-300">{trade.hash.substring(0,12)}...</span></div>
                <div className="flex justify-between"><span className="text-gray-500">ID исполнения:</span> <span className="font-mono text-gray-300">{trade.id}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Время:</span> <span className="font-mono text-gray-300">{trade.timestamp.toLocaleTimeString()}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Источник:</span> <span className="text-blue-400">{trade.source}</span></div>
              </div>

              <div className="space-y-2">
                <h4 className="text-gray-400 font-semibold uppercase border-b border-white/5 pb-1 mb-2">Цена и Стоимость</h4>
                <div className="flex justify-between"><span className="text-gray-500">Цена покупки:</span> <span className="font-mono text-gray-300">{formatNum(trade.buyPrice, trade.asset === 'TRX' || trade.asset === 'ADA' || trade.asset === 'XRP' ? 4 : 2)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Цена продажи:</span> <span className="font-mono text-gray-300">{formatNum(trade.sellPrice, trade.asset === 'TRX' || trade.asset === 'ADA' || trade.asset === 'XRP' ? 4 : 2)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Комиссия сети:</span> <span className="font-mono text-red-400">-{trade.networkFee.toFixed(2)} USDT</span></div>
                <div className="flex justify-between"><span className="text-gray-500">ROI:</span> <span className="font-mono text-emerald-400">+{formatNum(trade.roi)}%</span></div>
              </div>

              <div className="space-y-2">
                <h4 className="text-gray-400 font-semibold uppercase border-b border-white/5 pb-1 mb-2">Технические детали</h4>
                <div className="flex justify-between"><span className="text-gray-500">Время исполнения:</span> <span className="font-mono text-gray-300">{trade.execTime} ms</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Задержка (Latency):</span> <span className="font-mono text-gray-300">{trade.latency} ms</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Ликвидность:</span> <span className="font-mono text-gray-300">{formatNum(trade.liquidity, 1)}M USDT</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Сеть:</span> <span className="font-mono text-gray-300">{trade.network}</span></div>
              </div>

              <div className="space-y-2">
                <h4 className="text-gray-400 font-semibold uppercase border-b border-white/5 pb-1 mb-2">AI Анализ и Smart Route</h4>
                <div className="flex justify-between"><span className="text-gray-500">Уверенность AI:</span> <span className="font-mono text-emerald-400">{formatNum(trade.confidence, 1)}%</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Риск-фактор:</span> <span className="font-mono text-yellow-400">{formatNum(trade.riskScore, 1)}/10</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Маршрут:</span> <span className="text-gray-300 text-right max-w-[80px] truncate">{trade.route.join('→')}</span></div>
                <div className="flex justify-between text-[9px] mt-1 pt-1 border-t border-white/5">
                  <span className={`${trade.darkPool ? 'text-purple-400' : 'text-gray-600'}`}>{trade.darkPool ? 'Использован Dark Pool' : 'Без Dark Pool'}</span>
                  <span className={`${trade.mev ? 'text-orange-400' : 'text-gray-600'}`}>{trade.mev ? 'MEV-Защита' : 'Стандартный'}</span>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
});

export default function DashboardPage({ onLogout }) {
  const [isRunning, setIsRunning] = useState(false);
  const [isTargetReached, setIsTargetReached] = useState(false);
  const [apiConnected, setApiConnected] = useState(false);
  
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [totalProfit, setTotalProfit] = useState(0);
  
  const [stats, setStats] = useState({
    tradesCount: 0,
    winRate: 100,
    avgSpread: 0.32,
    avgProfit: 0,
    bestTrade: 0,
    largestVolume: 0,
    executionSpeed: 450,
    latency: 12,
    aiConfidence: 98.2,
    cpuLoad: 24,
    memory: 45,
    gas: 15
  });

  const [marketData, setMarketData] = useState({});
  const [opportunities, setOpportunities] = useState([]);
  const [logs, setLogs] = useState([{ id: 1, time: new Date(), text: 'Система готова к работе. Ожидание синхронизации рынка...', type: 'info' }]);
  
  const [manualModal, setManualModal] = useState({ isOpen: false, opp: null, step: 0 });
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);

  const engineSteps = useMemo(() => [
    { name: 'Сканер возможностей', log: 'Сканирование спредов в реальном времени...' },
    { name: 'Оптимизатор маршрутов', log: 'AI выбрал оптимальный межбиржевой маршрут' },
    { name: 'Проверка ликвидности', log: 'Проверка стаканов объемов и ликвидности' },
    { name: 'AI Маршрутизация', log: 'Smart Routing API успешно подтвержден' },
    { name: 'Рыночный анализатор', log: 'Спред-дифференциал валидирован нодой' },
    { name: 'Детектор спредов', log: 'Анализ книги ордеров завершен' },
    { name: 'Исполнитель ордеров', log: 'Flash-ликвидность выделена и задействована' }
  ], []);

  const addLog = useCallback((text, type = 'info') => {
    setLogs(prev => {
      const newLogs = [{ id: Date.now() + Math.random(), time: new Date(), text, type }, ...prev];
      return newLogs.slice(0, 60);
    });
  }, []);

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
        addLog('Подключение к Binance API активно. Рынок синхронизирован.', 'success');
        addLog('Резервный шлюз CoinGecko переведен в режим ожидания.', 'info');
      }

    } catch (error) {
      if (error.name !== 'AbortError') {
        if (apiConnected) {
            setApiConnected(false);
            addLog('Соединение с основным API потеряно. Включен режим симуляции.', 'warning');
        }
        const fallbackData = {};
        ASSETS.forEach(asset => {
            const base = asset === 'BTC' ? 68000 : asset === 'ETH' ? 3500 : asset === 'SOL' ? 150 : 1;
            fallbackData[asset] = {
                price: base * (1 + rand(-0.02, 0.02)),
                change24h: rand(-5, 5),
                vol24h: rand(10000000, 500000000)
            };
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
        ...prev,
        cpuLoad: randInt(20, 75),
        memory: randInt(40, 85),
        gas: randInt(8, 25),
        latency: randInt(8, 20),
        aiConfidence: prev.tradesCount > 0 ? rand(96, 99.9) : 98.2
      }));
    }, 8000);

    return () => {
      clearInterval(interval);
      abortController.abort();
    };
  }, [fetchMarketPrices]);

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
      const buyEx = exchangePrices[0];
      const sellEx = exchangePrices[exchangePrices.length - 1];
      
      exchangePrices.forEach(ex => {
        ex.isBuy = ex.name === buyEx.name;
        ex.isSell = ex.name === sellEx.name;
      });

      const middleEx = randChoice(EXCHANGES.filter(e => e !== buyEx.name && e !== sellEx.name));
      const route = [buyEx.name, middleEx, sellEx.name];
      const trueSpread = ((sellEx.price - buyEx.price) / buyEx.price) * 100;
      
      const estTradeSize = rand(2000, 10000);
      const estProfit = estTradeSize * (trueSpread / 100);

      return {
        id: generateID('OPP'),
        asset,
        route,
        exchanges: exchangePrices,
        buyPrice: buyEx.price,
        sellPrice: sellEx.price,
        buyExchange: buyEx.name,
        sellExchange: sellEx.name,
        spread: Math.max(0.01, trueSpread),
        confidence: Math.min(99.9, rand(90, 98) + (trueSpread * 10)),
        liquidity: (realData.vol24h / 1000000) * rand(0.01, 0.05),
        risk: rand(0.5, 3.5),
        estTradeSize,
        estProfit,
        execTime: randInt(150, 600),
        change24h: realData.change24h
      };
    }).filter(Boolean);

    newOpportunities.sort((a, b) => b.spread - a.spread);
    setOpportunities(newOpportunities.slice(0, 6));
  }, [marketData]);

  const randChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const executeTrade = useCallback((manualOpp = null, source = 'AI Smart Routing') => {
    if (isTargetReached) return;

    const opp = manualOpp || opportunities[0];
    if (!opp) return;

    let generatedProfit = opp.estProfit;
    if (generatedProfit < 5) generatedProfit = rand(15, 45); 
    if (generatedProfit > 150) generatedProfit = rand(80, 150);

    let newProfit = totalProfit + generatedProfit;
    
    if (newProfit >= TARGET_PROFIT) {
      generatedProfit = TARGET_PROFIT - totalProfit;
      newProfit = TARGET_PROFIT;
      setIsTargetReached(true);
      setIsRunning(false);
      addLog('МАКСИМАЛЬНАЯ ЦЕЛЬ ДОСТИГНУТА! Работа системы безопасно приостановлена.', 'warning');
    }

    const tradeSize = opp.estTradeSize;
    const newBalance = INITIAL_BALANCE + newProfit;
    
    const tradeData = {
      id: generateID('EXE'),
      hash: generateHash(),
      timestamp: new Date(),
      asset: opp.asset,
      route: opp.route,
      buyExchange: opp.buyExchange,
      sellExchange: opp.sellExchange,
      buyPrice: opp.buyPrice,
      sellPrice: opp.sellPrice,
      spread: opp.spread,
      tradeSize: tradeSize,
      networkFee: rand(0.5, 3.5),
      liquidity: opp.liquidity,
      network: randChoice(['ERC-20', 'TRC-20', 'BEP-20', 'Solana', 'Arbitrum One']),
      slippage: rand(0.001, 0.015),
      execTime: opp.execTime,
      latency: randInt(5, 15),
      confidence: opp.confidence,
      riskScore: opp.risk,
      profit: generatedProfit,
      roi: (generatedProfit / tradeSize) * 100,
      source: source,
      darkPool: Math.random() > 0.6,
      mev: Math.random() > 0.5,
      status: 'Completed',
    };

    setHistory(prev => [tradeData, ...prev]);
    setBalance(newBalance);
    setTotalProfit(newProfit);
    
    setStats(prev => ({
      ...prev,
      tradesCount: prev.tradesCount + 1,
      avgProfit: ((prev.avgProfit * prev.tradesCount) + generatedProfit) / (prev.tradesCount + 1),
      bestTrade: Math.max(prev.bestTrade, generatedProfit),
      largestVolume: Math.max(prev.largestVolume, tradeSize),
      avgSpread: ((prev.avgSpread * prev.tradesCount) + opp.spread) / (prev.tradesCount + 1)
    }));

    addLog(`Прибыль: +${formatMoney(generatedProfit)} | Маршрут: ${opp.route.join(' → ')} (${opp.asset})`, 'success');
  }, [isTargetReached, opportunities, totalProfit, addLog]);

  useEffect(() => {
    let timeout;
    let isActive = true;

    if (isRunning && !isTargetReached && opportunities.length > 0) {
      const runCycle = async () => {
        for (let i = 0; i < engineSteps.length; i++) {
          if (!isActive || !isRunning) return;
          setCurrentStepIndex(i);
          
          let customLog = engineSteps[i].log;
          if (i === 1) customLog = `AI выбрал оптимальный маршрут: ${opportunities[0].route.join(' → ')}`;
          if (i === 4) customLog = `Спред подтвержден: ${formatNum(opportunities[0].spread, 3)}%`;
          
          addLog(customLog, 'process');
          await new Promise(r => setTimeout(r, randInt(250, 600)));
        }

        if (!isActive || !isRunning) return;
        executeTrade(null, 'AI Auto Arbitrage');
        setCurrentStepIndex(-1);
        timeout = setTimeout(runCycle, randInt(1500, 3500));
      };
      runCycle();
    }
    return () => {
      isActive = false;
      clearTimeout(timeout);
      setCurrentStepIndex(-1);
    };
  }, [isRunning, isTargetReached, opportunities, engineSteps, executeTrade, addLog]);

  const handleManualExecute = useCallback((opp) => {
    setManualModal({ isOpen: true, opp, step: 0 });
  }, []);

  const processManualSignature = async () => {
    if (manualModal.step > 0) return;
    const steps = [
      { s: 1, delay: 800, log: 'Ожидание подписи транзакции аппаратным ключом...' },
      { s: 2, delay: 1200, log: 'Валидация транзакции пулом нод...' },
      { s: 3, delay: 1500, log: 'Ожидание финализации блока блокчейна...' },
      { s: 4, delay: 1000, log: 'Выполнение взаимных расчетов (Settlement)...' },
      { s: 5, delay: 500, log: 'Ручной ордер успешно обработан смарт-контрактом.' }
    ];

    for (const step of steps) {
      setManualModal(prev => ({ ...prev, step: step.s }));
      addLog(step.log, 'info');
      await new Promise(r => setTimeout(r, step.delay));
    }
    executeTrade(manualModal.opp, 'Manual Smart Contract');
    setTimeout(() => setManualModal({ isOpen: false, opp: null, step: 0 }), 2000);
  };

  const hasData = opportunities.length > 0;

  return (
    <div className="min-h-screen bg-[#050505] text-gray-300 font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-900/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/10 blur-[120px]" />
      </div>

      <div className="relative z-10 p-2 sm:p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6">
        
        {/* ХЕДЕР С КНОПКОЙ ВЫХОДА */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <Layers className="text-white w-6 h-6" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#050505] animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-wide">QUANTUM<span className="text-emerald-400">ARB</span></h1>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-500">HFT Arbitrage Dashboard v4.5</span>
                {apiConnected ? (
                   <span className="flex items-center gap-1 text-emerald-400"><Wifi size={10} /> Live API</span>
                ) : (
                   <span className="flex items-center gap-1 text-yellow-500"><WifiOff size={10} /> Синхронизация...</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap md:flex-nowrap items-center gap-3 w-full md:w-auto">
            <div className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 flex-1 md:flex-none">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Текущий баланс</p>
              <p className="text-lg font-mono font-bold text-white">{formatMoney(balance)}</p>
            </div>
            <div className="bg-emerald-900/20 border border-emerald-500/20 rounded-xl px-4 py-2 flex-1 md:flex-none">
              <p className="text-[10px] text-emerald-400/80 uppercase tracking-wider">Общая прибыль</p>
              <p className="text-lg font-mono font-bold text-emerald-400">+{formatMoney(totalProfit)}</p>
            </div>
            
            <button 
              onClick={() => !isTargetReached && setIsRunning(!isRunning)}
              disabled={isTargetReached || !hasData}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all duration-300 shadow-lg ${
                isTargetReached 
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : isRunning 
                    ? 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20' 
                    : !hasData 
                      ? 'bg-emerald-900/50 text-emerald-700 cursor-wait'
                      : 'bg-emerald-500 text-black hover:bg-emerald-400 hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]'
              }`}
            >
              {isTargetReached ? <Lock size={18} /> : isRunning ? <StopCircle size={18} /> : <Play size={18} />}
              {isTargetReached ? 'ЛИМИТ ДОСТИГНУТ' : isRunning ? 'Стоп система' : !hasData ? 'Загрузка...' : 'Автостарт'}
            </button>

            <button 
              onClick={onLogout}
              className="px-3 py-2.5 bg-black/40 border border-white/5 hover:border-red-500/30 rounded-xl text-gray-400 hover:text-red-400 transition-all"
              title="Выйти из системы"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            
            {/* СЕТКА СТАТИСТИКИ */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard title="Процент побед" value={`${stats.winRate}%`} icon={<Crosshair size={14} />} color="text-blue-400" />
              <StatCard title="Успешные сделки" value={stats.tradesCount} icon={<CheckCircle2 size={14} />} color="text-emerald-400" />
              <StatCard title="Ежедневный ROI" value={`+${formatNum((totalProfit/INITIAL_BALANCE)*100)}%`} icon={<TrendingUp size={14} />} color="text-emerald-400" />
              <StatCard title="Лучшая прибыль" value={formatMoney(stats.bestTrade)} icon={<DollarSign size={14} />} color="text-purple-400" />
              <StatCard title="Средний спред" value={`${formatNum(stats.avgSpread, 3)}%`} icon={<ArrowRightLeft size={14} />} />
              <StatCard title="Скорость исполнения" value={`${stats.executionSpeed} ms`} icon={<Zap size={14} />} />
              <StatCard title="Уверенность AI" value={`${formatNum(stats.aiConfidence)}%`} icon={<Cpu size={14} />} color={stats.aiConfidence > 97 ? "text-emerald-400" : "text-yellow-400"} />
              <StatCard title="Задержка сети" value={`${stats.latency} ms`} icon={<Globe size={14} />} />
            </div>

            {/* МУЛЬТИЭТАПНЫЙ ДВИЖОК АВТОМАТИЗАЦИИ */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 sm:p-5 backdrop-blur-md relative overflow-hidden">
              <div className="flex items-center gap-2 mb-4">
                <Cpu className="text-emerald-500 w-5 h-5" />
                <h2 className="text-sm font-semibold text-white">Движок AI в реальном времени</h2>
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
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                        isActive ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.6)] scale-110' :
                        isPast ? 'bg-emerald-900/50 text-emerald-500 border border-emerald-500/30' : 'bg-gray-900 border border-gray-800 text-gray-600'
                      }`}>{idx + 1}</div>
                      <span className={`text-[9px] sm:text-[10px] text-center max-w-[60px] leading-tight ${isActive ? 'text-emerald-400 font-medium' : 'text-gray-500'}`}>{step.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* МАТРИЦА АРБИТРАЖА С РЕАЛЬНЫМИ ЦЕНАМИ */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col h-auto min-h-[400px] backdrop-blur-md">
              <div className="p-4 border-b border-white/5 flex justify-between items-center sticky top-0 bg-[#050505]/80 z-10 rounded-t-2xl">
                <div className="flex items-center gap-2">
                  <Activity className="text-blue-400 w-5 h-5" />
                  <h2 className="text-sm font-semibold text-white">Матрица активного арбитража</h2>
                </div>
                <div className="text-xs text-gray-500">Live API Синхронизация</div>
              </div>
              <div className="flex-1 overflow-auto p-3 space-y-3">
                {!hasData ? (
                   <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-3 py-10">
                      <Activity className="w-8 h-8 animate-spin text-emerald-500/50" />
                      <p className="text-xs">Синхронизация котировок с Binance...</p>
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
                               <span>Спред-канал:</span>
                               <span className="text-emerald-400 font-medium">{opp.buyExchange}</span>
                               <ArrowRightLeft size={10} className="text-gray-600"/>
                               <span className="text-red-400 font-medium">{opp.sellExchange}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 sm:gap-6 w-full sm:w-auto">
                          <div className="text-left sm:text-right flex-1 sm:flex-none">
                            <p className="text-[10px] text-gray-500">Спред / Ожидаемая профит</p>
                            <p className="text-sm font-mono font-bold text-emerald-400">
                              {formatNum(opp.spread, 3)}% <span className="text-gray-600 font-sans font-normal mx-1">|</span> +{formatMoney(opp.estProfit)}
                            </p>
                          </div>
                          <button 
                            onClick={() => handleManualExecute(opp)}
                            disabled={isRunning || isTargetReached}
                            className="w-full sm:w-auto px-4 py-2 bg-white/5 hover:bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-lg border border-white/10 hover:border-emerald-500/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-1 whitespace-nowrap"
                          >
                            <PenTool size={12} /> Ручной ордер
                          </button>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-white/5">
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                          {opp.exchanges.map(ex => (
                            <div key={ex.name} className={`bg-[#0a0a0c] p-2 rounded-md border text-center transition-colors ${
                              ex.isBuy ? 'border-emerald-500/30 bg-emerald-900/10' : 
                              ex.isSell ? 'border-red-500/30 bg-red-900/10' : 'border-white/5 hover:border-white/10'
                            }`}>
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

          {/* ПРАВАЯ ЧАСТЬ (Консоль и Нагрузка системы) */}
          <div className="space-y-4 md:space-y-6">
            <div className="bg-[#0a0a0c] border border-white/10 rounded-2xl flex flex-col h-[400px] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
              <div className="p-3 border-b border-white/5 flex items-center justify-between bg-black/40">
                <div className="flex items-center gap-2">
                  <TerminalIcon className="text-gray-400 w-4 h-4" />
                  <span className="text-xs font-mono text-gray-400">root@quantum-arb:~#</span>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-4 font-mono text-[11px] sm:text-xs space-y-1.5 scrollbar-hide flex flex-col-reverse">
                {logs.map(log => (
                  <div key={log.id} className="flex gap-3 break-all">
                    <span className="text-gray-600 shrink-0">[{log.time.toLocaleTimeString()}]</span>
                    <span className={
                      log.type === 'success' ? 'text-emerald-400' : 
                      log.type === 'warning' ? 'text-yellow-400' : 
                      log.type === 'process' ? 'text-blue-400' : 'text-gray-300'
                    }>{log.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 backdrop-blur-md">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2"><Server size={14} /> Ресурсы и Ноды</h3>
              <div className="space-y-3">
                <ProgressBar label="Нагрузка ядра CPU" value={stats.cpuLoad} color="bg-blue-500" />
                <ProgressBar label="Оперативная память" value={stats.memory} color="bg-purple-500" />
                <ProgressBar label="Плотность транзакций сети (Gas)" value={stats.gas} max={100} color="bg-orange-500" suffix=" Gwei" />
                <div className="pt-2 flex justify-between text-[10px] text-gray-500">
                  <span className="flex items-center gap-1"><CheckCircle2 size={10} className={apiConnected ? "text-emerald-500" : "text-yellow-500"}/> Binance API: Активно</span>
                  <span className="flex items-center gap-1"><CheckCircle2 size={10} className="text-emerald-500"/> Node Pool: Синхронно</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ТАБЛИЦА ИСТОРИИ */}
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col backdrop-blur-md overflow-hidden">
          <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20">
            <div className="flex items-center gap-2">
              <History className="text-purple-400 w-5 h-5" />
              <h2 className="text-sm font-semibold text-white">Лог исполненных смарт-контрактов (Реал-тайм)</h2>
            </div>
            <span className="text-xs bg-purple-500/10 text-purple-400 px-2 py-1 rounded-md border border-purple-500/20">Всего: {stats.tradesCount}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider text-gray-500 border-b border-white/5 bg-black/40">
                  <th className="p-3 font-medium">Ключ</th>
                  <th className="p-3 font-medium">Актив</th>
                  <th className="p-3 font-medium">Маршрут плеча</th>
                  <th className="p-3 font-medium">Спред</th>
                  <th className="p-3 font-medium">Объем сделки</th>
                  <th className="p-3 font-medium">Чистая прибыль</th>
                  <th className="p-3 font-medium text-right">Статус</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-white/5">
                {history.length === 0 ? (
                  <tr><td colSpan="7" className="p-8 text-center text-gray-600">Система ожидает запуска. Позиции отсутствуют.</td></tr>
                ) : (
                  history.slice(0, 15).map((trade, idx) => <HistoryRow key={trade.id} trade={trade} idx={idx} />)
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* МОДАЛЬНОЕ ОКНО ПОДПИСИ СМАРТ-КОНТРАКТА */}
      {manualModal.isOpen && manualModal.opp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-[#0a0a0c] border border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col relative animate-fade-in">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <Shield className="text-emerald-400 w-5 h-5" />
                <h3 className="font-semibold text-white">Выполнение ручного контракта</h3>
              </div>
              <button onClick={() => setManualModal({isOpen: false, opp: null, step: 0})} className="text-gray-500 hover:text-white" disabled={manualModal.step > 0 && manualModal.step < 5}>✕</button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <ModalDetail label="Адрес смарт-контракта" value="0x7a25...b248" />
                <ModalDetail label="Хэш исполнения" value={generateShortHash()} />
                <ModalDetail label="Объем Flash-займа" value={formatMoney(manualModal.opp.estTradeSize)} />
                <ModalDetail label="Текущий спред" value={`${formatNum(manualModal.opp.spread, 3)}%`} valueColor="text-emerald-400" />
                <ModalDetail label="Ожидаемый профит" value={`+${formatMoney(manualModal.opp.estProfit)}`} valueColor="text-emerald-400 font-bold" />
                <ModalDetail label="Точность прогноза ноды" value={`${formatNum(manualModal.opp.confidence)}%`} valueColor="text-emerald-400" />
              </div>
              <div className="bg-black/40 border border-gray-800 rounded-xl p-4 mt-2">
                <div className="h-1.5 bg-gray-900 rounded-full overflow-hidden flex">
                  <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${(manualModal.step / 5) * 100}%` }}></div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-800 bg-black/40 flex justify-end gap-3">
              <button onClick={() => setManualModal({isOpen: false, opp: null, step: 0})} className="px-4 py-2 text-xs text-gray-400 hover:text-white" disabled={manualModal.step > 0 && manualModal.step < 5}>Отмена</button>
              <button onClick={processManualSignature} disabled={manualModal.step > 0} className="px-5 py-2 text-xs font-semibold rounded-lg bg-white text-black hover:bg-gray-200">
                {manualModal.step === 5 ? 'Готово' : manualModal.step > 0 ? 'Обработка...' : 'Подписать и выполнить'}
              </button>
            </div>
          </div>
        </div>
      )}
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
      `}} />
    </div>
  );
}