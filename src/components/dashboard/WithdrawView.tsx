import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui';

interface Transaction {
  id: string;
  date: string;
  amount: string;
  method: string;
  status: 'completed' | 'processing' | 'pending';
}

const MOCK_TRANSACTIONS: Transaction[] = Array.from({ length: 5 }, (_, i) => ({
  id: `tx-${i + 1}`,
  date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  amount: `${(Math.random() * 1000).toFixed(2)}`,
  method: 'XELL Wallet',
  status: ['completed', 'processing', 'pending'][Math.floor(Math.random() * 3)] as Transaction['status']
}));

export function WithdrawView() {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [walletAddress] = useState('0x1234...5678');
  const availableBalance = 2458.50;

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) > availableBalance) return;

    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset form
      setWithdrawAmount('');
      
      // Show success message
      // You would typically show a toast notification here
    } catch (error) {
      console.error('Withdrawal failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-112px)] overflow-y-auto scrollbar-hide">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 px-4 md:px-6 lg:px-8 pt-8">
          {isLoading ? (
            <>
              <div>
                <Skeleton className="w-48 h-8 mb-2" />
                <Skeleton className="w-64 h-4" />
              </div>
              <div className="flex items-center gap-4 mt-4 sm:mt-0">
                <Skeleton className="w-32 h-8" />
                <Skeleton className="w-32 h-8" />
              </div>
            </>
          ) : (
            <>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Withdraw Funds</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Withdraw your earnings to your XELL wallet
                </p>
              </div>
              <div className="flex items-center gap-4 mt-4 sm:mt-0">
                <span className="text-sm text-gray-500">Available balance:</span>
                <span className="text-2xl font-bold text-gray-900">${availableBalance.toFixed(2)}</span>
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 md:px-6 lg:px-8 pb-8">
          {/* Withdrawal Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-[#e1e3e5] p-6">
              {isLoading ? (
                <>
                  <Skeleton className="w-48 h-6 mb-6" />
                  <div className="space-y-6">
                    <div>
                      <Skeleton className="w-32 h-4 mb-2" />
                      <Skeleton className="w-full h-10" />
                    </div>
                    <div>
                      <Skeleton className="w-32 h-4 mb-2" />
                      <Skeleton className="w-full h-10" />
                    </div>
                    <Skeleton className="w-full h-10" />
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Withdrawal Details</h2>
                  
                  {/* Wallet Address */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      XELL Wallet Address
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={walletAddress}
                        readOnly
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-500"
                      />
                      <button 
                        onClick={() => {/* Copy address */}}
                        className="p-2 text-gray-500 hover:text-gray-700"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Amount Input */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount to Withdraw
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">TRIE</span>
                      </div>
                      <input
                        type="text"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        className="w-full pl-12 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0284a5] focus:border-transparent"
                        placeholder="0.00"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <button
                          onClick={() => setWithdrawAmount(availableBalance.toString())}
                          className="text-sm text-[#0284a5] hover:text-[#026d8a]"
                        >
                          Max
                        </button>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      Minimum withdrawal: 100 TRIE
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div className="mt-6">
                    <button
                      onClick={handleWithdraw}
                      disabled={!withdrawAmount || parseFloat(withdrawAmount) > availableBalance || isProcessing}
                      className="w-full px-4 py-2 text-sm font-medium text-white bg-[#0284a5] rounded-lg hover:bg-[#026d8a] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isProcessing ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Processing...
                        </>
                      ) : (
                        'Withdraw to XELL Wallet'
                      )}
                    </button>
                    <p className="mt-2 text-xs text-center text-gray-500">
                      Withdrawals typically process within 5-10 minutes
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-white rounded-xl border border-[#e1e3e5] overflow-hidden">
            <div className="p-6 border-b border-[#e1e3e5]">
              <h2 className="text-lg font-semibold text-gray-900">Transaction History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Skeleton className="w-24 h-4" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Skeleton className="w-20 h-4" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Skeleton className="w-24 h-6 rounded-full" />
                        </td>
                      </tr>
                    ))
                  ) : (
                    MOCK_TRANSACTIONS.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.amount} TRIE
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            transaction.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : transaction.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div> 
  );
}