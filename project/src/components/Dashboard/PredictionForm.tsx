import React, { useState } from 'react';
import { Calculator, Upload, Share } from 'lucide-react';
import { PredictionData, PredictionResult } from '../../types';
import { useToast } from '../../hooks/useToast';
import { LoadingOverlay } from '../UI/LoadingSpinner';

export const PredictionForm: React.FC = () => {
  const [formData, setFormData] = useState<PredictionData>({
    store_id: 0,
    sku_id: 0,
    total_price: 0,
    base_price: 0,
    is_featured_sku: false,
    is_display_sku: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof PredictionData, string>>>({});
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof PredictionData, string>> = {};

    if (!formData.store_id || formData.store_id <= 0) {
      newErrors.store_id = 'Store ID must be a positive number';
    }

    if (!formData.sku_id || formData.sku_id <= 0) {
      newErrors.sku_id = 'SKU ID must be a positive number';
    }

    if (!formData.total_price || formData.total_price <= 0) {
      newErrors.total_price = 'Total price must be a positive number';
    }

    if (!formData.base_price || formData.base_price <= 0) {
      newErrors.base_price = 'Base price must be a positive number';
    }

    if (formData.base_price > formData.total_price) {
      newErrors.base_price = 'Base price cannot exceed total price';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('Validation Error', 'Please fix the errors in the form', 'error');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          is_featured_sku: formData.is_featured_sku ? 1 : 0,
          is_display_sku: formData.is_display_sku ? 1 : 0,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const numericPrediction = typeof data.prediction === 'number'
          ? data.prediction
          : parseFloat(data.prediction?.prediction || data.prediction?.value || 0);

        setResult({
          prediction: numericPrediction,
          confidence: data.confidence || 90,
          factors: data.factors || {
            store_factor: 1,
            sku_factor: 1,
            price_factor: 1,
            marketing_factor: 1,
          },
        });
      }
      else {
        showToast('Prediction Failed', data.error || 'Unknown error', 'error');
      }
    } catch (error) {
      showToast('Server Error', 'Could not reach prediction server', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!result) return;

    const csvContent = `Prediction,Confidence,Store ID,SKU ID,Total Price,Base Price,Featured,Display\n${result.prediction},${result.confidence.toFixed(1)}%,${formData.store_id},${formData.sku_id},${formData.total_price},${formData.base_price},${formData.is_featured_sku ? 'Yes' : 'No'},${formData.is_display_sku ? 'Yes' : 'No'}`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sales_prediction_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    showToast('Export Successful', 'Prediction data exported to CSV', 'success');
  };

  const handleShare = async () => {
    if (!result) return;

    const shareText = `Sales Prediction: ${result.prediction} units (${result.confidence.toFixed(1)}% confidence)\n\nStore ID: ${formData.store_id}\nSKU ID: ${formData.sku_id}\nTotal Price: $${formData.total_price}\nBase Price: $${formData.base_price}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Sales Prediction Result',
          text: shareText,
        });
        showToast('Shared Successfully', 'Prediction shared successfully', 'success');
      } else {
        await navigator.clipboard.writeText(shareText);
        showToast('Copied to Clipboard', 'Prediction details copied to clipboard', 'success');
      }
    } catch (error) {
      showToast('Share Failed', 'Failed to share prediction', 'error');
    }
  };

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <Calculator className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Unit Sales Predictor</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400">Enter product details to predict sales volume</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Store ID</label>
                  <input
                    type="number"
                    value={formData.store_id || ''}
                    onChange={(e) => setFormData({ ...formData, store_id: parseInt(e.target.value) || 0 })}
                    className="form-input"
                    placeholder="Enter store ID"
                  />
                  {errors.store_id && <p className="text-sm text-red-600">{errors.store_id}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">SKU ID</label>
                  <input
                    type="number"
                    value={formData.sku_id || ''}
                    onChange={(e) => setFormData({ ...formData, sku_id: parseInt(e.target.value) || 0 })}
                    className="form-input"
                    placeholder="Enter SKU ID"
                  />
                  {errors.sku_id && <p className="text-sm text-red-600">{errors.sku_id}</p>}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Total Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.total_price || ''}
                    onChange={(e) => setFormData({ ...formData, total_price: parseFloat(e.target.value) || 0 })}
                    className="form-input"
                    placeholder="Enter total price"
                  />
                  {errors.total_price && <p className="text-sm text-red-600">{errors.total_price}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Base Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.base_price || ''}
                    onChange={(e) => setFormData({ ...formData, base_price: parseFloat(e.target.value) || 0 })}
                    className="form-input"
                    placeholder="Enter base price"
                  />
                  {errors.base_price && <p className="text-sm text-red-600">{errors.base_price}</p>}
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Is Featured SKU</label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="featured"
                        checked={formData.is_featured_sku}
                        onChange={() => setFormData({ ...formData, is_featured_sku: true })}
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="featured"
                        checked={!formData.is_featured_sku}
                        onChange={() => setFormData({ ...formData, is_featured_sku: false })}
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">No</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Is Display SKU</label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="display"
                        checked={formData.is_display_sku}
                        onChange={() => setFormData({ ...formData, is_display_sku: true })}
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="display"
                        checked={!formData.is_display_sku}
                        onChange={() => setFormData({ ...formData, is_display_sku: false })}
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">No</span>
                    </label>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Calculator className="h-4 w-4" />
                Predict Sales
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          {result && (
            <div className="rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 p-6 dark:from-blue-900/20 dark:to-indigo-900/20">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600">
                  {typeof result.prediction === 'string' || typeof result.prediction === 'number'
                    ? result.prediction
                    : JSON.stringify(result.prediction)}
                </div>

                <div className="text-lg text-gray-600 dark:text-gray-400">units</div>
                <div className="text-xl font-semibold text-green-600 mt-2">{result.confidence.toFixed(1)}%</div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Estimated units to be sold</p>
                <div className="flex gap-2 mt-4">
                  <button onClick={handleExport} className="btn btn-outline">
                    <Upload className="h-4 w-4" /> Export
                  </button>
                  <button onClick={handleShare} className="btn btn-outline">
                    <Share className="h-4 w-4" /> Share
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">About This Tool</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              This sales prediction tool uses a machine learning model deployed in a Flask backend.
            </p>
            <div className="text-xs text-gray-500 dark:text-gray-500">
              Last Updated: July 2025
            </div>
          </div>
        </div>
      </div>

      <LoadingOverlay isVisible={loading} />
    </>
  );
};
