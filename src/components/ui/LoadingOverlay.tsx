import { motion } from 'framer-motion';

interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({ message = 'Uploading...' }: LoadingOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-xl p-8 flex flex-col items-center max-w-sm mx-4">
        <div className="w-12 h-12 mb-4">
          <svg className="animate-spin w-full h-full text-[#0284a5]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
        <p className="text-gray-900 font-medium text-center">{message}</p>
      </div>
    </motion.div>
  );
}