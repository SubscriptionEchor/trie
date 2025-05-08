import { useState } from 'react';
import { formatNumber } from '@/utils/formatNumber';
import { Select, Skeleton } from '@/components/ui';
import { useEffect } from 'react';

const MOCK_TRANSACTIONS = Array.from({ length: 20 }, (_, i) => ({
  id: `tx-${i + 1}`,
  date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  buyer: `User ${Math.floor(Math.random() * 1000)}`,
  asset: [
    'Advanced NLP Model',
    'Image Classifier Pro',
    'Speech Recognition Engine',
    'Object Detection System',
    'Text Generation Model'
  ][Math.floor(Math.random() * 5)],
  amount: (Math.random() * 100).toFixed(2),
  status: ['completed', 'pending', 'failed'][Math.floor(Math.random() * 3)]
}));

const TIME_PERIODS = [
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'This Week' },
  { id: 'month', label: 'This Month' },
  { id: 'year', label: 'This Year' }
];

const EARNINGS_STATS = {
  today: {
    earnings: '245.50',
    purchases: '12',
    activeAssets: '8'
  },
  week: {
    earnings: '1,845.75',
    purchases: '86',
    activeAssets: '15'
  },
  month: {
    earnings: '8,450.25',
    purchases: '342',
    activeAssets: '22'
  },
  year: {
    earnings: '95,780.50',
    purchases: '4,256',
    activeAssets: '35'
  }
};

export function EarningsView() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  }>({
    key: 'date',
    direction: 'desc'
  });

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedTransactions = [...MOCK_TRANSACTIONS].sort((a, b) => {
    if (sortConfig.key === 'date') {
      return sortConfig.direction === 'asc'
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    if (sortConfig.key === 'amount') {
      return sortConfig.direction === 'asc'
        ? parseFloat(a.amount) - parseFloat(b.amount)
        : parseFloat(b.amount) - parseFloat(a.amount);
    }
    return 0;
  });

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-[calc(100vh-112px)] overflow-y-auto scrollbar-hide">
      {/* Time Period Selection */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 px-4 md:px-6 lg:px-8 pt-6">
        <h1 className="text-2xl font-bold text-gray-900 flex-shrink-0">Earnings Overview</h1>
        {isLoading ? (
          <Skeleton className="w-[200px] h-10 rounded-lg" />
        ) : (
          <Select
            value={selectedPeriod}
            onChange={setSelectedPeriod}
            options={TIME_PERIODS}
            className="w-full sm:w-[200px]"
          />
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 px-4 md:px-6 lg:px-8">
        {isLoading ? (
          <>
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl border border-[#e1e3e5] p-6">
                <div className="flex items-center justify-between mb-4">
                  <Skeleton className="w-32 h-4" />
                  <Skeleton className="w-16 h-6 rounded-full" />
                </div>
                <div className="flex items-end gap-2">
                  <Skeleton className="w-24 h-8" />
                  <Skeleton className="w-16 h-4" />
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            <div className="bg-white rounded-xl border border-[#e1e3e5] p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500">Total Earnings</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  parseFloat(EARNINGS_STATS[selectedPeriod as keyof typeof EARNINGS_STATS].earnings) > 1000
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedPeriod}
                </span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-gray-900">
                  ${EARNINGS_STATS[selectedPeriod as keyof typeof EARNINGS_STATS].earnings}
                </span>
                <span className="text-sm text-green-600 mb-1">+12.5%</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#e1e3e5] p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500">Total Purchases</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {selectedPeriod}
                </span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-gray-900">
                  {formatNumber(EARNINGS_STATS[selectedPeriod as keyof typeof EARNINGS_STATS].purchases)}
                </span>
                <span className="text-sm text-green-600 mb-1">+8.2%</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#e1e3e5] p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500">Active Assets</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {selectedPeriod}
                </span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-gray-900">
                  {EARNINGS_STATS[selectedPeriod as keyof typeof EARNINGS_STATS].activeAssets}
                </span>
                <span className="text-sm text-green-600 mb-1">+4.1%</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl border border-[#e1e3e5] overflow-hidden mx-4 md:mx-6 lg:mx-8 mb-8">
        <div className="px-6 py-4 border-b border-[#e1e3e5]">
          <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto min-w-full">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center gap-2">
                    Date
                    {sortConfig.key === 'date' && (
                      <svg className={`w-4 h-4 transition-transform ${
                        sortConfig.direction === 'desc' ? 'transform rotate-180' : ''
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                      </svg>
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <span className="hidden sm:inline">Buyer</span>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <span className="hidden sm:inline">Asset</span>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center gap-2">
                    Amount
                    {sortConfig.key === 'amount' && (
                      <svg className={`w-4 h-4 transition-transform ${
                        sortConfig.direction === 'desc' ? 'transform rotate-180' : ''
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                      </svg>
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="relative px-6 py-3 hidden sm:table-cell">
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <Skeleton className="w-24 h-4" />
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                      <Skeleton className="w-32 h-4" />
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                      <Skeleton className="w-40 h-4" />
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <Skeleton className="w-16 h-4" />
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <Skeleton className="w-20 h-6 rounded-full" />
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-right">
                      <Skeleton className="w-12 h-4 ml-auto" />
                    </td>
                  </tr>
                ))
              ) : (
                sortedTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{transaction.buyer}</div>
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{transaction.asset}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${transaction.amount}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transaction.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : transaction.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-[#0284a5] hover:text-[#026d8a]">
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}