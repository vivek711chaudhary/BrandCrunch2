import { useState } from 'react';
import {
  GlobeAltIcon,
  ChatBubbleLeftIcon,
  PhotoIcon,
  LinkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClipboardIcon,
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

const BrandMetadataCard = ({ brand }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const maxDescriptionLength = 150;

  const socialLinks = [
    { url: brand.twitter_url, icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>, name: 'Twitter' },
    { url: brand.discord_url, icon: <ChatBubbleLeftIcon className="w-5 h-5" />, name: 'Discord' },
    { url: brand.instagram_url, icon: <PhotoIcon className="w-5 h-5" />, name: 'Instagram' },
    { url: brand.medium_url, icon: <GlobeAltIcon className="w-5 h-5" />, name: 'Medium' },
    { url: brand.telegram_url, icon: <ChatBubbleLeftIcon className="w-5 h-5" />, name: 'Telegram' },
  ].filter(link => link.url);

  const description = brand.description || 'No description available';
  const isDescriptionLong = description.length > maxDescriptionLength;
  const truncatedDescription = isDescriptionLong 
    ? `${description.slice(0, maxDescriptionLength)}...`
    : description;

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(brand.contract_address);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <motion.div
      className="relative bg-gradient-to-br from-gray-800/50 via-gray-800/30 to-gray-900/50 backdrop-blur-sm rounded-xl p-7 
        border border-gray-700/50 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10 
        transition-all duration-500 overflow-hidden group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 
        group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500" />
      
      <div className="relative space-y-5 z-10">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-3xl font-bold font-poppins tracking-tight text-transparent bg-clip-text 
              bg-gradient-to-r from-white to-gray-300 group-hover:from-blue-400 group-hover:to-purple-400 
              transition-all duration-500 mb-2">
              {brand.brand}
            </h3>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium 
              bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 
              group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-500">
              {brand.category}
            </span>
          </div>
          <span className="px-4 py-1.5 rounded-full text-base font-medium bg-gradient-to-r 
            from-blue-500/20 to-purple-500/20 text-blue-300 backdrop-blur-sm
            group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-500">
            {brand.contract_type}
          </span>
        </div>

        {/* Description */}
        <div className="space-y-3">
          <p className="text-base leading-relaxed text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
            {isExpanded ? description : truncatedDescription}
          </p>
          {isDescriptionLong && (
            <motion.button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-lg 
                bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300
                hover:from-blue-500/30 hover:to-purple-500/30 hover:text-blue-200
                transition-all duration-300 group/btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-sm font-medium">{isExpanded ? 'Show less' : 'Read more'}</span>
              {isExpanded ? (
                <ChevronUpIcon className="w-4 h-4 group-hover/btn:transform group-hover/btn:-translate-y-0.5 transition-transform duration-300" />
              ) : (
                <ChevronDownIcon className="w-4 h-4 group-hover/btn:transform group-hover/btn:translate-y-0.5 transition-transform duration-300" />
              )}
            </motion.button>
          )}
        </div>

        {/* Contract Address */}
        <div className="flex items-center justify-between space-x-3 p-4 rounded-xl
          bg-gray-800/30 border border-gray-700/50 group-hover:border-blue-500/20 
          backdrop-blur-sm transition-all duration-500">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <LinkIcon className="w-5 h-5 text-blue-400 flex-shrink-0" />
            <code className="text-sm text-gray-300 font-mono truncate flex-1">
              {brand.contract_address}
            </code>
          </div>
          <motion.button
            onClick={handleCopyAddress}
            className="p-2 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 
              hover:text-blue-200 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Copy to clipboard"
          >
            <ClipboardIcon className="w-4 h-4" />
            <AnimatePresence>
              {isCopied && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 
                    rounded bg-green-500/90 text-white text-xs"
                >
                  Copied!
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Social Links */}
        {socialLinks.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {socialLinks.map((link, index) => (
              <motion.a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-gray-700/30 text-gray-400
                  hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 
                  hover:text-blue-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/20
                  transition-all duration-300"
                title={link.name}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {link.icon}
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BrandMetadataCard;
