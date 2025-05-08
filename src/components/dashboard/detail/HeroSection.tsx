// import { LikeButton } from '@/components/ui';
import { Model } from '@/types/models';
import moment from 'moment';

interface HeroSectionProps {
  history: any[];
  item: Model;
  // isLiked: boolean;
  // onLike: () => void;
}

export function HeroSection({ history, item, }: HeroSectionProps) {

  return (
    <div className="bg-white border-b border-[#e1e3e5] mt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-xl md:text-3xl font-bold text-gray-900">
                <div className="flex items-center gap-2">
                  {item?.metadata?.name}
                  <div className="relative group">
                    <svg className="w-5 h-5 text-[#0284a5]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    {/* <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="font-medium mb-1">Verified Model</div>
                      <div className="text-gray-300 font-mono">Hash: {item.id}</div>
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-2 h-2 bg-gray-900 transform rotate-45"></div>
                    </div> */}
                  </div>
                </div>
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#0284a5]/10 text-[#0284a5] capitalize">
                {item.metadata?.type}
              </span>
            </div>
            <div
              className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-sm text-gray-500 cursor-pointer"
            // onClick={() => navigate(`/dashboard/creator/${item?.metadata?.name}`)}
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm">
                  {item?.metadata?.name?.charAt(0)?.toUpperCase()}
                </div>
                <span className="hover:text-[#0284a5] transition-colors">
                  {item?.metadata?.name}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                {history?.length ? <span>Updated {moment(history?.[history?.length - 1]?.Epoch * 1000).format("DD-MMM-YYYY HH:mm:ss")}</span> : '-'}
                {/* <span className="hidden sm:inline">•</span> */}
                {/* <span>{item?.license} License</span> */}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-6 text-gray-900">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {history?.length ? <span className="font-medium text-gray-900">{history?.length - 1 || 0}</span> : '-'}
          </div>
          {/* <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="font-medium text-gray-900">{item.views || 0}</span>
          </div> */}
          {/* <LikeButton
            isLiked={isLiked}
            likes={item?.stars}
            onLike={onLike}
          /> */}
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 mt-6">
          {item?.tags?.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors cursor-pointer"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}