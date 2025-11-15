import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, MapPin, Phone, Loader2, Send, X, Navigation } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Product {
  id: string;
  name: string;
  category: string;
}

interface Store {
  id: string;
  name: string;
  address: string;
  distance: string;
  phone: string;
}

interface StoreListProps {
  category: string;
  product: Product;
  specs: Record<string, string>;
  onStoreSelect: (store: Store) => void;
  onRequestSent: (requestId: string) => void;
  onBack: () => void;
}

export function StoreList({ category, product, specs, onStoreSelect, onRequestSent, onBack }: StoreListProps) {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [customerLocation, setCustomerLocation] = useState('');

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-85dc2195/stores?category=${category}`,
          {
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch stores');
        }

        const data = await response.json();
        setStores(data.stores || []);
      } catch (err) {
        console.error('Store fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [category]);

  const handleStoreClick = (store: Store) => {
    setSelectedStore(store);
    setShowModal(true);
    onStoreSelect(store);
  };

  const handleSendRequest = async () => {
    if (!selectedStore || !customerLocation.trim()) {
      return;
    }

    setSendingRequest(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-85dc2195/send-request`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            storeId: selectedStore.id,
            productName: product.name,
            specs: specs,
            customerLocation: customerLocation,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to send request');
      }

      const data = await response.json();
      onRequestSent(data.requestId);
    } catch (err) {
      console.error('Send request error:', err);
      alert('Failed to send request. Please try again.');
    } finally {
      setSendingRequest(false);
    }
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
              <h2 className="text-gray-900">Nearby Stores</h2>
              <p className="text-gray-600">{product.name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Store List */}
      <div className="max-w-3xl mx-auto px-5 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          </div>
        ) : stores.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 text-lg">No stores found in your area</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {stores.map((store, index) => (
              <motion.div
                key={store.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="flex-1">
                    <h3 className="text-gray-900 text-xl mb-4">{store.name}</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 text-gray-600">
                        <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-indigo-600" strokeWidth={2} />
                        <p>{store.address}</p>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <Phone className="w-5 h-5 flex-shrink-0 text-indigo-600" strokeWidth={2} />
                        <p>{store.phone}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full whitespace-nowrap ml-4 flex items-center gap-2">
                    <Navigation className="w-4 h-4" fill="currentColor" />
                    {store.distance}
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleStoreClick(store)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <Send className="w-5 h-5" strokeWidth={2} />
                  Send Request
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Send Request Modal - Simple version without WhatsApp preview */}
      <AnimatePresence>
        {showModal && selectedStore && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowModal(false);
                setCustomerLocation('');
              }}
              className="fixed inset-0 bg-black/30 z-40"
            />
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, y: 100, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 100, scale: 0.95 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="bg-white rounded-3xl w-full max-w-lg shadow-2xl pointer-events-auto"
              >
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-gray-900 text-xl">{product.name}</h3>
                    <button
                      onClick={() => {
                        setShowModal(false);
                        setCustomerLocation('');
                      }}
                      className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>

                  {/* Product Specifications */}
                  {Object.keys(specs).length > 0 && (
                    <div className="space-y-2">
                      {Object.entries(specs).map(([key, value]) => {
                        if (key === 'notes') return null;
                        return (
                          <div key={key} className="flex justify-between text-gray-600">
                            <span className="capitalize">{key.replace(/_/g, ' ')}:</span>
                            <span className="text-gray-900">{value}</span>
                          </div>
                        );
                      })}
                      {specs.notes && (
                        <div className="pt-2 border-t border-gray-100">
                          <p className="text-gray-600 mb-1">Notes:</p>
                          <p className="text-gray-900">{specs.notes}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Customer Location */}
                  <div>
                    <label className="block text-gray-700 mb-3">
                      Your Location
                    </label>
                    <input
                      type="text"
                      value={customerLocation}
                      onChange={(e) => setCustomerLocation(e.target.value)}
                      placeholder="Enter your location/address"
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                      autoFocus
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setShowModal(false);
                        setCustomerLocation('');
                      }}
                      disabled={sendingRequest}
                      className="flex-1 px-6 py-4 border-2 border-gray-200 rounded-2xl hover:bg-gray-50 transition-all disabled:opacity-50"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSendRequest}
                      disabled={!customerLocation.trim() || sendingRequest}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                    >
                      {sendingRequest ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" strokeWidth={2} />
                          Send Request
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
