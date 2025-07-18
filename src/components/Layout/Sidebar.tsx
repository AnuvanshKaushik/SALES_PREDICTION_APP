import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart3, Package, Settings, TrendingUp } from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Inventory', href: '/inventory', icon: Package },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  const location = useLocation();

  return (
    <nav className={`fixed left-0 top-0 z-40 h-screen bg-gray-900 text-white transition-all duration-300 ${
      isCollapsed ? '-translate-x-full' : 'translate-x-0'
    } w-64`}>
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-gray-700 px-6 py-4">
          <TrendingUp className="h-8 w-8 text-blue-400" />
          <span className="text-xl font-bold">SalesPro</span>
        </div>

        {/* Navigation */}
        <ul className="flex-1 space-y-1 px-3 py-6">
          {navigation.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Footer */}
        <div className="border-t border-gray-700 px-6 py-4">
          <p className="text-xs text-gray-400">© 2025 SalesPro</p>
        </div>
      </div>
    </nav>
  );
};