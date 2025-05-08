import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTransactions, STATUS_STYLES } from '@/hooks';
import { Pagination, Skeleton } from '@/components/ui';

const ITEMS_PER_PAGE = 12;

export function TransactionsView() {
  const { 
    transactions: sortedTransactions, 
    selectedTransaction, 
    setSelectedTransaction, 
    sortConfig, 
    handleSort,
    currentPage,
    setCurrentPage,
    totalItems,
    totalPages
  } = useTransactions();

  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="px-4 md:px-6 lg:px-8 py-8 h-[calc(100vh-112px)] overflow-y-auto scrollbar-hide">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          {isLoading ? (
            <>
              <div>
                <Skeleton className="w-48 h-8 mb-2" />
                <Skeleton className="w-64 h-4" />
              </div>
            </>
          ) : (
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
              <p className="mt-1 text-sm text-gray-500">
                View and manage your purchases
              </p>
            </div>
          )}
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-xl border border-[#e1e3e5] overflow-hidden">
          <div className="overflow-x-auto">
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
                    Asset
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seller
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
                  <th scope="col" className="relative px-6 py-3">
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
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <Skeleton className="w-10 h-10 rounded-lg" />
                          </div>
                          <div className="ml-4">
                            <Skeleton className="w-32 h-4 mb-1" />
                            <Skeleton className="w-24 h-3" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Skeleton className="w-8 h-8 rounded-full" />
                          <div className="ml-3">
                            <Skeleton className="w-24 h-4" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Skeleton className="w-16 h-4" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Skeleton className="w-20 h-6 rounded-full" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Skeleton className="w-12 h-4 ml-auto" />
                      </td>
                    </tr>
                  ))
                ) : (
                  sortedTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img 
                              className="h-10 w-10 rounded-lg object-cover" 
                              src={transaction.asset.image} 
                              alt={transaction.asset.name} 
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {transaction.asset.name}
                            </div>
                            <div className="text-sm text-gray-500 capitalize">
                              {transaction.asset.type}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm">
                            {transaction.seller.avatar}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {transaction.seller.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${transaction.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          STATUS_STYLES[transaction.status]
                        }`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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

        {/* Pagination */}
        {totalPages > 1 && totalItems > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
            className="mt-8"
          />
        )}
      </div>

      {/* Transaction Details Sidebar */}
      <AnimatePresence>
        {selectedTransaction && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.25 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black"
              onClick={() => setSelectedTransaction(null)}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-xl overflow-y-auto pt-[112px]"
            >
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Transaction Details</h2>
                  <button
                    onClick={() => setSelectedTransaction(null)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="px-6 py-4">
                <div className="space-y-6">
                  {/* Transaction ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Transaction ID</label>
                    <p className="mt-1 text-sm text-gray-900 font-mono">{selectedTransaction.id}</p>
                  </div>

                  {/* Date & Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Date & Time</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedTransaction.date).toLocaleString()}
                    </p>
                  </div>

                  {/* Asset Details */}
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">Asset</label>
                    <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                      <img 
                        src={selectedTransaction.asset.image} 
                        alt={selectedTransaction.asset.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">
                          {selectedTransaction.asset.name}
                        </h3>
                        <p className="text-sm text-gray-500 capitalize">
                          {selectedTransaction.asset.type}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Seller Details */}
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">Seller</label>
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                        {selectedTransaction.seller.avatar}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {selectedTransaction.seller.name}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">Payment Details</label>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Amount</span>
                        <span className="text-sm font-medium text-gray-900">
                          ${selectedTransaction.amount}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-500">Status</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          STATUS_STYLES[selectedTransaction.status]
                        }`}>
                          {selectedTransaction.status.charAt(0).toUpperCase() + selectedTransaction.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Download/Access Button */}
                  {selectedTransaction.status === 'completed' && (
                    <button className="w-full px-4 py-2 text-sm font-medium text-white bg-[#0284a5] rounded-lg hover:bg-[#026d8a]">
                      Access Asset
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}