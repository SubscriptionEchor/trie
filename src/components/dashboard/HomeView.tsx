import {
  useState,
  //  useCallback 
} from 'react';
import {
  EmptyState,
  // LikeButton, 
  TrendingItemSkeleton,
  // SetupGuideSkeleton, Skeleton 
} from '@/components/ui';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks';
import { getRelativeTimeString } from '@/utils';

export function HomeView() {
  // const [showSetupGuide, setShowSetupGuide] = useState(true);
  // const [likedItems, setLikedItems] = useState<Record<string, boolean>>({});
  // const [isLoading, setIsLoading] = useState(true);
  const { nftData, loader } = useAuth()
  const [modelData, setModalData] = useState([])
  const [datasetData, setDatasetData] = useState([])

  useEffect(() => {
    if (!nftData?.length) {
      return
    }
    setModalData(
      nftData
        ?.filter((data: any) =>
          data?.metadata?.type === "model" &&
          data?.usageHistory &&
          Array.isArray(data.usageHistory) &&
          data.usageHistory.length > 0
        )
        ?.sort((a: any, b: any) => {
          // Skip if either doesn't have valid usageHistory
          if (!a?.usageHistory?.length || !b?.usageHistory?.length) return 0;

          const aEpoch = a.usageHistory[a.usageHistory.length - 1]?.Epoch;
          const bEpoch = b.usageHistory[b.usageHistory.length - 1]?.Epoch;

          // Skip comparison if either epoch is missing
          if (aEpoch === undefined || bEpoch === undefined) return 0;

          // Sort by latest epoch (descending order)
          return bEpoch - aEpoch;
        })
    )
    setDatasetData(
      nftData
        ?.filter((data: any) =>
          data?.metadata?.type === "dataset" &&
          data?.usageHistory &&
          Array.isArray(data.usageHistory) &&
          data.usageHistory.length > 0
        )
        ?.sort((a: any, b: any) => {
          // Skip if either doesn't have valid usageHistory
          if (!a?.usageHistory?.length || !b?.usageHistory?.length) return 0;

          const aEpoch = a.usageHistory[a.usageHistory.length - 1]?.Epoch;
          const bEpoch = b.usageHistory[b.usageHistory.length - 1]?.Epoch;

          // Skip comparison if either epoch is missing
          if (aEpoch === undefined || bEpoch === undefined) return 0;

          // Sort by latest epoch (descending order)
          return bEpoch - aEpoch;
        })
    )

  }, [nftData])
  const navigate = useNavigate();

  // Simulate loading state
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setIsLoading(false);
  //   }, 1500);
  //   return () => clearTimeout(timer);
  // }, []);

  // const handleLike = useCallback((itemId: string, _currentLikes?: string) => {
  //   setLikedItems(prev => {
  //     const wasLiked = prev[itemId];
  //     const newLikedItems = { ...prev, [itemId]: !wasLiked };
  //     return newLikedItems;
  //   });
  // }, []);
  // console.log(nftData, 'nftData')
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-112px)] pt-6 pb-16 px-4 md:px-6 lg:px-8">
      {/* Main Content Column */}
      <div className="lg:col-span-3 h-[calc(100vh-112px)] overflow-y-auto pb-16 scrollbar-hide">
        <div>
          {/* Trending Section */}
          <div>
            {/* <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <h2 className="text-lg font-semibold text-gray-900">Trending</h2>
                <span className="text-sm text-gray-500">last 7 days</span>
              </div>
            </div> */}

            {/* Trending Items */}
            <div className="space-y-4 ">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <h2 className="text-lg font-semibold text-gray-900">AI Models</h2>
                <span className="text-sm text-gray-500">(Top 5) </span>
              </div>
              {loader ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TrendingItemSkeleton key={index} />
                ))
              ) : (
                <>

                  {modelData?.length > 0 ? modelData?.slice(0, 5).map((option: any, index: number) => {
                    return (
                      <div
                        key={index}
                        onClick={() => navigate(`/dashboard/model/${option?.metadata?.name?.replace(/\s+/g, '-')?.replace(/\//g, '-')}`, { state: { model: { ...option, type: option?.metadata?.type } } })}
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer bg-white shadow-sm border border-[#e1e3e5]"
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className={`w-8 h-8 bg-gradient-to-br rounded-lg bg-gray-200 flex text-gray-900 items-center justify-center  font-medium`}>
                            {option?.metadata?.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                              {option?.metadata?.name}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              {/* <span>{option.type}</span> */}
                              {/* <span>•</span> */}
                              {option?.usageHistory?.length > 0 ? <span>Updated {getRelativeTimeString(Number(option?.usageHistory[option?.usageHistory?.length - 1]?.Epoch))}</span> : '-'}
                            </div>
                          </div>
                        </div>
                        {/* <div className="flex items-center gap-4 text-sm text-gray-600 w-full sm:w-auto justify-between mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0">
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            {option.downloads}
                          </div>
                          <LikeButton
                            className="like-button"
                            isLiked={likedItems[option.name]}
                            likes={option.likes}
                            onLike={() => handleLike(option.name)}
                          />
                        </div> */}
                      </div>
                    )
                  }) :
                    <EmptyState
                      title={"No AI models available yet"}
                      showBackToHome={false}
                      icon="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L9 8m4-4v12"
                      action={{
                        label: "Upload Dataset",
                        href: "/dashboard/upload-model"
                      }}
                    />
                  }
                  {modelData?.length > 5 ? <div className='text-gray-900 flex justify-center ' onClick={() => navigate('/dashboard/models')}>
                    <div className='bg-primary font-medium p-1 rounded-lg cursor-pointer text-white w-fit'>
                      See more
                    </div>
                  </div> : null}

                </>
              )}
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <h2 className="text-lg font-semibold text-gray-900">Datasets</h2>
                <span className="text-sm text-gray-500">(Top 5) </span>
              </div>
              {loader ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TrendingItemSkeleton key={index} />
                ))
              ) : (
                <>

                  {datasetData?.length > 0 ? datasetData?.slice(0, 5).map((option: any, index: number) => {
                    return (
                      <div
                        key={index}
                        onClick={() => navigate(`/dashboard/model/${option?.metadata?.name?.replace(/\s+/g, '-')?.replace(/\//g, '-')}`, { state: { model: { ...option, type: option?.metadata?.type } } })}
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer bg-white shadow-sm border border-[#e1e3e5]"
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className={`w-8 h-8 bg-gradient-to-br rounded-lg bg-gray-200 flex text-gray-900 items-center justify-center  font-medium`}>
                            {option?.metadata?.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                              {option?.metadata?.name}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              {/* <span>{option.type}</span> */}
                              {/* <span>•</span> */}
                              {option?.usageHistory?.length > 0 ? <span>Updated {getRelativeTimeString(Number(option?.usageHistory[option?.usageHistory?.length - 1]?.Epoch))}</span> : '-'}
                            </div>
                          </div>
                        </div>
                        {/* <div className="flex items-center gap-4 text-sm text-gray-600 w-full sm:w-auto justify-between mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0">
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            {option.downloads}
                          </div>
                          <LikeButton
                            className="like-button"
                            isLiked={likedItems[option.name]}
                            likes={option.likes}
                            onLike={() => handleLike(option.name)}
                          />
                        </div> */}
                      </div>
                    )
                  }) :
                    <EmptyState
                      title={"No datasets available yet"}

                      icon="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L9 8m4-4v12"
                      showBackToHome={false}
                      action={{
                        label: "Upload Dataset",
                        href: "/dashboard/upload-dataset"
                      }}
                    />
                  }
                  {datasetData?.length > 5 ? <div className='text-gray-900 flex justify-center ' onClick={() => navigate('/dashboard/datasets')}>
                    <div className='bg-primary font-medium p-1 rounded-lg cursor-pointer text-white w-fit'>
                      See more
                    </div>
                  </div> : null}

                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Setup Guide Column */}
      {/* <div className="space-y-6 h-[calc(100vh-112px)] overflow-y-auto pr-4 -mr-4 pb-16 scrollbar-hide">
        {isLoading ? (
          <>
            <SetupGuideSkeleton />
            <div className="bg-white rounded-xl shadow-sm border border-[#e1e3e5] p-6 space-y-4">
              <Skeleton className="w-48 h-6" />
              <Skeleton className="w-full h-16 rounded-lg" />
              <Skeleton className="w-full h-16 rounded-lg" />
              <Skeleton className="w-full h-16 rounded-lg" />
            </div>
          </>
        ) : (
          <>
            {showSetupGuide && (
              <div className="bg-white rounded-xl shadow-sm border border-[#e1e3e5] overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Setup guide</h2>
                      <p className="text-sm text-gray-500">0 / 3 completed</p>
                    </div>
                    <button
                      onClick={() => setShowSetupGuide(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-6">
                   
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-200">
                        <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-sm font-medium text-gray-900">Connect XELL wallet</h3>
                        <p className="mt-1 text-sm text-gray-500">Connect your wallet to start using the marketplace</p>
                        <button className="mt-2 text-sm text-[#0284a5] hover:text-[#026d8a]">
                          Connect wallet
                        </button>
                      </div>
                    </div>

                   
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-200">
                        <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-sm font-medium text-gray-900">Add a product</h3>
                        <p className="mt-1 text-sm text-gray-500">Add your first AI model or dataset</p>
                        <button className="mt-2 text-sm text-[#0284a5] hover:text-[#026d8a]">
                          Add product
                        </button>
                      </div>
                    </div>

                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-200">
                        <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-sm font-medium text-gray-900">Make 10 sales to reach level 2</h3>
                        <p className="mt-1 text-sm text-gray-500">All users start at level 1</p>
                        <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5">
                          <div className="bg-[#0284a5] h-1.5 rounded-full" style={{ width: '0%' }}></div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">0 of 10 sales</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-[#e1e3e5] p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Resources</h2>
              <div className="space-y-4">
                <div className="block p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors cursor-pointer">
                  <h3 className="text-sm font-medium text-gray-900">Seller Guide</h3>
                  <p className="mt-1 text-sm text-gray-500">Learn how to effectively sell your AI models</p>
                </div>
                <div className="block p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors cursor-pointer">
                  <h3 className="text-sm font-medium text-gray-900">Buyer Guide</h3>
                  <p className="mt-1 text-sm text-gray-500">Tips for finding and evaluating AI models</p>
                </div>
                <div className="block p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors cursor-pointer">
                  <h3 className="text-sm font-medium text-gray-900">Best Practices</h3>
                  <p className="mt-1 text-sm text-gray-500">Recommended practices for the marketplace</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div> */}
    </div>
  );
}