import { useParams } from 'react-router-dom';
import { ModelCard, Pagination, ModelCardSkeleton, Skeleton } from '@/components/ui';
import { useLikes } from '@/hooks';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Breadcrumbs } from '@/components/ui';

const ITEMS_PER_PAGE = 6;

const MOCK_CREATOR = {
  name: 'AI Research Labs',
  avatar: 'A',
  bio: 'Leading AI research organization focused on advancing NLP technology',
  location: 'San Francisco, CA',
  website: 'https://airesearchlabs.com',
  joinedDate: '2023-01-15',
  stats: {
    models: 12,
    datasets: 5,
    downloads: '45.2k',
    likes: '12.5k'
  },
  socialLinks: {
    twitter: 'https://twitter.com/airesearchlabs',
    github: 'https://github.com/airesearchlabs',
    linkedin: 'https://linkedin.com/company/airesearchlabs'
  }
};

const MOCK_CONTENT = {
  models: Array.from({ length: 6 }, (_, i) => ({
    id: `model-${i + 1}`,
    type: 'model',
    name: `Advanced NLP Model ${i + 1}`,
    description: 'State-of-the-art natural language processing model for text generation and analysis.',
    creator: MOCK_CREATOR,
    image: 'https://cdn.midjourney.com/d8fdb597-0d88-467d-8637-8022fb31dc1e/0_0.png',
    categories: ['NLP', 'Text Generation'],
    downloads: `${Math.floor(Math.random() * 10000)}`,
    likes: `${Math.floor(Math.random() * 1000)}`,
    updatedAt: '2 days ago'
  })),
  datasets: Array.from({ length: 4 }, (_, i) => ({
    id: `dataset-${i + 1}`,
    type: 'dataset',
    name: `NLP Training Dataset ${i + 1}`,
    description: 'High-quality dataset for training language models.',
    creator: MOCK_CREATOR,
    image: 'https://cdn.midjourney.com/d8fdb597-0d88-467d-8637-8022fb31dc1e/0_0.png',
    categories: ['Text', 'Multilingual'],
    downloads: `${Math.floor(Math.random() * 10000)}`,
    likes: `${Math.floor(Math.random() * 1000)}`,
    updatedAt: '3 days ago'
  }))
};

export function CreatorProfileView() {
  const { creatorId: _ } = useParams(); // Ignore unused param
  const [currentPage, setCurrentPage] = useState(1);
  const { likedItems, likeCounts, handleLike } = useLikes();
  const [activeTab, setActiveTab] = useState('models');
  const [isLoading, setIsLoading] = useState(true);

  // Calculate pagination
  const currentContent = MOCK_CONTENT[activeTab as keyof typeof MOCK_CONTENT];
  const totalItems = currentContent.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedContent = currentContent.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset to first page when changing tabs
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="px-4 md:px-6 lg:px-8 py-4 md:py-8">
      {/* Breadcrumbs Navigation */}
      <div className="mb-6 max-w-6xl mx-auto">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/dashboard/all' },
            { label: 'Creators', href: '/dashboard/all' },
            { label: MOCK_CREATOR.name }
          ]}
        />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Creator Profile Header - Mobile First Design */}
        <div className="bg-white rounded-xl border border-[#e1e3e5] p-4 md:p-8 mb-6 md:mb-8 animate-fadeIn">
          {isLoading ? (
            <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
              <Skeleton variant="rectangular" className="w-20 h-20 md:w-24 md:h-24 rounded-xl" />
              <div className="flex-1">
                <Skeleton className="w-48 h-6 mb-2" />
                <Skeleton className="w-96 h-4 mb-4" />
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <Skeleton className="w-32 h-4" />
                  <Skeleton className="w-48 h-4" />
                </div>
                <div className="grid grid-cols-4 gap-6 mt-6 pt-6 border-t border-gray-100">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i}>
                      <Skeleton className="w-16 h-6 mb-1" />
                      <Skeleton className="w-24 h-4" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-8">
              {/* Avatar */}
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl md:text-4xl font-semibold">
                {MOCK_CREATOR.avatar}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-col gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{MOCK_CREATOR.name}</h1>
                    <p className="text-gray-600 mb-4 text-base leading-relaxed">{MOCK_CREATOR.bio}</p>
                    <div className="flex flex-col sm:flex-row gap-3 text-sm text-gray-500">
                      {MOCK_CREATOR.location && (
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{MOCK_CREATOR.location}</span>
                        </div>
                      )}
                      {MOCK_CREATOR.website && (
                        <span
                          className="flex items-center gap-1 text-[#0284a5] hover:text-[#026d8a]"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                          <span>{new URL(MOCK_CREATOR.website).hostname}</span>
                        </span>
                      )}
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Joined {new Date(MOCK_CREATOR.joinedDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="flex items-center gap-3 mt-2 md:mt-0">
                    {Object.entries(MOCK_CREATOR.socialLinks).map(([platform]) => (
                      <motion.button
                        key={platform}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          {platform === 'twitter' && (
                            <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                          )}
                          {platform === 'github' && (
                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                          )}
                          {platform === 'linkedin' && (
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 6a2 2 0 1 1-2 2 2 2 0 0 1 2-2z" />
                          )}
                        </svg>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 mt-6 pt-6 border-t border-gray-100">
                  {Object.entries(MOCK_CREATOR.stats).map(([key, value]) => (
                    <motion.div key={key} whileHover={{ y: -2 }} className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{value}</div>
                      <div className="text-sm text-gray-500 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content Tabs */}
        <div className="mb-8 animate-fadeIn">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-4 md:space-x-8 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => handleTabChange('models')}
                className={`
                  px-3 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex-shrink-0
                  ${activeTab === 'models'
                    ? 'border-[#0284a5] text-[#0284a5]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                Models ({MOCK_CONTENT.models.length})
              </button>
              <button
                onClick={() => handleTabChange('datasets')}
                className={`
                  px-3 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex-shrink-0
                  ${activeTab === 'datasets'
                    ? 'border-[#0284a5] text-[#0284a5]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                Datasets ({MOCK_CONTENT.datasets.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 animate-fadeIn">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) =>
              <ModelCardSkeleton key={index} />
            )
          ) : (
            paginatedContent.map((item, index) =>
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ModelCard
                  type="creater"
                  model={item}
                  isLiked={likedItems[item.id]}
                  likeCount={likeCounts[item.id]}
                  onLike={(id, likes) => handleLike(id, likes)}
                />
              </motion.div>
            )
          )}
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
    </div>
  );
}