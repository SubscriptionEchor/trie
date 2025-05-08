import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Breadcrumbs } from '@/components/ui';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'user_infra';

export function InfraReviewView() {
  const navigate = useNavigate();
  const [isPublishing, setIsPublishing] = useState(false);

  // Mock data - in a real app, this would come from your state management
  const infraDetails = {
    name: 'High-Performance GPU Cluster',
    description: 'Enterprise-grade GPU infrastructure for AI/ML workloads.',
    type: 'GPU Compute',
    region: 'US East (N. Virginia)',
    specs: {
      cpu: '32 cores',
      memory: '128GB',
      storage: '2TB NVMe SSD',
      gpu: '4x NVIDIA A100'
    },
    pricing: {
      model: 'pay-per-use',
      price: '0.50',
      currency: 'USD',
      billingPeriod: 'hourly'
    },
    terms: {
      usage: ['gpu', 'cpu', 'memory', 'storage'],
      custom: 'Additional terms and conditions...'
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      // Store infra details in localStorage
      const existingInfra = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const newInfra = {
        ...infraDetails,
        id: `infra-${Date.now()}`,
        createdAt: new Date().toISOString(),
        image: 'https://cdn.midjourney.com/d8fdb597-0d88-467d-8637-8022fb31dc1e/0_0.png',
        status: 'active'
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...existingInfra, newInfra]));

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
        navigate('/dashboard/my-uploads');
      }, 2000);

    } catch (error) {
      console.error('Failed to publish infrastructure:', error);
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
            { label: 'Details', href: '/dashboard/upload/infra' },
            { label: 'Pricing', href: '/dashboard/upload/infra/pricing' },
            { label: 'Review' }
          ]}
          currentStep={4}
          totalSteps={4}
        />
      </div>

      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Review Infrastructure Service</h1>
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
                  <p className="mt-1 text-sm text-gray-900">{infraDetails.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Type</label>
                  <p className="mt-1 text-sm text-gray-900">{infraDetails.type}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Description</label>
                <p className="mt-1 text-sm text-gray-900">{infraDetails.description}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Region</label>
                <p className="mt-1 text-sm text-gray-900">{infraDetails.region}</p>
              </div>
            </div>
          </div>

          {/* Hardware Specifications */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Hardware Specifications</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Object.entries(infraDetails.specs).map(([key, value]) => (
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

          {/* Pricing */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Pricing</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Model</label>
                  <p className="mt-1 text-sm text-gray-900 capitalize">
                    {infraDetails.pricing.model.replace(/-/g, ' ')}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Price</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {infraDetails.pricing.currency} {infraDetails.pricing.price}/{infraDetails.pricing.billingPeriod}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Usage Terms */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Usage Terms</h2>
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Included Resources</label>
                <div className="mt-2 space-y-2">
                  {infraDetails.terms.usage.map(term => (
                    <div key={term} className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-900 capitalize">{term} access included</span>
                    </div>
                  ))}
                </div>
              </div>
              {infraDetails.terms.custom && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Additional Terms</label>
                  <p className="mt-1 text-sm text-gray-900">{infraDetails.terms.custom}</p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/dashboard/upload/infra/pricing')}
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
                'Publish Infrastructure'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}