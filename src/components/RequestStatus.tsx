import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, AlertCircle, Loader2, Home, Phone, MapPin, Package } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
}

interface Product {
  id: string;
  name: string;
}

interface RequestStatusProps {
  requestId: string;
  store: Store;
  product: Product;
  specs: Record<string, string>;
  onStartNew: () => void;
}

type StatusType = 'pending' | 'available' | 'not_available' | 'similar';

export function RequestStatus({ requestId, store, product, specs, onStartNew }: RequestStatusProps) {
  const [status, setStatus] = useState<StatusType>('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-85dc2195/request-status?requestId=${requestId}`,
          {
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch status');
        }

        const data = await response.json();
        setStatus(data.status);
        setLoading(false);
      } catch (err) {
        console.error('Status fetch error:', err);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 3000);
    
    return () => clearInterval(interval);
  }, [requestId]);

  const getStatusDisplay = () => {
    switch (status) {
      case 'pending':
        return {
          icon: <Loader2 className="w-20 h-20 text-indigo-600 animate-spin" strokeWidth={2} />,
          title: 'Request Sent',
          message: 'Waiting for store response...',
          gradient: 'from-indigo-500 to-purple-600',
          bgGradient: 'from-indigo-50 to-purple-50',
          borderColor: 'border-indigo-200',
        };
      case 'available':
        return {
          icon: <CheckCircle2 className="w-20 h-20 text-green-600" strokeWidth={2} />,
          title: 'Product Available!',
          message: 'The store has confirmed product availability.',
          gradient: 'from-green-500 to-emerald-600',
          bgGradient: 'from-green-50 to-emerald-50',
          borderColor: 'border-green-200',
        };
      case 'not_available':
        return {
          icon: <XCircle className="w-20 h-20 text-red-600" strokeWidth={2} />,
          title: 'Not Available',
          message: 'The store does not have this product in stock.',
          gradient: 'from-red-500 to-rose-600',
          bgGradient: 'from-red-50 to-rose-50',
          borderColor: 'border-red-200',
        };
      case 'similar':
        return {
          icon: <AlertCircle className="w-20 h-20 text-orange-600" strokeWidth={2} />,
          title: 'Similar Option Available',
          message: 'The store has a similar product available.',
          gradient: 'from-orange-500 to-amber-600',
          bgGradient: 'from-orange-50 to-amber-50',
          borderColor: 'border-orange-200',
        };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Status Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={status}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`bg-gradient-to-br ${statusDisplay.bgGradient} border-2 ${statusDisplay.borderColor} rounded-3xl p-10 text-center mb-8 shadow-xl`}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
              className="flex justify-center mb-6"
            >
              {statusDisplay.icon}
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`text-gray-900 mb-3 text-3xl`}
            >
              {statusDisplay.title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-700 text-lg"
            >
              {statusDisplay.message}
            </motion.p>
          </motion.div>
        </AnimatePresence>

        {/* Request Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 mb-8 space-y-6"
        >
          <h3 className="text-gray-900 text-xl mb-6">Request Details</h3>
          
          {/* Store Info */}
          <div className="flex items-start gap-4 pb-6 border-b border-gray-100">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6 text-indigo-600" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <p className="text-gray-500 mb-1">Store</p>
              <p className="text-gray-900 text-lg">{store.name}</p>
              <p className="text-gray-600 mt-1">{store.address}</p>
              <p className="text-gray-600 flex items-center gap-2 mt-2">
                <Phone className="w-4 h-4" />
                {store.phone}
              </p>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex items-start gap-4 pb-6 border-b border-gray-100">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center flex-shrink-0">
              <Package className="w-6 h-6 text-purple-600" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <p className="text-gray-500 mb-1">Product</p>
              <p className="text-gray-900 text-lg">{product.name}</p>
            </div>
          </div>

          {/* Specifications */}
          <div>
            <p className="text-gray-500 mb-3 text-sm uppercase tracking-wide">Specifications</p>
            <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
              {Object.entries(specs).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-gray-600 capitalize">{key.replace(/_/g, ' ')}:</span>
                  <span className="text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Request ID */}
          <div className="pt-6 border-t border-gray-100">
            <p className="text-gray-500 mb-2 text-sm">Request ID</p>
            <p className="text-gray-600 font-mono text-sm bg-gray-50 px-4 py-3 rounded-xl">{requestId}</p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {status !== 'pending' && (
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href={`tel:${store.phone}`}
              className="block w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-5 rounded-2xl text-center transition-all shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 flex items-center justify-center gap-3 text-lg"
            >
              <Phone className="w-5 h-5" strokeWidth={2} />
              Call Store Now
            </motion.a>
          )}
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStartNew}
            className="w-full bg-white border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-sm text-lg"
          >
            <Home className="w-5 h-5" strokeWidth={2} />
            Start New Search
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
