import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  GlobeAltIcon,
  ChatBubbleLeftIcon,
  PhotoIcon,
  NewspaperIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline';

const BrandCategoryCard = ({ brand }) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const getPaletteColors = () => {
    try {
      if (!brand.thumbnail_palette) return ['#6366f1'];
      return JSON.parse(brand.thumbnail_palette.replace(/'/g, '"'));
    } catch {
      return ['#6366f1'];
    }
  };

  const paletteColors = getPaletteColors();

  const socialLinks = [
    { url: brand.discord_url, icon: ChatBubbleLeftIcon, label: 'Discord' },
    { url: brand.instagram_url, icon: PhotoIcon, label: 'Instagram' },
    { url: brand.medium_url, icon: NewspaperIcon, label: 'Medium' },
    { url: brand.telegram_url, icon: PaperAirplaneIcon, label: 'Telegram' },
    { url: brand.twitter_url, icon: GlobeAltIcon, label: 'Twitter' },
  ].filter(link => link.url);

  return (
    <motion.div
      className="bg-gray-800/90 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-primary/30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -5,
        boxShadow: "0 20px 40px -20px rgba(var(--color-primary), 0.3)",
      }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <motion.div 
        className="relative aspect-square overflow-hidden bg-gray-900"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence mode="wait">
          {imageError ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex items-center justify-center bg-gray-900"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <PhotoIcon className="w-20 h-20 text-gray-700" />
              </motion.div>
            </motion.div>
          ) : (
            <motion.img
              key="image"
              src={brand.thumbnail_url}
              alt={brand.brand}
              onError={handleImageError}
              className="w-full h-full object-cover"
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: isHovered ? 1.15 : 1.1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            />
          )}
        </AnimatePresence>

        {/* Overlay gradient */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"
          initial={{ opacity: 0.6 }}
          animate={{ opacity: isHovered ? 0.7 : 0.6 }}
        />
        
        {/* Category badge */}
        <motion.div
          className="absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm"
          style={{
            backgroundColor: paletteColors[0] + '33',
            color: paletteColors[0],
          }}
          whileHover={{ scale: 1.05 }}
          animate={{ y: isHovered ? -2 : 0 }}
        >
          {brand.category}
        </motion.div>
      </motion.div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Header */}
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <motion.h3 
            className="text-xl font-bold text-white"
            whileHover={{ scale: 1.02, x: 4 }}
          >
            {brand.brand}
          </motion.h3>
          <motion.div 
            className="flex items-center space-x-2 text-sm text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="capitalize">{brand.blockchain}</span>
            <span>•</span>
            <span>{brand.contract_type}</span>
          </motion.div>
        </motion.div>

        {/* Description */}
        {brand.description && (
          <motion.p 
            className="text-gray-400 text-sm line-clamp-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {brand.description}
          </motion.p>
        )}

        {/* Social Links */}
        {socialLinks.length > 0 && (
          <motion.div 
            className="flex flex-wrap gap-2 pt-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {socialLinks.map(({ url, icon: Icon, label }, index) => (
              <motion.a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-700/50 hover:bg-primary/20 hover:text-primary transition-all duration-300"
                title={label}
                whileHover={{ scale: 1.1, rotate: 5 }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Icon className="w-5 h-5" />
              </motion.a>
            ))}
          </motion.div>
        )}

        {/* Contract Info */}
        <motion.div 
          className="pt-4 border-t border-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div 
            className="flex flex-col space-y-1"
            whileHover={{ x: 4 }}
          >
            <span className="text-gray-400 text-sm">Contract Address</span>
            <motion.span 
              className="text-white font-mono text-sm truncate hover:text-primary transition-colors cursor-pointer"
              whileHover={{ scale: 1.01 }}
              onClick={() => navigator.clipboard.writeText(brand.contract_address)}
              title="Click to copy"
            >
              {brand.contract_address}
            </motion.span>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BrandCategoryCard;
