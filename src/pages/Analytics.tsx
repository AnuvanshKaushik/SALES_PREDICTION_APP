import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, TrendingUp, Plus, Activity } from 'lucide-react';

export const Analytics: React.FC = () => {
  const navigate = useNavigate();

  const handleMakeFirstPrediction = () => {
    navigate('/dashboard');
  };

  return (
    <div className="space-y-6">
      {/* Empty State Header */}
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6">
          <BarChart3 className="h-12 w-12 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          No Analytics Data Yet
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
          Start making sales predictions to see your analytics dashboard come to life. 
          Your sales trends, performance metrics, and insights will appear here.
        </p>
        <button 
          onClick={handleMakeFirstPrediction}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Make Your First Prediction
        </button>
      </div>

      {/* Preview Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: 'Total Predictions', icon: Activity, description: 'Track your prediction history' },
          { title: 'Accuracy Rate', icon: TrendingUp, description: 'Monitor prediction accuracy' },
          { title: 'Sales Trends', icon: BarChart3, description: 'Visualize sales patterns' },
          { title: 'Performance', icon: TrendingUp, description: 'Analyze performance metrics' },
        ].map((item) => {
          const IconComponent = item.icon;
          return (
            <div key={item.title} className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="rounded-full p-3 bg-gray-100 dark:bg-gray-700">
                  <IconComponent className="h-6 w-6 text-gray-400" />
                </div>
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
              <div className="mt-4 h-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full w-0"></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* What You'll See Section */}
      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          What You'll See Here
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Sales Metrics</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Track total predictions, accuracy rates, and performance trends
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Visual Charts</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Interactive charts showing sales trends and prediction patterns
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Insights</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                AI-powered insights and recommendations based on your data
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};