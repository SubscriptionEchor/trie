import { useEffect, useRef, useState } from 'react';
import { useCallback } from 'react';
import { Breadcrumbs, Modal } from '@/components/ui';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks';
import { END_POINTS } from '@/api/requests';
import { Plus, X } from 'lucide-react';
import { InfraModal } from '../ui/infraModal';
import { CONSTANTS } from '@/utils';
import { useNavigate } from 'react-router-dom';


const STEPS = {
  DETAILS: 'details',
  METADATA: 'metadata',
  PRICING: 'pricing',
  REVIEW: 'review'
} as const;

type Step = typeof STEPS[keyof typeof STEPS];

export function DatasetUploadView() {
  const [currentStep, setCurrentStep] = useState<Step>(STEPS.DETAILS);
  // const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { connectedWallet, socketRef, setShowExtensionModal } = useAuth()
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectModal, setSelectModal] = useState<boolean>(false)
  const [hostingCost, setHostingCost] = useState<number>(1)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    format: '',
    license: '',
    providerid: '',
    pricing: {
      model: 'one-time',
      price: '',
      currency: 'USD'
    },
    metadata: {
      size: '',
      rows: '',
      columns: '',
      schema: ''
    },
    files: [] as File[]
  });
  const navigate = useNavigate()

  const onSelectProvider = (data: any) => {
    setSelectModal(false)
    setFormData((prev: any) => ({
      ...prev,
      providerid: data?.providerDid

    }))
    setHostingCost(Number(data?.hostingCost))
  }
  // const [loading, setLoading] = useState<boolean>(false);

  // Auto-close the modal after 5 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showModal) {
      timer = setTimeout(() => {
        setShowModal(false);
        navigate('dashboard/assets')
      }, 5000); // 5 seconds
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showModal]);

  const closeModal = () => {
    setShowModal(false);
    navigate('dashboard/assets')
  };

  const messageHandlerRef = useRef<any>(null);
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFormData(prev => ({
        ...prev,
        files: Array.from(event.target.files || [])
      }));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    setFormData(prev => ({
      ...prev,
      files: droppedFiles
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      if (name.includes('.')) {
        const [parentKey, childKey] = name.split('.');
        return {
          ...prev,
          [parentKey]: {
            ...(prev as any)[parentKey],
            [childKey]: value
          }
        };
      } else {
        return {
          ...prev,
          [name]: value
        };
      }
    });
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

  const handleUpload = useCallback(async () => {
    if (!connectedWallet?.did) {
      toast.error("Please connect your wallet.")
      return
    }
    // if (formData.files.length === 0) return;
    try {
      if (messageHandlerRef.current) {
        window.removeEventListener('message', messageHandlerRef.current);
        messageHandlerRef.current = null;
      }

      // Define the message handler
      const messageHandler = (event: any) => {


        // Process CONTRACT_RESULT messages
        const result = event.data.data;
        console.log(result)
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
        else if (event?.data?.type == "NFT_RESULT" && result?.status && result?.step == "SIGNATURE") {
          // setUploading(true)
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
        else if (event?.data?.type == "FT_RESULT" && result?.status && result?.step == "SIGNATURE") {
          let message = {
            resut: null,
            message: event.data.data?.message,
            status: true,
          }
          setUploading(false)
          setShowModal(true)
          // setCurrentStep(STEPS.DETAILS)
          setFormData({
            name: '',
            description: '',
            category: '',
            format: '',
            license: '',
            providerid: '',
            pricing: {
              model: 'one-time',
              price: '',
              currency: 'USD'
            },
            metadata: {
              size: '',
              rows: '',
              columns: '',
              schema: ''
            },
            files: []
          })
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

      // Add the message listener
      window.addEventListener('message', messageHandler);
      let metadata = {
        type: "dataset",
        name: formData.name,
        description: formData.description,
        price: formData.pricing.price,
        size: formData.metadata.size,
        rows: formData.metadata.rows,
        columns: formData.metadata.columns,
      };
      interface PublishAssetData {
        publish_asset: {
          asset_artifact?: string;
          asset_metadata?: string;
          asset_owner_did: string;
          asset_publish_description: string;
          asset_value: string;
          depin_provider_did: string;
          depin_hosting_cost: number;
          ft_denom: string;
          ft_denom_creator: string;
        }
      }
      let data: PublishAssetData = {
        "publish_asset": {
          "asset_owner_did": connectedWallet?.did,
          "asset_publish_description": `Dataset published and owned by ${connectedWallet?.did}`,
          "asset_value": `${(parseFloat(formData?.pricing?.price) || 1) * 0.001}`,
          "depin_provider_did": formData?.providerid,
          "depin_hosting_cost": hostingCost || 1,
          "ft_denom": "TRIE",
          "ft_denom_creator": "bafybmic3imrko6w2scgezyjt2a26pzfgbag5lxzkm3zus2pojku6bv3sxu"
        }
      }

      const metadataJSON = JSON.stringify(metadata, null, 2);
      // Create a Blob from the JSON string
      const blob = new Blob([metadataJSON],);
      // Create a File instance (this simulates a metadata.json file in the project root)
      const metadataFile = new File([blob], 'metadata.json',);

      const formDatas = new FormData();
      formDatas.append('asset', metadataFile, 'metadata.json');
      formDatas.append('metadata', formData.files[0]);
      // let uploadedFiles = await END_POINTS.upload_files(formDatas)
      // if (!uploadedFiles?.status) {
      //   toast.error("Error uploading files. Please try again.");
      // }
      // data.publish_asset.asset_artifact = uploadedFiles?.artifactPath;
      // data.publish_asset.asset_metadata = uploadedFiles?.metadataPath;
      let uploadedFiles = await END_POINTS.upload_files(formDatas) as any;
      // Type assertion to tell TypeScript about the structure
      // const responseData = uploadedFiles as {
      //   status: boolean;
      //   artifactPath?: string;
      //   metadataPath?: string;
      // };

      if (!uploadedFiles?.status) {
        return toast.error("Error uploading files. Please try again.");
      }
      data.publish_asset.asset_artifact = uploadedFiles?.artifactPath;
      data.publish_asset.asset_metadata = uploadedFiles?.metadataPath;
      const executeData = {
        "comment": "string",
        "executorAddr": connectedWallet?.did,
        "quorumType": 2,
        "smartContractData": JSON.stringify(data),
        smartContractToken: CONSTANTS.CONTRACT_TOKEN
      }

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
        setShowExtensionModal(true)
        alert("Extension not detected.Please install the extension and refresh the page.");
        console.warn("Extension not detected. Please install the extension and refresh the page.");
      }

    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      // setUploading(false);
    }
  }, [formData, connectedWallet]);

  const handleNext = () => {
    switch (currentStep) {
      case STEPS.DETAILS:
        setCurrentStep(STEPS.METADATA);
        break;
      case STEPS.METADATA:
        setCurrentStep(STEPS.PRICING);
        break;
      case STEPS.PRICING:
        setCurrentStep(STEPS.REVIEW);
        break;
      case STEPS.REVIEW:
        handleUpload();
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case STEPS.METADATA:
        setCurrentStep(STEPS.DETAILS);
        break;
      case STEPS.PRICING:
        setCurrentStep(STEPS.METADATA);
        break;
      case STEPS.REVIEW:
        setCurrentStep(STEPS.PRICING);
        break;
    }
  };
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Breadcrumbs
          items={[
            { label: 'Details' },
            { label: 'Metadata' },
            { label: 'Pricing' },
            { label: 'Review' }
          ]}
          showSteps={true}
          currentStep={Object.values(STEPS).indexOf(currentStep) + 1}
          totalSteps={Object.values(STEPS).length}
        />
      </div>

      {/* Content based on current step */}
      {currentStep === STEPS.DETAILS && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dataset Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0284a5] focus:border-transparent text-gray-700"
              placeholder="e.g., Common Voice Dataset"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0284a5] focus:border-transparent text-gray-700"
              placeholder="Describe your dataset's contents and potential use cases..."
            />
          </div>
          <div>
            <div className='flex my-2 items-center '>
              <label className="block text-base font-semibold text-gray-900  me-3">
                Depin provider DID
                <span className="text-red-500 ml-1">*</span>
              </label>
              <button onClick={() => {
                setSelectModal(true)

              }}
                className='text-white flex bg-primary pe-2 py-1 text-sm font-medium rounded-md items-center justify-center'> <Plus height={15} />Select </button>
            </div>
            <input
              disabled={true}
              name="providerid"
              value={formData.providerid}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0284a5] focus:border-transparent text-gray-700"
              placeholder="Add your provider DID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              File
            </label>
            <div
              className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-colors cursor-pointer ${isDragging
                ? 'border-[#0284a5] bg-[#0284a5]/5'
                : formData?.files?.length > 0
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-300 hover:border-gray-400'
                }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            // onClick={() => document.getElementById('file-upload')?.click()}
            >
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-[#0284a5] hover:text-[#026d8a] focus-within:outline-none"
                  >
                    <span>{!formData?.files || formData?.files?.length == 0 ? 'Upload file' : formData?.files[0]?.name}</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      multiple
                      onChange={handleFileSelect}
                    />
                  </label>
                  {formData?.files?.length == 0 ? <p className="pl-1">or drag and drop</p> : null}
                </div>
                {formData?.files?.length == 0 ? <p className="text-xs text-gray-500">Any file up to 50MB</p> : null}
              </div>
            </div>
          </div>
        </div>
      )}

      {currentStep === STEPS.METADATA && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dataset Size
            </label>
            <input
              type="text"
              name="metadata.size"
              value={formData.metadata.size}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0284a5] focus:border-transparent text-gray-700"
              placeholder="e.g., 1.2GB"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Rows
            </label>
            <input
              type="text"
              name="metadata.rows"
              value={formData.metadata.rows}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0284a5] focus:border-transparent text-gray-700"
              placeholder="e.g., 1000000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Columns
            </label>
            <input
              type="text"
              name="metadata.columns"
              value={formData.metadata.columns}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0284a5] focus:border-transparent text-gray-700"
              placeholder="e.g., 15"
            />
          </div>
        </div>
      )}

      {currentStep === STEPS.PRICING && (
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">One-time Purchase</h2>
                <p className="text-sm text-gray-600 mt-1">Set a fixed price for dataset access</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price
            </label>
            <div className="relative max-w-md">
              <div className="relative flex items-center">
                {/* <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-600 sm:text-sm font-medium">$</span>
                  </span> */}
                <input
                  type="text"
                  name="pricing.price"
                  value={formData?.pricing?.price}
                  onChange={(e) => {
                    const value = e?.target?.value?.replace(/[^0-9.]/g, '');
                    setFormData((prev: any) => ({
                      ...prev,
                      pricing: {
                        ...prev?.pricing,
                        price: value
                      }
                    }));
                  }}
                  className="block w-full pl-6 pr-20 py-2.5 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0284a5] hover:border-gray-400 transition-colors text-base font-medium bg-white shadow-sm"
                  placeholder="Enter amount"
                />
                {/* <select
                    name="pricing.currency"
                    value={formData.pricing?.currency}
                    onChange={handleInputChange}
                    className="absolute right-0 h-full py-0 pl-3 pr-8 bg-transparent text-gray-600 font-medium text-sm focus:outline-none appearance-none border-0"
                  >
                    <option>USD</option>
                    <option>EUR</option>
                    <option>GBP</option>
                  </select> */}
                <p className='text-gray-600 border border-gray-300 bg-gray-100 ms-2  rounded-lg  p-2.5 font-medium text-sm focus:outline-none '>TRIE</p>
                <p className='text-gray-600 px-2 text-lg'>=</p>
                <p className='text-gray-600 border text-center border-gray-300  bg-white ms-2  rounded-lg  p-2.5 font-medium text-sm focus:outline-none w-auto'>{formData?.pricing?.price ? (parseFloat(formData?.pricing?.price) / 1000) : 0}</p>
                <p className='text-gray-600 border border-gray-300 bg-gray-100 ms-2  rounded-lg  p-2.5 font-medium text-sm focus:outline-none '>RBT</p>
                {/* <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div> */}
              </div>
            </div>
          </div>
        </div>
      )}

      {currentStep === STEPS.REVIEW && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Review Details</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formData.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Description</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formData.description}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Files</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formData.files.map(file => file.name).join(', ')}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 mt-8">
        <button
          type="button"
          onClick={() => setShowConfirmModal(true)}
          className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
        >
          Cancel
        </button>
        {currentStep !== STEPS.DETAILS && (
          <button
            type="button"
            onClick={handleBack}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back
          </button>
        )}
        <button
          type="button"
          onClick={handleNext}
          className="px-4 py-2 text-sm font-medium text-white bg-[#0284a5] rounded-lg hover:bg-[#026d8a]"
        >
          {uploading ? <div className="flex justify-center items-center ">
            <div className="loader border-t-transparent border-solid border-2 border-white-500 rounded-full animate-spin w-6 h-6"></div>
          </div> :
            currentStep === STEPS.REVIEW ? 'Publish Dataset' : 'Next'}
        </button>
      </div>

      <Modal
        show={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Cancel"
      >
        <div className="p-6">
          <p className="text-gray-600">
            Are you sure you want to cancel? All progress will be lost.
          </p>
          <div className="mt-6 flex justify-end gap-4">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              No, continue editing
            </button>
            <button
              onClick={() => {
                setShowConfirmModal(false);
                setCurrentStep(STEPS.DETAILS);
                setFormData({
                  name: '',
                  description: '',
                  category: '',
                  format: '',
                  license: '',
                  pricing: {
                    model: '',
                    price: '',
                    currency: 'USD'
                  },
                  metadata: {
                    size: '',
                    rows: '',
                    columns: '',
                    schema: ''
                  },
                  providerid: '',
                  files: []
                });
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              Yes, cancel
            </button>
          </div>
        </div>
      </Modal>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-white text-xl font-bold font-['IBM_Plex_Sans']">Success!</h3>
              <p className="text-gray-300 mt-2 font-['IBM_Plex_Sans']">
                Transfer of TRIE tokens to Infra Provider is successful and the hosting of your Asset is in progress.
              </p>
            </div>

            <button
              onClick={closeModal}
              className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors font-['IBM_Plex_Sans']"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {selectModal && (
        <div className="fixed  inset-0 bg-black  bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white relative rounded-lg p-6 w-[70%] h-[90%] relative">
            <button
              onClick={() => {
                setSelectModal(false)
                document.body.style.overflow = "auto"
              }}
              className="absolute top-5 right-10 text-gray-400 "
            >
              <X className="w-5 h-5" />
            </button>

            <div className='overflow-auto  h-full p-5'>
              <InfraModal onselectProvider={onSelectProvider} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
