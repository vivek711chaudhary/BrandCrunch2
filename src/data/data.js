import axios from 'axios';
import { fetchNFTBrandMetadata } from '../api/nftMetadata';
import { fetchNFTBrandContractProfile } from '../api/nftBrandContractProfile';

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = 'https://api.unleashnfts.com/api/v2/nft/brand';

// Common API configuration
const createApiConfig = (endpoint, params = {}) => {
  console.log('Creating API config for endpoint:', endpoint, 'with params:', params);
  return {
    method: 'GET',
    url: `${BASE_URL}/${endpoint}`,
    params: {
      blockchain: params.blockchain || 'ethereum',
      time_range: params.timeRange || '24h',
      offset: params.offset || '0',
      limit: params.limit || '30',
      sort_by: params.sortBy || 'total_volume',
      sort_order: params.sortOrder || 'desc',
    },
    headers: {
      accept: 'application/json',
      'x-api-key': API_KEY,
    },
  };
};

// Helper function to sort data by specified field
const sortData = (data, sortBy = 'total_volume', sortOrder = 'desc') => {
  return [...data].sort((a, b) => {
    let valueA, valueB;
    
    // Handle nested properties for metrics
    if (sortBy === 'total_volume' || sortBy === 'total_revenue') {
      valueA = parseFloat(a.data?.metrics?.[sortBy]) || 0;
      valueB = parseFloat(b.data?.metrics?.[sortBy]) || 0;
    } else if (sortBy === 'brand') {
      valueA = (a.brand || '').toLowerCase();
      valueB = (b.brand || '').toLowerCase();
      return sortOrder === 'desc' ? valueB.localeCompare(valueA) : valueA.localeCompare(valueB);
    } else {
      valueA = a.data?.metrics?.[sortBy] || 0;
      valueB = b.data?.metrics?.[sortBy] || 0;
    }
    
    return sortOrder === 'desc' ? valueB - valueA : valueA - valueB;
  });
};

// Function to create API endpoints configuration
const createEndpoints = (params = {}) => {
  console.log('Creating endpoints with params:', params);
  return [
    { 
      name: 'metadata',
      config: createApiConfig('metadata', params)
    },
    { 
      name: 'metrics',
      config: createApiConfig('metrics', params)
    },
    { 
      name: 'profile',
      config: createApiConfig('profile', params)
    }
  ];
};

// Fetch and process data from all endpoints
const fetchAllData = async (params = {}) => {
  try {
    console.log('Fetching all data with params:', params);
    const endpoints = createEndpoints(params);
    
    console.log('Making API requests to endpoints:', endpoints);
    const responses = await Promise.all(
      endpoints.map(async endpoint => {
        try {
          console.log(`Making request to ${endpoint.name} with config:`, endpoint.config);
          const response = await axios(endpoint.config);
          console.log(`Response from ${endpoint.name}:`, response.data);
          
          if (!response.data || !response.data.data) {
            console.error(`Invalid response from ${endpoint.name}:`, response);
            return {
              name: endpoint.name,
              data: []
            };
          }
          
          return {
            name: endpoint.name,
            data: response.data.data
          };
        } catch (error) {
          console.error(`Error fetching ${endpoint.name}:`, error);
          return {
            name: endpoint.name,
            data: []
          };
        }
      })
    );

    console.log('All API responses:', responses);

    // Process responses into a combined dataset
    const combinedData = [];
    const dataMap = {};

    responses.forEach(response => {
      if (!response.data) {
        console.log(`Skipping response with no data for ${response.name}`);
        return;
      }
      
      console.log(`Processing data for ${response.name}:`, response.data);
      response.data.forEach(item => {
        if (!item || !item.brand) {
          console.log('Skipping item with no brand:', item);
          return;
        }
        
        const brandKey = item.brand.toLowerCase();
        if (!dataMap[brandKey]) {
          dataMap[brandKey] = {
            brand: item.brand,
            data: {}
          };
        }
        dataMap[brandKey].data[response.name] = item;
      });
    });

    console.log('Processed data map:', dataMap);

    Object.values(dataMap).forEach(item => {
      combinedData.push(item);
    });

    // Sort data based on provided parameters
    const sortedData = sortData(combinedData, params.sortBy, params.sortOrder);
    console.log('Final sorted data:', sortedData);
    
    return sortedData;
  } catch (error) {
    console.error('Error in fetchAllData:', error);
    throw error;
  }
};

// Helper function to get combined brand data
export const getCombinedBrandData = async (params = {}) => {
  try {
    console.log('Getting combined brand data with params:', params);
    const data = await fetchAllData(params);
    return data;
  } catch (error) {
    console.error('Error in getCombinedBrandData:', error);
    throw error;
  }
};

// Helper function to fetch brand metadata
export const fetchBrandMetadata = async (params = {}) => {
  try {
    console.log('Fetching brand metadata with params:', params);
    const config = createApiConfig('metadata', params);
    const response = await axios(config);
    console.log('Metadata response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching brand metadata:', error);
    throw error;
  }
};

// Helper function to fetch brand contract profile
export const fetchBrandContractProfile = async (params = {}) => {
  try {
    console.log('Fetching brand contract profile with params:', params);
    const config = createApiConfig2('contract_profile', params);
    const response = await axios(config);
    console.log('Contract profile response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching brand contract profile:', error);
    throw error;
  }
};


// Common API configuration
const createApiConfig2 = (endpoint, params = {}) => {
  console.log('Creating API config for endpoint:', endpoint, 'with params:', params);
  return {
    method: 'GET',
    url: `${BASE_URL}/${endpoint}`,
    params: {
      blockchain: params.blockchain || 'ethereum',
      time_range: params.timeRange || '24h',
      offset: params.offset || '0',
      limit: params.limit || '30',
      sort_by: params.sortBy || 'diamond_hands',
      sort_order: params.sortOrder || 'desc',
    },
    headers: {
      accept: 'application/json',
      'x-api-key': API_KEY,
    },
  };
};