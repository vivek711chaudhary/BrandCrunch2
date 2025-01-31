import axios from 'axios';

const API_KEY = import.meta.env.VITE_API_KEY || '3e736dba7151eb8de28a065916dc9d70';
const BASE_URL = 'https://api.unleashnfts.com/api/v2/nft';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'accept': 'application/json',
    'x-api-key': API_KEY
  }
});

export const getBrandMetrics = async (params = {}) => {
  const defaultParams = {
    blockchain: 'ethereum',
    time_range: '24h',
    offset: '0',
    limit: '30',
    sort_by: 'mint_tokens',
    sort_order: 'desc'
  };

  try {
    const response = await api.get('/brand/contract_metrics', {
      params: { ...defaultParams, ...params }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching brand metrics:', error);
    throw error;
  }
};

export const getBrandProfile = async (params = {}) => {
  const defaultParams = {
    blockchain: 'ethereum',
    time_range: '24h',
    offset: '0',
    limit: '30',
    sort_by: 'diamond_hands',
    sort_order: 'desc'
  };

  try {
    const response = await api.get('/brand/profile', {
      params: { ...defaultParams, ...params }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching brand profile:', error);
    throw error;
  }
};

export const getBrandContractMetadata = async (params = {}) => {
  const defaultParams = {
    blockchain: 'ethereum',
    offset: '0',
    limit: '30'
  };

  try {
    const response = await api.get('/brand/contract_metadata', {
      params: { ...defaultParams, ...params }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching contract metadata:', error);
    throw error;
  }
};
