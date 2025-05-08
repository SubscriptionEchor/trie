import { useState, useEffect } from 'react';
import { formatNumber } from '@/utils/formatNumber';
import { Pagination, Skeleton } from '@/components/ui';

const ITEMS_PER_PAGE = 15;

const MOCK_DATA = Array.from({ length: 50 }, (_, i) => ({
  id: `model-${i + 1}`,
  type: ['AI Model', 'Dataset', 'Infrastructure'][Math.floor(Math.random() * 3)],
  name: [
    'Advanced NLP Model',
    'Image Classifier Pro',
    'Speech Recognition Engine',
    'Object Detection System',
    'Text Generation Model'
  ][Math.floor(Math.random() * 5)] + ` ${i + 1}`,
  category: [
    'Natural Language Processing',
    'Computer Vision',
    'Audio',
    'Multimodal',
    'Reinforcement Learning'
  ][Math.floor(Math.random() * 5)],
  status: ['Active', 'Pending Review', 'Inactive'][Math.floor(Math.random() * 3)],
  downloads: `${Math.floor(Math.random() * 10000)}`,
  earnings: `$${(Math.random() * 1000).toFixed(2)}`,
  updatedAt: `${Math.floor(Math.random() * 30) + 1} days ago`
}));

import { useNavigate } from 'react-router-dom';

export function MyUploadsView() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<{
    totalAssets: number;
    totalPurchases: number;
    totalEarnings: number;
  }>({
    totalAssets: 0,
    totalPurchases: 0,
    totalEarnings: 0
  });

  const totalPages = Math.ceil(MOCK_DATA.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = MOCK_DATA.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Load stats from localStorage
    const models = JSON.parse(localStorage.getItem('user_models') || '[]');
    const datasets = JSON.parse(localStorage.getItem('user_uploads_datasets') || '[]');
    const infra = localStorage.getItem('user_uploads_infra') === 'true' ? 1 : 0;

    setStats({
      totalAssets: models.length + datasets.length + infra,
      totalPurchases: models.reduce((acc: number, model: any) => acc + parseInt(model.downloads || '0'), 0),
      totalEarnings: models.reduce((acc: number, model: any) => acc + (parseInt(model.downloads || '0') * 0.1), 0) // Assuming $0.10 per download
    });
  }, []);

  return (
    <div className="h-[calc(100vh-112px)] pt-6 pb-16 overflow-y-auto scrollbar-hide">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between mb-8 px-4 animate-fadeIn">
          {isLoading ? (
            <>
              <div className="flex-shrink-0">
                <Skeleton className="w-48 h-8 mb-2" />
                <Skeleton className="w-64 h-4" />
              </div>
              <div className="grid grid-cols-3 gap-4 sm:flex sm:items-center sm:gap-6">
                <Skeleton className="w-32 h-16" />
                <Skeleton className="w-32 h-16" />
                <Skeleton className="w-32 h-16" />
              </div>
            </>
          ) : (
            <>
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">My Uploads</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Access your purchased AI models, datasets, and infrastructure services
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4 sm:flex sm:items-center sm:gap-6">
                <div className="bg-white p-4 rounded-xl border border-[#e1e3e5] text-center hover:border-[#0284a5] hover:shadow-lg transition-all duration-300 group">
                  <div className="flex flex-col items-center">
                    <div className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-[#0284a5] transition-colors">
                      {stats.totalAssets}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 whitespace-nowrap mt-1">Total Assets</div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#e1e3e5] text-center hover:border-[#0284a5] hover:shadow-lg transition-all duration-300 group">
                  <div className="flex flex-col items-center">
                    <div className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-[#0284a5] transition-colors">
                      {formatNumber(stats.totalPurchases.toString())}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 whitespace-nowrap mt-1">Total Purchases</div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#e1e3e5] text-center hover:border-[#0284a5] hover:shadow-lg transition-all duration-300 group">
                  <div className="flex flex-col items-center">
                    <div className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-[#0284a5] transition-colors">
                      ${formatNumber(stats.totalEarnings.toString())}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 whitespace-nowrap mt-1">Total Earnings</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="bg-white rounded-xl border border-[#e1e3e5] overflow-hidden mx-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Downloads
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pricing
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Skeleton className="w-24 h-6 rounded-full" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Skeleton className="w-48 h-4" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Skeleton className="w-32 h-4" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Skeleton className="w-16 h-4" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Skeleton className="w-20 h-4" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Skeleton className="w-24 h-4" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Skeleton className="w-12 h-4 ml-auto" />
                      </td>
                    </tr>
                  ))
                ) : (
                  paginatedData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {item.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{item.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.downloads}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.earnings}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.updatedAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => {
                            // Determine which edit page to navigate to based on item type
                            let editPath = '';
                            switch (item.type) {
                              case 'AI Model':
                                editPath = `/dashboard/upload/model`;
                                break;
                              case 'Dataset':
                                editPath = `/dashboard/upload/dataset`;
                                break;
                              case 'Infrastructure':
                                editPath = `/dashboard/upload/infra`;
                                break;
                            }
                            navigate(editPath, {
                              state: { 
                                editMode: true,
                                modelData: item
                              }
                            });
                          }}
                          className="text-[#0284a5] hover:text-[#026d8a]"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && MOCK_DATA.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={MOCK_DATA.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
    </div> 
  );
}