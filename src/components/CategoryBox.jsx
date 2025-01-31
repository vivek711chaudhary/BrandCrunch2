import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

// Import background images
import sportsImg from '../assets/sports.jpeg';
import fashionImg from '../assets/fashion.jpeg';
import collectiblesImg from '../assets/collectibles.jpeg';
import foodsImg from '../assets/Foodsbeverages.jpeg';
import skincareImg from '../assets/Skincarecosmetics.jpeg';
import mediaImg from '../assets/media.jpeg';
import travelImg from '../assets/travel.jpeg';

// Map categories to their respective images
const categoryImages = {
  'Sports': sportsImg,
  'Fashion': fashionImg,
  'Collectibles': collectiblesImg,
  'Food & Beverages': foodsImg,
  'Foods & Beverages': foodsImg,
  'Skincare & Cosmetics': skincareImg,
  'Media & Entertainment': mediaImg,
  'Travel & Hospitality': travelImg,
};

const CategoryBox = ({ category, isActive, onClick, count }) => {
  // Case-insensitive lookup for category images with special character handling
  const getNormalizedString = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  const backgroundImage = categoryImages[category] || 
    categoryImages[Object.keys(categoryImages).find(key => 
      getNormalizedString(key).includes(getNormalizedString(category)) ||
      getNormalizedString(category).includes(getNormalizedString(key))
    )] || '';

  console.log('Category:', category, 'Background Image:', backgroundImage); // Debug log

  return (
    <motion.div
      onClick={onClick}
      className={`relative cursor-pointer rounded-xl p-7 transition-all duration-500 transform hover:scale-[1.02] overflow-hidden
        ${
          isActive 
            ? 'border border-blue-500/30 shadow-lg shadow-blue-500/20' 
            : 'border border-gray-700/50 hover:border-blue-500/20 hover:shadow-lg hover:shadow-blue-500/10'
        }`}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay for better text visibility with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60 transition-opacity duration-500" />

      {/* Animated gradient overlay on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500
        ${isActive 
          ? 'from-blue-500/30 via-purple-500/30 to-pink-500/30 group-hover:opacity-100' 
          : 'from-blue-400/20 via-purple-400/20 to-pink-400/20 group-hover:opacity-100'
        }`} 
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <h3 className={`text-3xl font-bold mb-3 transition-all duration-500 
              ${isActive 
                ? 'text-white drop-shadow-lg' 
                : 'text-white group-hover:text-blue-200'
              } tracking-wide`}
              style={{
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                letterSpacing: '0.025em'
              }}
            >
              {category}
            </h3>
            <div className="flex items-center space-x-2">
              <span className={`px-4 py-1.5 rounded-full text-base font-medium backdrop-blur-md transition-all duration-500 
                ${isActive 
                  ? 'bg-white/20 text-white border border-white/30' 
                  : 'bg-black/40 text-white border border-white/10 group-hover:bg-white/20 group-hover:border-white/30'
                } shadow-lg`}
                style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
              >
                {count} {count === 1 ? 'Brand' : 'Brands'}
              </span>
            </div>
          </div>
          <motion.div
            initial={false}
            animate={{ rotate: isActive ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className={`transition-colors duration-500 ${
              isActive ? 'text-white' : 'text-white/80 group-hover:text-white'
            }`}
            style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))' }}
          >
            {isActive ? <ChevronUpIcon className="w-6 h-6" /> : <ChevronDownIcon className="w-6 h-6" />}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default CategoryBox;
