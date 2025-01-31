import axios from 'axios';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const API_KEY = '3e736dba7151eb8de28a065916dc9d70';
const BASE_URL = 'https://api.unleashnfts.com/api/v2/nft/brand';

// Debug logger
const logger = {
  info: (...args) => console.log('\x1b[36m%s\x1b[0m', '[INFO]', ...args),
  error: (...args) => console.log('\x1b[31m%s\x1b[0m', '[ERROR]', ...args),
  success: (...args) => console.log('\x1b[32m%s\x1b[0m', '[SUCCESS]', ...args),
  data: (...args) => console.log('\x1b[33m%s\x1b[0m', '[DATA]', ...args),
};

// Common API configuration with debug logging
const createApiConfig = (endpoint, params = {}) => {
  logger.info(`Creating API config for endpoint: ${endpoint}`);
  const config = {
    method: 'GET',
    url: `${BASE_URL}/${endpoint}`,
    params: {
      blockchain: 'ethereum',
      offset: '0',
      limit: '30',
      ...params,
    },
    headers: {
      accept: 'application/json',
      'x-api-key': API_KEY,
    },
  };
  logger.info(`Config created:`, config);
  return config;
};

// Helper function to sort data by brand name with debug logging
const sortByBrandName = (data) => {
  logger.info(`Sorting ${data.length} items by brand name`);
  const sorted = [...data].sort((a, b) => {
    const brandA = (a.brand || '').toLowerCase();
    const brandB = (b.brand || '').toLowerCase();
    return brandA.localeCompare(brandB);
  });
  logger.success(`Sorting complete`);
  return sorted;
};

// Save data to file
const saveToFile = async (data, filename) => {
  try {
    const filePath = join(__dirname, filename);
    await writeFile(
      filePath,
      JSON.stringify(data, null, 2),
      'utf8'
    );
    logger.success(`Data saved to ${filePath}`);
  } catch (error) {
    logger.error(`Error saving file: ${error.message}`);
  }
};

// Fetch and process data from all endpoints with debug logging
export const fetchAllData = async () => {
  logger.info('Starting data fetch process');
  
  try {
    const endpoints = [
      { 
        name: 'metadata',
        config: createApiConfig('metadata')
      },
      { 
        name: 'metrics',
        config: createApiConfig('metrics', {
          time_range: '24h',
          sort_by: 'mint_tokens',
          sort_order: 'desc'
        })
      },
      { 
        name: 'profile',
        config: createApiConfig('profile', {
          time_range: '24h',
          sort_by: 'diamond_hands',
          sort_order: 'desc'
        })
      },
      { 
        name: 'contract_metadata',
        config: createApiConfig('contract_metadata')
      },
      { 
        name: 'contract_metrics',
        config: createApiConfig('contract_metrics', {
          time_range: '24h',
          sort_by: 'mint_tokens',
          sort_order: 'desc'
        })
      },
      { 
        name: 'contract_profile',
        config: createApiConfig('contract_profile', {
          sort_by: 'diamond_hands'
        })
      },
      { 
        name: 'category',
        config: createApiConfig('category')
      }
    ];

    logger.info(`Fetching data from ${endpoints.length} endpoints`);
    const results = {};
    const errors = [];

    // Fetch data from all endpoints concurrently
    const responses = await Promise.allSettled(
      endpoints.map(async ({ name, config }) => {
        try {
          logger.info(`Fetching data from ${name} endpoint`);
          const response = await axios.request(config);
          logger.success(`Successfully fetched data from ${name}`);
          logger.data(`${name} data:`, response.data);
          
          // Save raw response to debug file
          await saveToFile(response.data, `raw_${name}_data.json`);
          
          return {
            name,
            data: response.data,
          };
        } catch (error) {
          logger.error(`Error fetching ${name}: ${error.message}`);
          errors.push({
            endpoint: name,
            error: error.message,
          });
          return {
            name,
            data: { data: [] },
          };
        }
      })
    );

    // Process responses and sort data
    responses.forEach((result) => {
      if (result.status === 'fulfilled') {
        const { name, data } = result.value;
        logger.info(`Processing ${name} data`);
        results[name] = {
          original: data.data || [],
          sorted: sortByBrandName(data.data || []),
          pagination: data.pagination || {},
        };
      }
    });

    // Save processed results
    await saveToFile(results, 'processed_data.json');
    
    logger.success('Data fetching and processing complete');
    return {
      success: true,
      data: results,
      errors: errors.length > 0 ? errors : null,
    };
  } catch (error) {
    logger.error('Error in fetchAllData:', error.message);
    return {
      success: false,
      error: error.message,
      data: null,
    };
  }
};

// Helper function to get combined brand data with debug logging
export const getCombinedBrandData = async () => {
  logger.info('Starting to combine brand data');
  const result = await fetchAllData();
  
  if (!result.success) {
    logger.error('Failed to fetch data:', result.error);
    return result;
  }

  const brandMap = new Map();

  // Process each dataset and combine by brand
  Object.entries(result.data).forEach(([dataType, { sorted }]) => {
    logger.info(`Processing ${dataType} data for combination`);
    sorted.forEach((item) => {
      const brandName = item.brand;
      if (!brandName) {
        logger.info(`Skipping item without brand name in ${dataType}`);
        return;
      }

      if (!brandMap.has(brandName)) {
        logger.info(`Creating new brand entry for ${brandName}`);
        brandMap.set(brandName, {
          brand: brandName,
          data: {},
        });
      }

      brandMap.get(brandName).data[dataType] = item;
    });
  });

  // Convert map to sorted array
  const combinedData = Array.from(brandMap.values())
    .sort((a, b) => a.brand.localeCompare(b.brand));

  // Save combined data
  await saveToFile(combinedData, 'combined_brand_data.json');
  
  logger.success(`Combined data created with ${combinedData.length} brands`);
  return {
    success: true,
    data: combinedData,
    errors: result.errors,
  };
};

// Debug function to test the data fetching and processing
const debugDataFetch = async () => {
  logger.info('Starting debug data fetch');
  
  try {
    // Fetch all data
    logger.info('Fetching all data...');
    const allData = await fetchAllData();
    logger.data('All data fetch result:', allData.success ? 'Success' : 'Failed');
    
    if (allData.errors) {
      logger.error('Errors during fetch:', allData.errors);
    }

    // Get combined data
    logger.info('Getting combined brand data...');
    const combinedData = await getCombinedBrandData();
    logger.data('Combined data result:', combinedData.success ? 'Success' : 'Failed');

    return {
      allData,
      combinedData
    };
  } catch (error) {
    logger.error('Debug process failed:', error.message);
    return {
      error: error.message
    };
  }
};

// Auto-run debug process
debugDataFetch().then(() => {
  logger.success('Debug process complete');
}).catch((error) => {
  logger.error('Debug process failed:', error.message);
});
