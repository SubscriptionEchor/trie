import { Model } from '@/types/models';

interface SidebarProps {
  item: Model;
  selectedDataset: string;
  selectedInfra: string;
  showTryButton: boolean;
  onDatasetChange: (value: string) => void;
  onInfraChange: (value: string) => void;
  onPurchase: () => void;
  uploading?: boolean;
}

// const MOCK_DATASETS = [
//   { id: 'dataset-1', name: 'Common Voice Dataset' },
//   { id: 'dataset-2', name: 'ImageNet Dataset' },
//   { id: 'dataset-3', name: 'COCO Dataset' },
//   { id: 'dataset-4', name: 'SQuAD Dataset' }
// ];

// const MOCK_INFRA = [
//   { id: 'infra-1', name: 'AWS P4d Instance' },
//   { id: 'infra-2', name: 'Google Cloud TPU' },
//   { id: 'infra-3', name: 'Azure GPU Cluster' },
//   { id: 'infra-4', name: 'Lambda Cloud GPU' }
// ];

export function Sidebar({
  uploading,
  item,
  // selectedDataset,
  // selectedInfra,
  // showTryButton,
  // onDatasetChange,
  // onInfraChange,
  onPurchase
}: SidebarProps) {
  // Determine the item type
  const itemType = item.type?.toLowerCase() || '';
  const isModel = itemType === 'model';
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-[#e1e3e5] overflow-hidden">
        <img src={item.image || 'https://cdn.midjourney.com/d8fdb597-0d88-467d-8637-8022fb31dc1e/0_0.png'} alt={item?.metadata?.name} className="w-full h-48 object-cover" />
      </div>

      <div className="bg-white rounded-xl border border-[#e1e3e5] p-6">
        {/* Buy Button */}
        <button
          disabled={uploading}
          onClick={onPurchase}
          className="w-full px-4 py-2 bg-[#0284a5] text-white text-sm font-medium rounded-lg hover:bg-[#026d8a] transition-colors flex items-center justify-center gap-2"
        >
          {uploading ? <div className="flex justify-center items-center ">
            <div className="loader border-t-transparent border-solid border-2 border-white-500 rounded-full animate-spin w-6 h-6"></div>
          </div> :
            <>
              <span>Buy Now</span>
              <span className="text-white/80">{parseFloat(item?.nft_value || "0") * 1000} TRIE</span>
            </>}
        </button>

        {/* Additional options only for AI Models */}
        {isModel && (
          <>
            {/* Dataset Selection */}
            {/* <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#0284a5]/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#0284a5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Use with Dataset</div>
                  <select
                    value={selectedDataset}
                    onChange={(e) => onDatasetChange(e.target.value)}
                    className="mt-2 w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#0284a5] focus:border-[#0284a5]"
                  >
                    <option value="">Select a dataset</option>
                    {MOCK_DATASETS.map(dataset => (
                      <option key={dataset.id} value={dataset.id} className="text-gray-900">
                        {dataset.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div> */}

            {/* Infrastructure Selection */}
            {/* <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#0284a5]/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-[#0284a5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">Use with Infrastructure</div>
                <select
                  value={selectedInfra}
                  onChange={(e) => onInfraChange(e.target.value)}
                  className="mt-2 w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#0284a5] focus:border-[#0284a5]"
                >
                  <option value="">Select infrastructure</option>
                  {MOCK_INFRA.map(infra => (
                    <option key={infra.id} value={infra.id} className="text-gray-900">
                      {infra.name}
                    </option>
                  ))}
                </select>
              </div>
            </div> */}

            {/* Try in Playground Button */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              {/* <button
                className={`w-full px-4 py-2 border text-sm font-medium rounded-lg transition-colors ${showTryButton
                  ? 'border-[#0284a5] text-[#0284a5] hover:bg-[#0284a5]/10'
                  : 'border-gray-300 text-gray-400 cursor-not-allowed'
                  }`}
                disabled={!showTryButton}
              >
                Try in Playground
              </button> */}
              {/* {!showTryButton && (
                <p className="mt-2 text-xs text-center text-gray-500">
                  Select both a dataset and infrastructure to try the model
                </p>
              )} */}
            </div>
          </>
        )}
      </div>
    </div>
  );
}