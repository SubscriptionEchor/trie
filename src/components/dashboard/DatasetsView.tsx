import { useState, useMemo, useEffect } from 'react';
import { ModelCard, SearchInput, EmptyState, FilterButton, Pagination, MobileFilterDrawer, ModelCardSkeleton, Skeleton } from '@/components/ui';
import { useAuth, useFilteredItems } from '@/hooks';

const ITEMS_PER_PAGE = 12;

const CATEGORY_ICONS = {
  '3D': {
    icon: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 018.25 20.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z',
    color: 'bg-gradient-to-br from-blue-500 to-indigo-500'
  },
  'Audio': {
    icon: 'M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z',
    color: 'bg-gradient-to-br from-purple-500 to-pink-500'
  },
  'Geospatial': {
    icon: 'M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z',
    color: 'bg-gradient-to-br from-amber-500 to-orange-500'
  },
  'Image': {
    icon: 'M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z',
    color: 'bg-gradient-to-br from-green-500 to-emerald-500'
  },
  'Tabular': {
    icon: 'M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5c-.621 0-1.125-.504-1.125-1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125-.504-1.125-1.125v-1.5c0-.621.504-1.125 1.125-1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125M10.875 16.5h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M18.375 16.5c.621 0 1.125.504 1.125 1.125M3.375 5.625c0-.621.504-1.125 1.125-1.125h1.5c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125h-1.5A1.125 1.125 0 013.375 7.125v-1.5zm17.25 0c0-.621-.504-1.125-1.125-1.125h-1.5c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125h1.5c.621 0 1.125-.504 1.125-1.125v-1.5zm-17.25 12c0-.621.504-1.125 1.125-1.125h1.5c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5zm17.25 0c0-.621-.504-1.125-1.125-1.125h-1.5c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125h1.5c.621 0 1.125-.504 1.125-1.125v-1.5z',
    color: 'bg-gradient-to-br from-red-500 to-rose-500'
  },
  'Text': {
    icon: 'M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z',
    color: 'bg-gradient-to-br from-cyan-500 to-blue-500'
  },
  'Time-series': {
    icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z',
    color: 'bg-gradient-to-br from-violet-500 to-purple-500'
  },
  'Video': {
    icon: 'M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z',
    color: 'bg-gradient-to-br from-fuchsia-500 to-pink-500'
  }
};

const DATASET_MODALITIES = {
  'Modalities': [
    '3D',
    'Audio',
    'Geospatial',
    'Image',
    'Tabular',
    'Text',
    'Time-series',
    'Video'
  ]
};

const FORMAT_CATEGORIES = {
  'File Formats': [
    'json',
    'csv',
    'parquet',
    'arrow'
  ],
  'Folder Types': [
    'imagefolder',
    'soundfolder',
    'webdataset',
    'text'
  ]
};

export function DatasetsView() {
  const [likedItems, setLikedItems] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);
  const { nftData, loader } = useAuth()
  const [dataset, setDataset] = useState<any[]>([])
  useEffect(() => {
    if (!nftData?.length) {
      return
    }
    let filteredData = nftData.filter((item: any) => item?.metadata?.type === 'dataset')
    setDataset(filteredData)

  }, [nftData])
  // const DATASETS = [
  //   {
  //     id: 'common-voice',
  //     creator: {
  //       name: 'Mozilla',
  //       avatar: 'M'
  //     },
  //     type: 'dataset',
  //     image: 'https://cdn.midjourney.com/d8fdb597-0d88-467d-8637-8022fb31dc1e/0_0.png',
  //     name: 'Common Voice',
  //     categories: ['Audio', 'Text', 'Multilingual'],
  //     description: 'Multi-language speech dataset with over 9,000 hours of recorded voice data.',
  //     updatedAt: '2 days ago',
  //     downloads: '2.3M',
  //     likes: '450'
  //   },
  //   ...Array.from({ length: 24 }, (_, i) => ({
  //     id: `dataset-${i + 2}`,
  //     creator: {
  //       name: `Creator ${i + 2}`,
  //       avatar: `C${i + 2}`
  //     },
  //     type: 'dataset',
  //     image: 'https://cdn.midjourney.com/d8fdb597-0d88-467d-8637-8022fb31dc1e/0_0.png',
  //     name: `Dataset ${i + 2}`,
  //     categories: Object.keys(CATEGORY_ICONS).slice(0, Math.floor(Math.random() * 2) + 2),
  //     description: 'A comprehensive dataset for AI training and research.',
  //     updatedAt: `${Math.floor(Math.random() * 30) + 1} days ago`,
  //     downloads: `${(Math.random() * 1000000).toFixed(0)}`,
  //     likes: `${(Math.random() * 10000).toFixed(0)}`
  //   }))
  // ];

  const {
    filteredItems: paginatedDatasets,
    totalItems,
    currentPage,
    totalPages,
    selectedFilters,
    clearFilters,
    setCurrentPage,
    handleFilterSelect
  } = useFilteredItems(dataset);

  const handleLike = (itemId: string, _likes: string) => {
    setLikedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const filteredCategories = useMemo(() => {
    if (!searchQuery) return DATASET_MODALITIES;

    const query = searchQuery.toLowerCase();
    const filtered: typeof DATASET_MODALITIES = {
      'Modalities': []
    };

    Object.entries(DATASET_MODALITIES).forEach(([, modalities]) => {
      const matchingModalities = modalities.filter(modality =>
        modality.toLowerCase().includes(query)
      );

      filtered['Modalities'] = matchingModalities;
    });

    return filtered;
  }, [searchQuery]);

  const filteredFormats = useMemo(() => {
    if (!searchQuery) return FORMAT_CATEGORIES;

    const query = searchQuery.toLowerCase();
    const filtered: typeof FORMAT_CATEGORIES = {
      'File Formats': [],
      'Folder Types': []
    };

    Object.entries(FORMAT_CATEGORIES).forEach(([category, formats]) => {
      const matchingFormats = formats.filter(format =>
        format.toLowerCase().includes(query)
      );

      filtered[category as keyof typeof FORMAT_CATEGORIES] = matchingFormats;
    });

    return filtered;
  }, [searchQuery]);

  // // Simulate loading state
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setIsLoading(false);
  //   }, 1500);
  //   return () => clearTimeout(timer);
  // }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-112px)] pt-6 pb-16 px-4 md:px-6 lg:px-8">
      {/* Mobile filter dialog */}
      <MobileFilterDrawer isOpen={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)}>
        <div className="space-y-6">
          {/* Search Input */}
          <div className="relative">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search formats..."
              onClear={() => setSearchQuery('')}
            />
          </div>

          {Object.entries(filteredCategories).map(([category, modalities]) => (
            <div key={category} className="bg-white rounded-xl shadow-sm border border-[#e1e3e5] p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900">{category}</h2>
              </div>
              <div className="space-y-2">
                {modalities.map((modality) => (
                  <FilterButton
                    key={modality}
                    label={modality}
                    icon={CATEGORY_ICONS[modality as keyof typeof CATEGORY_ICONS].icon}
                    color={CATEGORY_ICONS[modality as keyof typeof CATEGORY_ICONS].color}
                    isSelected={selectedFilters.has(modality)}
                    onSelect={() => handleFilterSelect(modality)}
                    onRemove={() => handleFilterSelect(modality)}
                  />
                ))}
              </div>
            </div>
          ))}

          {Object.entries(filteredFormats).map(([category, formats]) => (
            <div key={category} className="bg-white rounded-xl shadow-sm border border-[#e1e3e5] p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900">{category}</h2>
              </div>
              <div className="space-y-2">
                {formats.map((format) => (
                  <button
                    key={format}
                    className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <div className="w-5 h-5 bg-gradient-to-br from-gray-500 to-gray-600 rounded flex items-center justify-center text-white">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                        />
                      </svg>
                    </div>
                    <span className="font-mono">.{format}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </MobileFilterDrawer>

      <div className="lg:col-span-3 h-[calc(100vh-112px)] overflow-y-auto pb-16 scrollbar-hide">
        {/* Mobile filter button */}
        <div className="flex items-center justify-between mb-4 lg:hidden">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            onClick={() => setMobileFiltersOpen(true)}
          >
            <svg className="-ml-1 mr-2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
          </button>
          {selectedFilters.size > 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#0284a5] text-white">
              {selectedFilters.size} selected
            </span>
          )}
        </div>

        {loader ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <ModelCardSkeleton key={index} />
            ))}
          </div>
        ) : paginatedDatasets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paginatedDatasets.map((dataset, index) => (
              <ModelCard
                type="dataset"
                key={index}
                model={dataset}
                isLiked={likedItems[dataset.id || 0]}
                onLike={(id) => handleLike(id, dataset.likes || 0)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title={selectedFilters.size > 0 ? "No datasets found" : "No datasets available yet"}
            description={selectedFilters.size > 0
              ? "Try adjusting your filters or search terms"
              : "Be the first to contribute a dataset to the marketplace"}
            icon="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L9 8m4-4v12"
            action={{
              label: "Upload Dataset",
              href: "/dashboard/upload"
            }}
          />
        )}

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

      {/* Right Column */}
      <div className="space-y-6 h-[calc(100vh-112px)] overflow-y-auto pr-4 -mr-4 pb-16 scrollbar-hide w-[280px]">
        {/* Search Input */}
        {loader ? (
          <>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="w-20 h-6" />
              </div>
              <Skeleton className="w-full h-12 rounded-lg" />
            </div>
            {/* Skeleton filters */}
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-[#e1e3e5] p-6">
                <div className="mb-4">
                  <Skeleton className="w-32 h-6" />
                </div>
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="w-full h-10 rounded-lg" />
                  ))}
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                {selectedFilters.size > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-[#0284a5] hover:text-[#026d8a] flex items-center gap-1"
                  >
                    <span>Clear filters</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <SearchInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search formats..."
                onClear={() => setSearchQuery('')}
              />
            </div>

            {Object.entries(filteredCategories).map(([category, modalities]) => (
              <div key={category} className="bg-white rounded-xl shadow-sm border border-[#e1e3e5] p-6">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">{category}</h2>
                </div>
                <div className="space-y-2">
                  {modalities.map((modality) => (
                    <FilterButton
                      key={modality}
                      label={modality}
                      icon={CATEGORY_ICONS[modality as keyof typeof CATEGORY_ICONS].icon}
                      color={CATEGORY_ICONS[modality as keyof typeof CATEGORY_ICONS].color}
                      isSelected={selectedFilters.has(modality)}
                      onSelect={() => handleFilterSelect(modality)}
                      onRemove={() => handleFilterSelect(modality)}
                    />
                  ))}
                </div>
              </div>
            ))}

            {Object.entries(filteredFormats).map(([category, formats]) => (
              <div key={category} className="bg-white rounded-xl shadow-sm border border-[#e1e3e5] p-6">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">{category}</h2>
                </div>
                <div className="space-y-2">
                  {formats.map((format) => (
                    <button
                      key={format}
                      className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <div className="w-5 h-5 bg-gradient-to-br from-gray-500 to-gray-600 rounded flex items-center justify-center text-white">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                          />
                        </svg>
                      </div>
                      <span className="font-mono">.{format}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}