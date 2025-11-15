import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CategorySelection } from './components/CategorySelection';
import { ProductSearch } from './components/ProductSearch';
import { SpecificationForm } from './components/SpecificationForm';
import { StoreList } from './components/StoreList';
import { RequestStatus } from './components/RequestStatus';

type Step = 'category' | 'search' | 'specs' | 'stores' | 'status';

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

interface Store {
  id: string;
  name: string;
  address: string;
  distance: string;
  phone: string;
}

export default function App() {
  const [step, setStep] = useState<Step>('category');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [specValues, setSpecValues] = useState<Record<string, string>>({});
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [requestId, setRequestId] = useState<string>('');

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setStep('search');
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setSpecValues({});
    setStep('specs');
  };

  const handleSpecsSubmit = (values: Record<string, string>) => {
    setSpecValues(values);
    setStep('stores');
  };

  const handleStoreSelect = (store: Store) => {
    setSelectedStore(store);
  };

  const handleRequestSent = (id: string) => {
    setRequestId(id);
    setStep('status');
  };

  const handleBack = () => {
    if (step === 'search') {
      setStep('category');
      setSelectedCategory('');
    } else if (step === 'specs') {
      setStep('search');
      setSelectedProduct(null);
    } else if (step === 'stores') {
      setStep('specs');
    } else if (step === 'status') {
      setStep('stores');
    }
  };

  const handleStartNew = () => {
    setStep('category');
    setSelectedCategory('');
    setSelectedProduct(null);
    setSpecValues({});
    setSelectedStore(null);
    setRequestId('');
  };

  const pageTransition = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {step === 'category' && (
          <motion.div key="category" {...pageTransition}>
            <CategorySelection onSelect={handleCategorySelect} />
          </motion.div>
        )}
        
        {step === 'search' && (
          <motion.div key="search" {...pageTransition}>
            <ProductSearch 
              category={selectedCategory}
              onProductSelect={handleProductSelect}
              onBack={handleBack}
            />
          </motion.div>
        )}
        
        {step === 'specs' && selectedProduct && (
          <motion.div key="specs" {...pageTransition}>
            <SpecificationForm
              product={selectedProduct}
              onSubmit={handleSpecsSubmit}
              onBack={handleBack}
            />
          </motion.div>
        )}
        
        {step === 'stores' && selectedProduct && (
          <motion.div key="stores" {...pageTransition}>
            <StoreList
              category={selectedCategory}
              product={selectedProduct}
              specs={specValues}
              onStoreSelect={handleStoreSelect}
              onRequestSent={handleRequestSent}
              onBack={handleBack}
            />
          </motion.div>
        )}
        
        {step === 'status' && requestId && selectedStore && selectedProduct && (
          <motion.div key="status" {...pageTransition}>
            <RequestStatus
              requestId={requestId}
              store={selectedStore}
              product={selectedProduct}
              specs={specValues}
              onStartNew={handleStartNew}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
