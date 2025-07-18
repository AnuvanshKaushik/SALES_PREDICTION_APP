import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/useToast';
import { Package, Plus, Upload, BarChart3 } from 'lucide-react';

export const Inventory: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleAddFirstProduct = () => {
    navigate('/inventory/add');
  };

  const handleAddProductManually = () => {
    navigate('/inventory/manual-entry');
  };

  const handleImportCSV = () => {
    navigate('/inventory/import-csv');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Inventory Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage your product inventory and stock levels</p>
        </div>
        <button 
          onClick={handleAddFirstProduct}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add First Product
        </button>
      </div>

      {/* Empty State */}
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
          <Package className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          No Products in Inventory
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
          Start building your inventory by adding products. Track stock levels, 
          manage SKUs, and monitor product performance all in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button 
            onClick={handleAddProductManually}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Product Manually
          </button>
          <button 
            onClick={handleImportCSV}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            <Upload className="h-4 w-4" />
            Import from CSV
          </button>
        </div>
      </div>

      {/* Feature Preview Cards */}
      <div className="grid gap-6 sm:grid-cols-3">
        {/* Repeated cards */}
        {['Total Products', 'Low Stock Items', 'Out of Stock'].map((title, index) => (
          <div key={index} className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Package className="h-8 w-8 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
                <p className="text-2xl font-bold text-gray-300 dark:text-gray-600">0</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {title === 'Total Products'
                ? 'Add products to start tracking your inventory'
                : title === 'Low Stock Items'
                ? 'Monitor products running low on stock'
                : 'Track products that need restocking'}
            </p>
          </div>
        ))}
      </div>

      {/* Getting Started Guide */}
      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Getting Started with Inventory
        </h3>
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Quick Setup */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Quick Setup</h4>
            {[ "Add Products", "Set Stock Levels", "Monitor & Update" ].map((title, i) => (
              <div className="flex items-start gap-3" key={i}>
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">{i + 1}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {
                      i === 0 ? 'Start by adding your first product with SKU, name, and category' :
                      i === 1 ? 'Define current stock and low-stock thresholds' :
                      'Track stock levels and update as you make sales'
                    }
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Features You'll Get */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Features You'll Get</h4>
            {[
              'Real-time stock tracking',
              'Low stock alerts',
              'Product performance analytics',
              'CSV import/export',
              'Category management'
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-green-600" />
                <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
