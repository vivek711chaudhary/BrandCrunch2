import { motion } from 'framer-motion';

const StatCard = ({ title, value, change, icon: Icon }) => {
  const isPositive = change >= 0;
  
  return (
    <motion.div 
      className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 hover:border-primary/30 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 8px 32px -8px rgba(var(--color-primary), 0.2)"
      }}
      transition={{ duration: 0.2 }}
    >
      <motion.div 
        className="flex items-center justify-between mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
        {Icon && (
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="bg-gray-700/50 p-2 rounded-lg"
          >
            <Icon className="w-5 h-5 text-primary" />
          </motion.div>
        )}
      </motion.div>
      
      <motion.div 
        className="text-2xl font-bold text-white"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        {value}
      </motion.div>
      
      {change !== undefined && (
        <motion.div 
          className={`flex items-center mt-4 ${isPositive ? 'text-green-400' : 'text-red-400'}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.span 
            className="text-sm font-medium flex items-center gap-1"
            whileHover={{ scale: 1.05 }}
          >
            {isPositive ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
              </svg>
            )}
            {isPositive ? '+' : ''}{change}%
          </motion.span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default StatCard;
