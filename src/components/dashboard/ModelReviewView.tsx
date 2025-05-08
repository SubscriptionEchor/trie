import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Breadcrumbs } from '@/components/ui';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'user_models';

export function ModelReviewView() {
  const navigate = useNavigate();
  const [isPublishing, setIsPublishing] = useState(false);

  // Mock data - in a real app, this would come from your state management
  const modelDetails = {
    name: 'My Awesome Model',
    description: 'A powerful AI model for natural language processing tasks.',
    mainCategory: 'Natural Language Processing',
    category: 'Text Generation',
    tags: ['NLP', 'Transformer', 'Language Model'],
    metrics: {
      accuracy: '0.95',
      precision: '0.92',
      recall: '0.94',
      f1Score: '0.93'
    },
    files: ['model.pt', 'config.json', 'tokenizer.json'],
    pricing: {
      model: 'pay-per-use',
      price: '0.001',
      currency: 'USD'
    },
    license: {
      terms: ['commercial', 'private', 'academic'],
      custom: 'Additional terms and conditions...'
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      // Store model details in localStorage
      const existingModels = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const newModel = {
        ...modelDetails,
        id: `model-${Date.now()}`,
        createdAt: new Date().toISOString(),
        image: 'https://cdn.midjourney.com/d8fdb597-0d88-467d-8637-8022fb31dc1e/0_0.png',
        downloads: '0',
        likes: '0'
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...existingModels, newModel]));

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Trigger confetti effect
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Navigate to success page or models list
      setTimeout(() => {
        navigate('/dashboard/models');
      }, 2000);

    } catch (error) {
      console.error('Failed to publish model:', error);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Breadcrumbs
          items={[
            { label: 'Choose Type', href: '/dashboard/upload' },
            { label: 'Details', href: '/dashboard/upload/model' },
            { label: 'Pricing', href: '/dashboard/upload/model/pricing' },
            { label: 'Review' }
          ]}
          currentStep={4}
          totalSteps={4}
        />
      </div>

      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Review Your Model</h1>
        <p className="text-lg text-gray-600">Review all details before publishing to the marketplace</p>
      </div>

      <div className="bg-white rounded-xl border border-[#e1e3e5] p-8">
        <div className="space-y-8">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Name</label>
                  <p className="mt-1 text-sm text-gray-900">{modelDetails.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Category</label>
                  <p className="mt-1 text-sm text-gray-900">{modelDetails.mainCategory}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Description</label>
                <p className="mt-1 text-sm text-gray-900">{modelDetails.description}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Tags</label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {modelDetails.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Object.entries(modelDetails.metrics).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-500 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Files */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Model Files</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <ul className="divide-y divide-gray-200">
                {modelDetails.files.map((file) => (
                  <li key={file} className="py-3 flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-gray-900">{file}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Pricing</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Model</label>
                  <p className="mt-1 text-sm text-gray-900 capitalize">
                    {modelDetails.pricing.model.replace(/-/g, ' ')}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Price</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {modelDetails.pricing.currency} {modelDetails.pricing.price}
                    {modelDetails.pricing.model === 'pay-per-use' ? ' per call' : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* License */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">License Terms</h2>
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Included Rights</label>
                <div className="mt-2 space-y-2">
                  {modelDetails.license.terms.map(term => (
                    <div key={term} className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-900 capitalize">{term} use allowed</span>
                    </div>
                  ))}
                </div>
              </div>
              {modelDetails.license.custom && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Additional Terms</label>
                  <p className="mt-1 text-sm text-gray-900">{modelDetails.license.custom}</p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/dashboard/upload/model/pricing')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handlePublish}
              disabled={isPublishing}
              className="px-4 py-2 text-sm font-medium text-white bg-[#0284a5] rounded-lg hover:bg-[#026d8a] disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isPublishing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Publishing...
                </>
              ) : (
                'Publish Model'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}