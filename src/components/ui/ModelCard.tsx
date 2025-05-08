import { getRelativeTimeString } from '@/utils';
import { motion } from 'framer-motion';
// import { LikeButton } from './LikeButton';
// import { formatNumber } from '@/utils/formatNumber';
import { useNavigate } from 'react-router-dom';

const CATEGORY_STYLES = {
  'Natural Language Processing': 'bg-green-50 text-green-700',
  'Multimodal': 'bg-purple-50 text-purple-700',
  'Computer Vision': 'bg-blue-50 text-blue-700',
  'Audio': 'bg-orange-50 text-orange-700',
  'Tabular': 'bg-indigo-50 text-indigo-700',
  'Reinforcement Learning': 'bg-yellow-50 text-yellow-700',
  'Text Generation': 'bg-emerald-50 text-emerald-700',
  'Image Generation': 'bg-rose-50 text-rose-700',
  'Video Generation': 'bg-cyan-50 text-cyan-700',
  'Chat Models': 'bg-fuchsia-50 text-fuchsia-700',
  'Vision Models': 'bg-sky-50 text-sky-700',
  'Other': 'bg-gray-50 text-gray-700'
};

// Define the ModelCardData interface
export interface ModelCardData {
  metadata?: {
    name?: string;
    description?: string;
    creator?: string;
    tags?: string[];
  };
  usageHistory?: any[] | undefined;
  image?: string;
  name?: string;
  likes: string | number;
  downloads?: string | number;
  id?: string;
  type?: string;
  pricing?: {
    model?: string;
    price?: string;
    currency?: string;
  };
  serviceName?: string;
  description?: string;
  categories?: string[];
  metrics?: Record<string, string | number>;
  epoch?: number;
}

interface ModelCardProps {
  model: ModelCardData;
  isLiked: boolean;
  likeCount?: number;
  onLike: (id: string, likes: string) => void;
  type: string;
  modalType?: string;
  onSelect?: () => void;
}

export function ModelCard({ model, type }: ModelCardProps) {
  const navigate = useNavigate();
  if (!model) return null;
  const handleCardClick = () => {
    if (type == "upload") {
      return
    }
    let slug = model?.metadata?.name || model?.name as any
    slug = slug.replace(/\s+/g, '-');
    if (type == "infra") {
      navigate(`/dashboard/providerDetails/${slug}`, {
        state: { model: { ...model, type } }
      });
      return
    }
    // Default to 'model' type if not specified

    navigate(`/dashboard/${type}/${slug}`, {
      state: { model: { ...model, type } }
    });
  };
  // function timeAgo(epochTimestamp: number): string {
  //   // If timestamp is in seconds (10 digits), convert to milliseconds
  //   if (epochTimestamp.toString().length === 10) {
  //     epochTimestamp = epochTimestamp * 1000;
  //   }

  //   const now = Date.now();
  //   const difference = now - epochTimestamp;

  //   // Convert milliseconds to seconds
  //   const seconds = Math.floor(difference / 1000);

  //   // Less than a minute
  //   if (seconds < 60) {
  //     return 'just now';
  //   }

  //   // Less than an hour
  //   const minutes = Math.floor(seconds / 60);
  //   if (minutes < 60) {
  //     return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
  //   }

  //   // Less than a day
  //   const hours = Math.floor(minutes / 60);
  //   if (hours < 24) {
  //     return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
  //   }

  //   // Less than a month
  //   const days = Math.floor(hours / 24);
  //   if (days < 30) {
  //     return days === 1 ? 'yesterday' : `${days} days ago`;
  //   }

  //   // Less than a year
  //   const months = Math.floor(days / 30);
  //   if (months < 12) {
  //     return months === 1 ? '1 month ago' : `${months} months ago`;
  //   }

  //   // A year or more
  //   const years = Math.floor(months / 12);
  //   return years === 1 ? '1 year ago' : `${years} years ago`;
  // }

  // Example usage:
  // const timestamp = 1712155123; // April 3, 2024
  // console.log(timeAgo(timestamp)); // Will output relative time

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onClick={handleCardClick}
      className="group bg-white rounded-xl border border-[#e1e3e5] hover:border-[#0284a5] hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col cursor-pointer min-h-[300px] relative"
    >
      {/* Image Container */}
      <div className="relative h-[200px] overflow-hidden bg-gray-50 flex-shrink-0 group-hover:after:absolute group-hover:after:inset-0 group-hover:after:bg-black/10 group-hover:after:transition-opacity">
        <img
          src={model?.image || 'https://cdn.midjourney.com/d8fdb597-0d88-467d-8637-8022fb31dc1e/0_0.png'}
          alt={model?.metadata?.name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-all duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {/* <div className="absolute top-3 right-3">
          <LikeButton
            className="like-button relative z-50"
            isLiked={isLiked}
            likes={likeCount?.toString() || model.likes}
            onLike={(e) => {
              e.stopPropagation();
              onLike(model.id || '', model?.likes?.toString() || '0');
            }}
          />
        </div> */}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex-1">
          {/* Model Name & Creator */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-medium shadow-sm flex-shrink-0">
              {model?.metadata?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-gray-900 leading-snug tracking-tight truncate font-display">
                {model?.metadata?.name}
              </h3>
              <p className="text-xs text-gray-500 truncate font-mono">
                {model?.serviceName?.split('/')[0]}
              </p>
            </div>
          </div>

          {/* Categories */}
          {type != "infra" && <div className="flex flex-wrap gap-2 mb-4">
            {['Audio', 'Text', 'Multilingual']?.map((category) => (
              <span key={category} className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${CATEGORY_STYLES[category as keyof typeof CATEGORY_STYLES] || CATEGORY_STYLES['Other']
                }`}>
                {category}
              </span>
            )) || null}
          </div>}

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-4">
            {model?.metadata?.description}
          </p>

          {/* Performance Metrics */}
          {model?.metrics && (
            <div className="grid grid-cols-2 gap-2 mb-4">
              {Object.entries(model?.metrics).map(([key, value]) => (
                <div key={key} className="bg-gray-50 rounded-lg p-2">
                  <div className="text-xs text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                  <div className="text-sm font-medium text-gray-900">{value}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-4">
            {/* <div className="flex items-center gap-2 text-sm text-gray-700">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>{formatNumber(model?.downloads || 0)}</span>
            </div> */}
            {model?.pricing && (
              <div className="text-sm font-medium text-[#0284a5]">
                ${model?.pricing?.price} {model?.pricing?.model === 'pay-per-use' ? '/ call' : ''}
              </div>
            )}
          </div>
          <span className="text-xs text-gray-500">
            {(model?.usageHistory && model?.usageHistory?.length > 0) ? `Updated ${getRelativeTimeString(model?.usageHistory[model?.usageHistory?.length - 1]?.Epoch)}` : "-"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}