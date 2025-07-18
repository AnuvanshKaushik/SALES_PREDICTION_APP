import React from 'react';
import { TrendingUp } from 'lucide-react';
import { LoginForm } from '../components/Auth/LoginForm';

export const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-12 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="text-white">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="h-12 w-12" />
            <span className="text-3xl font-bold">SalesPro</span>
          </div>
          <h1 className="text-4xl font-bold mb-6">Welcome back to the future of sales analytics</h1>
          <p className="text-xl text-blue-100 mb-8">
            Predict sales trends, manage inventory, and grow your business with data-driven insights.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
              <span className="text-blue-100">Advanced sales prediction algorithms</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
              <span className="text-blue-100">Real-time analytics and reporting</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
              <span className="text-blue-100">Comprehensive inventory management</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-12 bg-white dark:bg-gray-900">
        <div className="mx-auto w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">SalesPro</span>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};