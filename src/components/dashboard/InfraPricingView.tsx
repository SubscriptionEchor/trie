import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Breadcrumbs } from '@/components/ui';

const STORAGE_KEY = 'user_uploads_infra';

interface PricingFormData {
  pricingModel: string;
  price: string;
  currency: string;
  billingPeriod: string;
  customTerms: string;
  usageTerms: string[];
}

const PRICING_OPTIONS = [
  { id: 'pay-per-use', label: 'Pay Per Use', description: 'Charge based on actual resource usage' },
  { id: 'subscription', label: 'Subscription', description: 'Monthly or annual access fee' },
  { id: 'reserved', label: 'Reserved Capacity', description: 'Pre-purchased compute capacity' }
];

const USAGE_TERMS = [
  { id: 'gpu', label: 'GPU Access', description: 'Access to GPU resources' },
  { id: 'cpu', label: 'CPU Access', description: 'Access to CPU resources' },
  { id: 'memory', label: 'Memory Usage', description: 'Access to memory resources' },
  { id: 'storage', label: 'Storage', description: 'Access to storage resources' },
  { id: 'network', label: 'Network', description: 'Network bandwidth usage' }
];

export function InfraPricingView() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PricingFormData>({
    pricingModel: '',
    price: '',
    currency: 'USD',
    billingPeriod: 'hourly',
    customTerms: '',
    usageTerms: []
  });

  const handlePricingModelChange = (model: string) => {
    setFormData(prev => ({ ...prev, pricingModel: model }));
  };

  const handleUsageTermToggle = (term: string) => {
    setFormData(prev => ({
      ...prev,
      usageTerms: prev.usageTerms.includes(term)
        ? prev.usageTerms.filter(t => t !== term)
        : [...prev.usageTerms, term]
    }));
  };

  const handleSubmit = () => {
    // Mark that user has registered infrastructure
    localStorage.setItem(STORAGE_KEY, 'true');
    
    // Navigate to review step
    navigate('/dashboard/upload/infra/review');
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
          currentStep={3}
          totalSteps={4}
        />
      </div>

      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Set Pricing & Terms</h1>
        <p className="text-lg text-gray-600">Define how users can access and use your infrastructure</p>
      </div>

      <div className="bg-white rounded-xl border border-[#e1e3e5] p-8">
        <div className="space-y-8">
          {/* Pricing Model Selection */}
          <div>
            <label className="block text-lg font-medium text-gray-900 mb-4">
              Choose Pricing Model
            </label>
            <div className="grid gap-4">
              {PRICING_OPTIONS.map((option) => (
                <div
                  key={option.id}
                  onClick={() => handlePricingModelChange(option.id)}
                  className={`relative flex items-center p-4 cursor-pointer rounded-lg border-2 transition-all duration-200 ${
                    formData.pricingModel === option.id
                      ? 'border-[#0284a5] bg-[#0284a5]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center h-5 pointer-events-none">
                    <input
                      type="radio"
                      name="pricingModel"
                      checked={formData.pricingModel === option.id}
                      readOnly
                      className="h-4 w-4 text-[#0284a5] border-gray-300"
                    />
                  </div>
                  <div className="ml-4 pointer-events-none">
                    <div className="text-sm font-medium text-gray-900">
                      {option.label}
                    </div>
                    <p className="text-sm text-gray-500">{option.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Input */}
          {formData.pricingModel && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Set Price
              </label>
              <div className="relative max-w-xs">
                <div className="relative flex items-center">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <span className="text-gray-600 sm:text-sm font-medium">$</span>
                  </span>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="block w-full pl-6 pr-20 py-2.5 text-gray-900 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-[#0284a5] focus:border-[#0284a5] hover:border-gray-400 transition-colors text-base font-medium bg-white shadow-sm"
                    placeholder={formData.pricingModel === 'pay-per-use' ? '0.50' : '99.99'}
                  />
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                    className="absolute right-0 h-full py-0 pl-3 pr-8 border-l border-gray-300 bg-white text-gray-600 font-medium text-sm rounded-r-lg focus:ring-2 focus:ring-[#0284a5] focus:border-[#0284a5] hover:border-gray-400 transition-colors appearance-none"
                  >
                    <option>USD</option>
                    <option>EUR</option>
                    <option>GBP</option>
                  </select>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Billing Period
                </label>
                <div className="relative max-w-xs mb-2">
                  <select
                    value={formData.billingPeriod}
                    onChange={(e) => setFormData(prev => ({ ...prev, billingPeriod: e.target.value }))}
                    className="block w-full pl-3 pr-10 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0284a5] focus:border-[#0284a5] hover:border-gray-400 text-base font-medium appearance-none transition-colors"
                  >
                    <option value="hourly">Per Hour</option>
                    <option value="daily">Per Day</option>
                    <option value="monthly">Per Month</option>
                    <option value="yearly">Per Year</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {formData.pricingModel === 'pay-per-use'
                    ? 'Price per API call'
                    : formData.pricingModel === 'subscription'
                    ? 'Monthly subscription fee'
                    : 'One-time purchase price'}
                </p>
              </div>
            </div>
          )}

          {/* Usage Terms */}
          <div>
            <label className="block text-lg font-medium text-gray-900 mb-4">
              Usage Terms
            </label>
            <div className="space-y-4">
              {USAGE_TERMS.map((term) => (
                <div
                  key={term.id}
                  className="relative flex items-start py-4 border-b border-gray-200 last:border-0"
                >
                  <div className="min-w-0 flex-1 text-sm">
                    <label className="font-medium text-gray-700 select-none">
                      {term.label}
                    </label>
                    <p className="text-gray-500">{term.description}</p>
                  </div>
                  <div className="ml-3 flex items-center h-5">
                    <input
                      type="checkbox"
                      checked={formData.usageTerms.includes(term.id)}
                      onChange={() => handleUsageTermToggle(term.id)}
                      className="focus:ring-[#0284a5] h-4 w-4 text-[#0284a5] border-gray-300 rounded"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Terms */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Terms (Optional)
            </label>
            <textarea
              rows={4}
              value={formData.customTerms}
              onChange={(e) => setFormData(prev => ({ ...prev, customTerms: e.target.value }))}
              className="block w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#0284a5] focus:border-[#0284a5] hover:border-gray-400 transition-all duration-200 resize-none text-base leading-relaxed shadow-sm"
              placeholder="Enter any additional terms or conditions..."
            />
            <p className="mt-2 text-xs text-gray-500">
              These terms will be displayed to users alongside the standard terms
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard/upload/infra')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className={`px-4 py-2 text-sm font-medium text-white bg-[#0284a5] rounded-lg hover:bg-[#026d8a] ${
                !formData.pricingModel || !formData.price || formData.usageTerms.length === 0
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}