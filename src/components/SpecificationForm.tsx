import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, CheckCircle2 } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  specs: Array<{
    key: string;
    label: string;
    type: 'text' | 'select' | 'color';
    options?: string[];
  }>;
}

interface SpecificationFormProps {
  product: Product;
  onSubmit: (values: Record<string, string>) => void;
  onBack: () => void;
}

const colorOptions = [
  { value: 'white', label: 'White', hex: '#FFFFFF', border: true },
  { value: 'black', label: 'Black', hex: '#000000' },
  { value: 'red', label: 'Red', hex: '#EF4444' },
  { value: 'blue', label: 'Blue', hex: '#3B82F6' },
  { value: 'green', label: 'Green', hex: '#10B981' },
  { value: 'yellow', label: 'Yellow', hex: '#F59E0B' },
  { value: 'gray', label: 'Gray', hex: '#6B7280' },
  { value: 'silver', label: 'Silver', hex: '#D1D5DB', border: true },
];

export function SpecificationForm({ product, onSubmit, onBack }: SpecificationFormProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // All fields are optional, just submit what's filled
    const finalValues = { ...values };
    if (notes.trim()) {
      finalValues.notes = notes;
    }
    
    onSubmit(finalValues);
  };

  const handleChange = (key: string, value: string) => {
    setValues({ ...values, [key]: value });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-5 py-4">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" strokeWidth={2} />
            </motion.button>
            <div>
              <h2 className="text-gray-900">Product Specifications</h2>
              <p className="text-gray-600">{product.name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-5 py-6">
        <div className="space-y-6">
          {product.specs.map((spec, index) => (
            <motion.div
              key={spec.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <label className="block text-gray-700 mb-3">
                {spec.label}
              </label>

              {spec.type === 'text' && (
                <input
                  type="text"
                  value={values[spec.key] || ''}
                  onChange={(e) => handleChange(spec.key, e.target.value)}
                  className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all shadow-sm"
                  placeholder={`Enter ${spec.label.toLowerCase()} (optional)`}
                />
              )}

              {spec.type === 'select' && spec.options && (
                <div className="grid grid-cols-2 gap-3">
                  {spec.options.map((option) => (
                    <motion.button
                      key={option}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleChange(spec.key, option)}
                      className={`px-5 py-4 rounded-2xl border-2 transition-all shadow-sm ${
                        values[spec.key] === option
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                          : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {option}
                    </motion.button>
                  ))}
                </div>
              )}

              {spec.type === 'color' && (
                <div className="grid grid-cols-4 gap-3">
                  {colorOptions.map((color) => (
                    <motion.button
                      key={color.value}
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleChange(spec.key, color.value)}
                      className={`relative p-3 rounded-2xl border-2 transition-all shadow-sm ${
                        values[spec.key] === color.value
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div
                        className="w-full h-16 rounded-xl mb-2"
                        style={{ 
                          backgroundColor: color.hex,
                          border: color.border ? '1px solid #E5E7EB' : 'none'
                        }}
                      />
                      <p className="text-sm text-gray-700">{color.label}</p>
                      {values[spec.key] === color.value && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center"
                        >
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          ))}

          {/* Additional Notes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: product.specs.length * 0.05 }}
          >
            <label className="block text-gray-700 mb-3">
              Additional Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all resize-none shadow-sm"
              placeholder="Any specific requirements or notes... (optional)"
            />
          </motion.div>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-2xl transition-all shadow-lg text-lg"
        >
          Find Nearby Stores
        </motion.button>
      </form>
    </div>
  );
}
