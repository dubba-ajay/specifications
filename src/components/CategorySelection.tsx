import { motion } from 'motion/react';
import { Home, Wrench, Zap, Smartphone, Shirt, ArrowRight, Sparkles, Store } from 'lucide-react';

const categories = [
  {
    id: 'home-kitchen',
    name: 'Home & Kitchen',
    description: 'Appliances & cookware',
    icon: Home,
    gradient: 'from-blue-500 via-blue-600 to-indigo-700',
    lightGradient: 'from-blue-500/10 via-blue-600/5 to-indigo-700/10',
  },
  {
    id: 'hardware-tools',
    name: 'Hardware & Tools',
    description: 'Power tools & equipment',
    icon: Wrench,
    gradient: 'from-orange-500 via-red-500 to-rose-600',
    lightGradient: 'from-orange-500/10 via-red-500/5 to-rose-600/10',
  },
  {
    id: 'electrical-plumbing',
    name: 'Electrical & Plumbing',
    description: 'Fixtures & fittings',
    icon: Zap,
    gradient: 'from-amber-500 via-orange-500 to-red-600',
    lightGradient: 'from-amber-500/10 via-orange-500/5 to-red-600/10',
  },
  {
    id: 'mobile-accessories',
    name: 'Mobile Accessories',
    description: 'Chargers, cases & more',
    icon: Smartphone,
    gradient: 'from-purple-500 via-fuchsia-500 to-pink-600',
    lightGradient: 'from-purple-500/10 via-fuchsia-500/5 to-pink-600/10',
  },
  {
    id: 'apparel-footwear',
    name: 'Apparel & Footwear',
    description: 'Clothing & shoes',
    icon: Shirt,
    gradient: 'from-pink-500 via-rose-500 to-red-600',
    lightGradient: 'from-pink-500/10 via-rose-500/5 to-red-600/10',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
    },
  },
};

interface CategorySelectionProps {
  onSelect: (category: string) => void;
}

export function CategorySelection({ onSelect }: CategorySelectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 md:py-24">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 md:mb-20"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 mb-8"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-white/90 text-sm">Find Products Instantly</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl text-white mb-6 tracking-tight">
            Find Your Product
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Near You
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            Search products, check availability at nearby stores, and get instant responses via WhatsApp
          </p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-8 mt-12"
          >
            <div className="text-center">
              <div className="text-3xl md:text-4xl text-white mb-1">500+</div>
              <div className="text-white/60">Products</div>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="text-center">
              <div className="text-3xl md:text-4xl text-white mb-1">50+</div>
              <div className="text-white/60">Stores</div>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="text-center">
              <div className="text-3xl md:text-4xl text-white mb-1">24/7</div>
              <div className="text-white/60">Available</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.button
                key={category.id}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(category.id)}
                className="group relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300 text-left overflow-hidden"
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.lightGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                  </div>
                  
                  {/* Text */}
                  <div className="mb-6">
                    <h3 className="text-white text-xl mb-2 group-hover:text-white transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-white/60 group-hover:text-white/80 transition-colors">
                      {category.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center gap-2 text-white/70 group-hover:text-white group-hover:gap-3 transition-all">
                    <span className="text-sm">Explore</span>
                    <ArrowRight className="w-4 h-4" strokeWidth={2} />
                  </div>
                </div>

                {/* Shine effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
            <Store className="w-5 h-5 text-white/60" />
            <span className="text-white/60">Powered by local retailers across the city</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
