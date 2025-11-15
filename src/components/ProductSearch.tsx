import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronLeft, Loader2, Package, Sparkles } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

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

interface ProductSearchProps {
  category: string;
  onProductSelect: (product: Product) => void;
  onBack: () => void;
}

const categoryNames: Record<string, string> = {
  'home-kitchen': 'Home & Kitchen',
  'hardware-tools': 'Hardware & Tools',
  'electrical-plumbing': 'Electrical & Plumbing',
  'mobile-accessories': 'Mobile Accessories',
  'apparel-footwear': 'Apparel & Footwear',
};

const categoryGradients: Record<string, string> = {
  'home-kitchen': 'from-blue-500 to-indigo-600',
  'hardware-tools': 'from-orange-500 to-red-600',
  'electrical-plumbing': 'from-yellow-500 to-orange-600',
  'mobile-accessories': 'from-purple-500 to-pink-600',
  'apparel-footwear': 'from-pink-500 to-rose-600',
};

export function ProductSearch({ category, onProductSelect, onBack }: ProductSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const searchProducts = async () => {
      if (searchQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-85dc2195/search-products?category=${category}&query=${encodeURIComponent(searchQuery)}`,
          {
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to search products');
        }

        const data = await response.json();
        setSuggestions(data.products || []);
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to search products');
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, category]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative z-10 backdrop-blur-xl bg-white/5 border-b border-white/10 sticky top-0">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all backdrop-blur-xl"
            >
              <ChevronLeft className="w-6 h-6 text-white" strokeWidth={2.5} />
            </motion.button>
            <div className="flex-1">
              <h2 className="text-white text-xl">Search Product</h2>
              <p className="text-white/60">{categoryNames[category]}</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 z-10" strokeWidth={2.5} />
            <motion.input
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type product name..."
              className="w-full pl-14 pr-5 py-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all text-white placeholder:text-white/40 text-lg"
              autoFocus
            />
            {loading && (
              <Loader2 className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60 animate-spin" />
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-red-500/10 backdrop-blur-xl border border-red-500/30 rounded-2xl p-5 text-red-300 shadow-lg"
            >
              {error}
            </motion.div>
          )}

          {!loading && searchQuery.length >= 2 && suggestions.length === 0 && !error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-white/40" />
              </div>
              <p className="text-white/70 text-xl mb-2">No products found</p>
              <p className="text-white/40">Try a different search term</p>
            </motion.div>
          )}

          {!loading && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-4"
            >
              {suggestions.map((product, index) => (
                <motion.button
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onProductSelect(product)}
                  className="group relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all text-left overflow-hidden"
                >
                  {/* Gradient accent */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${categoryGradients[category]} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  <div className="relative flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${categoryGradients[category]} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                        <Package className="w-7 h-7 text-white" strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white text-lg mb-1 truncate">{product.name}</h3>
                        <p className="text-white/50">{product.specs.length} specifications</p>
                      </div>
                    </div>
                    <ChevronLeft className="w-6 h-6 text-white/40 group-hover:text-white/80 rotate-180 group-hover:translate-x-1 transition-all flex-shrink-0" strokeWidth={2.5} />
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}

          {searchQuery.length < 2 && !error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <motion.div
                animate={{ rotate: [0, 5, 0, -5, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-xl border border-white/10 flex items-center justify-center mx-auto mb-8"
              >
                <Search className="w-12 h-12 text-white/60" strokeWidth={2} />
              </motion.div>
              <p className="text-white/70 text-xl mb-2">Start typing to search</p>
              <p className="text-white/40">Enter at least 2 characters</p>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 flex items-center justify-center gap-2 text-white/30"
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">AI-powered search</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
