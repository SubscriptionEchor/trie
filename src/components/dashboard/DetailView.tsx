import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Breadcrumbs,
  DetailViewSkeleton,
  OverviewSkeleton,
  FilesSkeleton,
  MetricsSkeleton,
  DiscussionsSkeleton,
} from '@/components/ui';
import { HeroSection, NavigationTabs, Sidebar } from './detail';
import { useAuth } from '@/hooks';
import { END_POINTS } from '@/api/requests';
import moment from 'moment';
import toast from 'react-hot-toast';
import { CONSTANTS } from '@/utils';

interface Tab {
  id: string;
  label: string;
}

const TABS: Tab[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'files', label: 'Files' },
  // { id: 'usage', label: 'Usage Guide' },
  { id: 'metrics', label: 'Metrics' },
  { id: 'discussions', label: 'Discussions' },
  { id: 'history', label: 'Usage History' }
];

export function DetailView() {
  const { id: _ } = useParams(); // Ignore unused param since we're using mock data
  const { connectedWallet, socketRef, setNftData, nftData, loader } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  // const [isLiked, setIsLiked] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [selectedOption, setSelectedOption] = useState<'dataset' | 'infra' | null>(null);
  const [selectedDataset, setSelectedDataset] = useState('');
  const [selectedInfra, setSelectedInfra] = useState('');
  const [showTryButton, setShowTryButton] = useState(false);
  const [nftFile, setNftFile] = useState<string | null>(null);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const location = useLocation();
  let modelData = location?.state?.model || null;
  const navigate = useNavigate();
  const messageHandlerRef = useRef<any>(null);
  const { id } = useParams();
  const [model, setModel] = useState<any>({})

  useEffect(() => {
    if (modelData) {
      setModel(modelData)
    }
    else if (!loader && nftData?.length) {
      let name = id?.split("-")?.join(" ")
      let result = nftData?.find((item: any) => item?.metadata?.name == name)
      if (!result) {
        navigate('/dashboard/all')
      }
      setModel({
        ...result,
        type: result?.metadata?.type
      })
    }
    else if (!loader && nftData?.length) {
      navigate('/dashboard/all')
    }

  }, [modelData, nftData, loader])

  console.log(showPurchaseModal, setShowAuthModal, setShowPurchaseModal, showAuthModal, loader, loader, selectedOption, selectedDataset, selectedInfra, showTryButton);

  // Update showTryButton when both dataset and infra are selected
  useEffect(() => {
    setShowTryButton(!!selectedDataset && !!selectedInfra);
  }, [selectedDataset, selectedInfra]);

  useEffect(() => {
    if (model?.usageHistory?.length > 0) {
      setHistoryData(model?.usageHistory);
    }
  }, [model])

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
  useEffect(() => {
    (async () => {
      if (!model?.nft) {
        return
      }
      let nftfile = await END_POINTS.get_articfact_by_nft_id({ id: model?.nft }) as any;
      if (nftfile?.status) {
        setNftFile(nftfile?.artifactFileName);
      }
    })()
  }, [model])

  async function loadHistory() {
    let history = await END_POINTS.get_usage_history({ nft: model?.nft }) as any;
    if (history?.status && history?.NFTDataReply?.length) {
      setHistoryData(history?.NFTDataReply);
      setNftData((prev: any) => {
        return prev.map((item: any) => {
          if (item.nft == model?.nft) {
            return {
              ...item,
              usageHistory: history?.NFTDataReply
            }
          }
          return item
        })
      });
    }
  }


  const downloadFile = async () => {
    try {
      let artifact: any = await END_POINTS.download_artifact({ id: model?.nft });
      if (!artifact) {
        return
      }
      // Get the appropriate MIME type based on extension
      const extension = nftFile?.split('.') ?? [];

      // Create a blob with the content and the appropriate type
      const blob = new Blob([artifact], { type: extension[1] });

      // Create a URL for the blob
      const url = URL.createObjectURL(blob);

      // Create a link element
      const a = document.createElement('a');
      a.href = url;
      a.download = `${nftFile}`; // Set the desired file name

      // Add the link to the document and click it
      document.body.appendChild(a);
      a.click();

      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);


    } catch (error) {
      console.error(`Error: ${(error as Error)?.message}`);
    }
  };


  const handlePurchase = async () => {
    if (!connectedWallet?.did) {
      toast.error("Please connect your wallet.")
      return
    }
    if (messageHandlerRef.current) {
      window.removeEventListener('message', messageHandlerRef.current);
      messageHandlerRef.current = null;
    }
    let data = {
      use_asset: {
        "asset_usage_price": parseFloat(model?.nft_value || 0) * 1000,
        "asset_user_did": connectedWallet?.did,
        "asset_usage_purpose": `${model?.type} bought by ${connectedWallet?.did} | timestamp: ${new Date().toISOString()}`,
        "asset_denom": "TRIE",
        "asset_owner_did": model?.owner_did,
        "asset_id": model?.nft,
        "asset_value": parseFloat(model?.nft_value || 0),
        "ft_denom_creator": "bafybmic3imrko6w2scgezyjt2a26pzfgbag5lxzkm3zus2pojku6bv3sxu",
      }
    }

    const messageHandler = (event: any) => {

      const result = event.data.data
      if (!result?.status) {
        toast.error(result?.message);
        setUploading(false)
        return
      }
      toast.success(result?.message);
      if (event?.data?.type == "CONTRACT_RESULT" && result?.step == "EXECUTE" && result?.status) {
        setUploading(true)
        return
      }
      else if (event?.data?.type == "NFT_RESULT" && result?.step == "SIGNATURE") {
        let message = {
          resut: null,
          message: event.data.data?.message,
          status: true,
        }
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
          socketRef.current.send(typeof message === 'string' ? message : JSON.stringify(message));
          console.log('Message sent:', message);
          setUploading(false)
          downloadFile()
          loadHistory()
          return true;
        } else {
          console.error('WebSocket is not connected. Message not sent.');
          return false;
        }
      }
      else if (event?.data?.type == "FT_RESULT" && result?.step == "SIGNATURE") {
        let message = {
          resut: null,
          message: event.data.data?.message,
          status: true,
        }
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
          socketRef.current.send(typeof message === 'string' ? message : JSON.stringify(message));
          console.log('Message sent:', message);
          return true;
        } else {
          console.error('WebSocket is not connected. Message not sent.');
          return false;
        }
      }
    };

    // Save the reference to allow cleanup
    messageHandlerRef.current = messageHandler;

    const executeData = {
      "comment": "string",
      "executorAddr": connectedWallet?.did,
      "quorumType": 2,
      "smartContractData": JSON.stringify(data),
      smartContractToken: CONSTANTS.BUY_TOKEN
    }
    // Add the message listener
    window.addEventListener('message', messageHandler);
    if (window.myExtension) {
      try {
        window.myExtension.trigger({
          type: "INITIATE_CONTRACT",
          data: executeData
        });
      } catch (error) {
        console.error("Extension error:", error);
        alert("Please refresh the page to use the extension features");
      }
    } else {
      alert("Extension not detected.Please install the extension and refresh the page.");
      console.warn("Extension not detected. Please install the extension and refresh the page.");
    }
  };

  // Set up and clean up the message event listener
  useEffect(() => {
    // Clean up function to remove the event listener when component unmounts
    return () => {
      if (messageHandlerRef.current) {
        window.removeEventListener('message', messageHandlerRef.current);
        messageHandlerRef.current = null;
      }
    };
  }, []);

  // const handleConfirmPurchase = async () => {
  //   setIsPurchasing(true);
  //   try {
  //     // Simulate purchase transaction
  //     await new Promise(resolve => setTimeout(resolve, 2000));
  //     // Navigate to downloads page after successful purchase
  //     navigate('/dashboard/downloads');
  //   } catch (error) {
  //     console.error('Purchase failed:', error);
  //   } finally {
  //     setIsPurchasing(false);
  //     setShowPurchaseModal(false);
  //   }
  // };

  // Mock data - in a real app, this would be fetched based on the ID
  const item = {
    id: 'model-1',
    type: 'model',
    pricing: {
      model: 'one-time',
      price: '99.99',
      currency: 'USD'
    },
    name: 'Advanced NLP Model',
    description:
      'State-of-the-art natural language processing model for text generation and analysis.',
    longDescription: `
      This model represents the cutting edge in natural language processing, 
      trained on a diverse dataset of over 1 billion tokens. It excels at tasks 
      including text generation, sentiment analysis, and language understanding.
      
      Key Features:
      • Multi-language support (100+ languages)
      • Context window of 8k tokens
      • State-of-the-art performance on benchmark tasks
      • Optimized for production deployment
    `,
    creator: {
      name: 'AI Research Labs',
      avatar: 'A',
      bio: 'Leading AI research organization focused on advancing NLP technology'
    },
    image:
      'https://cdn.midjourney.com/d8fdb597-0d88-467d-8637-8022fb31dc1e/0_0.png',
    license: 'MIT',
    lastUpdated: '2024-01-15',
    stars: '2.5k',
    downloads: '15.2k',
    views: '45.6k',
    tags: ['NLP', 'Text Generation', 'Transformer'],
    metrics: {
      accuracy: '95.2%',
      f1Score: '94.8%',
      precision: '94.5%',
      recall: '95.1%'
    },
    files: [
      {
        name: 'model.pt',
        size: '2.3 GB',
        format: 'PyTorch',
        lastModified: '2024-01-15'
      },
      {
        name: 'config.json',
        size: '15 KB',
        format: 'JSON',
        lastModified: '2024-01-15'
      },
      {
        name: 'tokenizer.json',
        size: '500 KB',
        format: 'JSON',
        lastModified: '2024-01-15'
      }
    ],
    usage: {
      installation: 'pip install advanced-nlp',
      quickstart: `
import torch
from advanced_nlp import Model

model = Model.fromPretrained('ai-research/advanced-nlp')
output = model.generate("Your input text here")
      `,
      examples: [
        {
          title: 'Basic Text Generation',
          code: 'output = model.generate("Once upon a time")',
          description: 'Generate creative text based on a prompt'
        },
        {
          title: 'Sentiment Analysis',
          code: 'sentiment = model.analyze_sentiment("Great product!")',
          description: 'Analyze the sentiment of input text'
        }
      ]
    }
  };


  const onclick = (id: string) => {
    window.open(`https://testnet.rubixexplorer.com/#/transaction/${id}`, '_blank')

  }
  function sliceString(str: string, charsToShow = 5) {
    // Handle edge cases
    if (!str) return '';
    if (str.length <= charsToShow * 2) return str;

    const start = str.slice(0, charsToShow);
    const end = str.slice(-charsToShow);

    return `${start}...${end}`;
  }



  return (
    <div style={{ marginTop: 120 }} className="min-h-[calc(100vh-150px)] bg-[#f6f6f7]">

      {loader ? (
        <DetailViewSkeleton />
      ) : (
        <>
          {/* Breadcrumb Navigation */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Breadcrumbs
              items={[
                { label: 'Home', href: '/dashboard/all' },
                {
                  label:
                    model.type === 'model'
                      ? 'AI Models'
                      : model.type === 'dataset'
                        ? 'Datasets'
                        : model.type === 'assets' ? "assets" : 'Infra Providers',
                  href: `/dashboard/${model.type === 'model'
                    ? 'models'
                    : model.type === 'dataset'
                      ? 'datasets'
                      : model.type === 'assets' ? "assets" : 'infra-providers'
                    }`
                },
                { label: model?.metadata?.name }
              ]}
            />
          </div>

          <HeroSection history={historyData} item={model} />

          {/* Navigation Tabs */}
          <NavigationTabs
            tabs={TABS}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {activeTab === 'overview' && (
                  <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    {loader ? (
                      <OverviewSkeleton />
                    ) : (
                      <div className="bg-white rounded-xl border border-[#e1e3e5] p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
                        <div className="prose prose-sm max-w-none">
                          {/* {item.longDescription.split('\n').map((paragraph, index) => ( */}
                          <p className="mb-4 text-gray-600 whitespace-pre-line">
                            {model?.metadata?.description}
                          </p>
                          {/* ))} */}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'files' && (
                  <motion.div key="files" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    {loader ? (
                      <FilesSkeleton />
                    ) : (
                      <div className="bg-white rounded-xl border border-[#e1e3e5] overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#e1e3e5]">
                          <h2 className="text-xl font-semibold text-gray-900">Files</h2>
                        </div>
                        <div className="divide-y divide-[#e1e3e5]">

                          <div className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-[#0284a5]/10 flex items-center justify-center">
                                <svg className="w-5 h-5 text-[#0284a5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{nftFile}</div>
                                {/* <div className="text-xs text-gray-500">
                                    {file.size} • {file.format} • Last modified {file.lastModified}
                                  </div> */}
                              </div>
                            </div>
                            {/* <button className="px-4 py-2 text-sm font-medium text-[#0284a5] hover:bg-[#0284a5]/10 rounded-lg transition-colors">
                                Download
                              </button> */}
                          </div>

                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* {activeTab === 'usage' && (
                  <motion.div key="usage" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    {loader ? (
                      <UsageGuideSkeleton />
                    ) : (
                      <div className="space-y-6">
                        <div className="bg-white rounded-xl border border-[#e1e3e5] p-6">
                          <h2 className="text-xl font-semibold text-gray-900 mb-4">Installation</h2>
                          <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-white">
                            {item.usage.installation}
                          </div>
                        </div>
                        <div className="bg-white rounded-xl border border-[#e1e3e5] p-6">
                          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quickstart</h2>
                          <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-white whitespace-pre">
                            {item.usage.quickstart}
                          </div>
                        </div>
                        <div className="bg-white rounded-xl border border-[#e1e3e5] p-6">
                          <h2 className="text-xl font-semibold text-gray-900 mb-4">Examples</h2>
                          <div className="space-y-6">
                            {item.usage.examples.map((example) => (
                              <div key={example.title}>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">{example.title}</h3>
                                <p className="text-sm text-gray-600 mb-3">{example.description}</p>
                                <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-white">
                                  {example.code}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )} */}

                {activeTab === 'metrics' && (
                  <motion.div key="metrics" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    {loader ? (
                      <MetricsSkeleton />
                    ) : (
                      <div className="bg-white rounded-xl border border-[#e1e3e5] p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Performance Metrics</h2>
                        <div className="grid grid-cols-2 gap-6">
                          {Object.entries(model.metadata).filter(([key]) =>
                            !["name", "description", "price", "type"].includes(key)
                          ).map(([key, value]) => (
                            <div key={key} className="bg-gray-50 rounded-lg p-4">
                              <div className="text-sm text-gray-500 mb-1 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </div>
                              <div className="text-2xl font-semibold text-gray-900">{String(value)}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'discussions' && (
                  <motion.div key="discussions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    {loader ? (
                      <DiscussionsSkeleton />
                    ) : (
                      <div className="bg-white rounded-xl border border-[#e1e3e5] p-6">
                        <div className="text-center py-8">
                          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                          </svg>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No discussions yet</h3>
                          <p className="text-gray-500 mb-4">Be the first to start a discussion about this {item.type}</p>
                          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-[#0284a5] hover:bg-[#026d8a]">
                            Start Discussion
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
                {activeTab === 'history' && (
                  <motion.div key="history" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="bg-white rounded-xl border border-[#e1e3e5] p-6">

                      {historyData?.length > 0 ?
                        historyData?.map((item, index) => {
                          return (
                            <div key={index} className=" items-center justify-between py-4 border-b border-[#e1e3e5]">
                              <p className='text-gray-900 mb-2'><span className='font-bold'>Description: </span>{item?.NFTData}</p>
                              <p className='text-gray-900 mb-2'><span className='font-bold'>Time: </span>{moment(item?.Epoch * 1000)?.format("DD-MMM-YYYY HH:mm:ss")}</p>
                              <div onClick={() => onclick(item?.TransactionID)} className=' flex text-gray-900 cursor-pointer text-blue-900 text-nowrap'><span className='text-gray-900 font-bold nowrap'>TransactionID: </span><p className='underline'> {sliceString(item?.TransactionID, 40)}</p></div>
                            </div>
                          )
                        }) : <p className='text-gray-900'>No History Available</p>

                      }
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Sidebar */}
              {model?.type !== "assets" && <Sidebar
                // model={model}
                item={model}
                selectedDataset={selectedDataset}
                selectedInfra={selectedInfra}
                showTryButton={showTryButton}
                onDatasetChange={(value) => {
                  setSelectedDataset(value);
                  setSelectedOption('dataset');
                }}
                onInfraChange={(value) => {
                  setSelectedInfra(value);
                  setSelectedOption('infra');
                }}
                onPurchase={handlePurchase}
                uploading={uploading}
              />}
            </div>
          </div>
        </>
      )
      }
    </div >
  );
}