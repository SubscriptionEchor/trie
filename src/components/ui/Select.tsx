import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';

interface Option {
  id: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  className?: string;
}

export function Select({ value, onChange, options, className = '' }: SelectProps) {
  const selectedOption = options.find(option => option.id === value);

  return (
    <Listbox value={value} onChange={onChange}>
      <div className={`relative ${className}`}>
        <Listbox.Button className="relative w-full px-4 py-2.5 text-left bg-white border border-gray-300 rounded-lg shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0284a5] focus:border-[#0284a5] text-sm text-gray-900">
          <span className="block truncate font-medium">{selectedOption?.label}</span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4 4 4-4" />
            </svg>
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-10 w-full mt-1 overflow-auto bg-white rounded-lg shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none text-sm">
            {options.map((option) => (
              <Listbox.Option
                key={option.id}
                value={option.id}
                className={({ active, selected }) =>
                  `relative cursor-pointer select-none py-3 px-4 ${
                    active ? 'bg-[#0284a5]/10 text-gray-900' : 'text-gray-900'
                  } ${selected ? 'bg-[#0284a5]/5 text-gray-900' : ''}`
                }
              >
                {({ selected }) => (
                  <div className="flex items-center justify-between">
                    <span className={`block truncate ${selected ? 'font-medium text-[#0284a5]' : 'font-medium text-gray-900'}`}>
                      {option.label}
                    </span>
                    {selected && (
                      <span className="text-[#0284a5]">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    )}
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}