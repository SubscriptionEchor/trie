import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
// import { useAuth } from '@/hooks'; 
import { Modal, Skeleton } from '@/components/ui';

const UPLOAD_OPTIONS = [
  {
    id: 'model',
    title: 'Add AI Model',
    description: 'Share your AI model with the community',
    route: '/dashboard/upload/model',
    icon: 'M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H15M2.25 15h19.5m-16.5 0h13.5M9 3.75l2.25 4.5m0 0L15 3.75M11.25 8.25h4.5',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'dataset',
    title: 'Add Dataset',
    description: 'Contribute your dataset to the marketplace',
    route: '/dashboard/upload/dataset',
    icon: 'M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'infra',
    title: 'Add Infrastructure Service',
    description: 'Provide computing resources for AI workloads',
    route: '/dashboard/upload/infra',
    icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z',
    color: 'from-green-500 to-emerald-500'
  }
];

export function DataProviderView() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const connect = localStorage.getItem('connect');
    setIsWalletConnected(connect === 'true');
  }, []);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Check if we're returning from a specific upload page
    const path = location.pathname;
    if (path.includes('dataset')) {
      setSelectedOption('dataset');
    } else if (path.includes('model')) {
      setSelectedOption('model');
    } else if (path.includes('infra')) {
      setSelectedOption('infra');
    }
  }, [location]);

  const handleOptionClick = (optionId: string) => {
    if (!isWalletConnected) {
      setShowAuthModal(true);
      return;
    }
    setSelectedOption(optionId);
  };

  const handleNext = () => {
    if (!isWalletConnected) {
      setShowAuthModal(true);
      return;
    }

    if (!selectedOption) {
      return;
    }

    switch (selectedOption) {
      case 'dataset':
        navigate('/dashboard/upload/dataset');
        break;
      case 'model':
        navigate('/dashboard/upload/model');
        break;
      case 'infra':
        navigate('/dashboard/upload/infra');
        break;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 md:px-6 lg:px-8 h-[calc(100vh-112px)] pt-6 pb-16">
      {/* Left Column - Image */}
      <div className="hidden lg:block">
        <div className="w-full h-full rounded-xl overflow-hidden">
          {isLoading ? (
            <Skeleton className="w-full h-full rounded-xl" />
          ) : (
            <img 
              src="https://cdn.midjourney.com/d8fdb597-0d88-467d-8637-8022fb31dc1e/0_0.png"
              alt="AI Marketplace"
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </div>
      
      {/* Right Column - Upload Options */}
      <div className="max-w-xl mx-auto w-full">
        {isLoading ? (
          <>
            <Skeleton className="w-3/4 h-8 mb-4" />
            <Skeleton className="w-full h-6 mb-8" />
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">What would you like to add?</h1>
            <p className="text-lg text-gray-600 mb-8">Choose what type of content you want to contribute to the marketplace.</p>
          </>
        )}

        <div className="space-y-6">
          {isLoading ? Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="w-full px-6 py-5 bg-white border-2 border-gray-200 rounded-2xl">
              <div className="flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="w-48 h-6 mb-2" />
                  <Skeleton className="w-full h-4" />
                </div>
              </div>
            </div>
          )) : UPLOAD_OPTIONS.map((option) => (
            <motion.div
              key={option.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleOptionClick(option.id)}
              className={`w-full px-6 py-5 text-left bg-white hover:bg-gray-50 border-2 ${
                selectedOption === option.id ? 'border-[#0284a5]' : 'border-gray-200'
              } rounded-2xl cursor-pointer transition-all duration-200 relative group shadow-sm hover:shadow-md`}
            >
              <div className="flex items-center">
                <div className={`w-12 h-12 bg-gradient-to-br ${option.color} rounded-lg flex items-center justify-center text-white mb-4 mr-4`}>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={option.icon} />
                  </svg>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 ${
                  selectedOption === option.id ? 'border-[#0284a5]' : 'border-gray-300'
                } flex items-center justify-center mr-4`}>
                  {selectedOption === option.id && (
                    <div className="w-3 h-3 rounded-full bg-[#0284a5]" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold ${
                  selectedOption === option.id ? 'text-[#0284a5]' : 'text-gray-900'
                  }`}>{option.title}</h3>
                  <p className="text-sm text-gray-500 mt-2">{option.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="flex justify-end mt-10">
          <button
            onClick={handleNext}
            disabled={!selectedOption}
            className="px-8 py-3 bg-[#0284a5] text-white text-sm font-medium rounded-xl hover:bg-[#026d8a] transition-all duration-200 shadow-sm hover:shadow-md"
          >
            NEXT
          </button>
        </div>
      </div>
      
      <Modal
        show={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Connect Your Wallet"
      >
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <img src="https://learn.rubix.net//images/logo.png" alt="XELL" className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h3>
          <p className="text-gray-600 mb-6">Please connect your XELL wallet to add content to the marketplace</p>
          <button
            onClick={() => {
              localStorage.setItem('connect', 'true');
              setIsWalletConnected(true);
              setShowAuthModal(false);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-[#0284a5] hover:bg-[#026d8a]"
          >
            Connect XELL Wallet
          </button>
        </div>
      </Modal>
    </div>
  );
}