import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

export interface NavItemProps {
  item: {
    id: string;
    label: string;
    icon: string;
    route?: string;
  };
}

export function NavItem({ item }: NavItemProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const normalizedPath = location.pathname.endsWith('/')
    ? location.pathname.slice(0, -1)
    : location.pathname;
  const currentPath = normalizedPath.split('/').pop() || 'all';
  const isActive = currentPath === item.id;

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => {
        navigate(item.route || `/dashboard/${item.id}`);
        // Close any open modals/menus
        const event = new CustomEvent('closeModals');
        window.dispatchEvent(event);
      }}
      className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group ${isActive
        ? 'text-[#0284a5] bg-white shadow-sm border border-gray-100'
        : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm hover:border hover:border-gray-100'
        }`}
    >
      <svg className="w-5 h-5 mr-2.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={item.icon} />
      </svg>
      {item.label}
    </motion.button>
  );
}