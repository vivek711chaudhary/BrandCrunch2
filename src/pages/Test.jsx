import { useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Loader } from '../components/ui/loader';
import NFTChart from '../components/Charts/NFTChart';

const API_KEY = import.meta.env.VITE_API_KEY || '3e736dba7151eb8de28a065916dc9d70';

function Test() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [contractAddresses, setContractAddresses] = useState([]);
  const [newContractAddress, setNewContractAddress] = useState('');

  // API Parameters
  const [params, setParams] = useState({
    blockchain: 'ethereum',
    time_range: '24h',
    offset: 0,
    limit: 30,
    sort_by: 'diamond_hands',
    sort_order: 'desc'
  });

  const blockchainOptions = ['ethereum', 'binance', 'polygon', 'solana', 'avalanche', 'linea'];
  const timeRangeOptions = ['24h', '7d', '30d', '90d', 'all'];
  const sortByOptions = [
    'diamond_hands',
    'profitable_volume',
    'loss_making_volume',
    'profitable_trades',
    'loss_making_trades',
    'collection_score'
  ];
  const sortOrderOptions = ['asc', 'desc'];

  const handleParamChange = (key, value) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const handleAddContractAddress = () => {
    if (newContractAddress && !contractAddresses.includes(newContractAddress)) {
      setContractAddresses([...contractAddresses, newContractAddress]);
      setNewContractAddress('');
    }
  };

  const handleRemoveContractAddress = (address) => {
    setContractAddresses(contractAddresses.filter(a => a !== address));
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    // Prepare API parameters
    const apiParams = {
      ...params,
      offset: params.offset.toString(),
      limit: params.limit.toString()
    };

    // Only add contract_address if we have any
    if (contractAddresses.length > 0) {
      apiParams.contract_address = contractAddresses;
    }

    try {
      const response = await axios({
        method: 'GET',
        url: 'https://api.unleashnfts.com/api/v2/nft/brand/contract_profile',
        params: apiParams,
        headers: {
          'accept': 'application/json',
          'x-api-key': API_KEY
        },
        paramsSerializer: params => {
          const searchParams = new URLSearchParams();
          Object.entries(params).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              value.forEach(v => searchParams.append(key, v));
            } else {
              searchParams.append(key, value);
            }
          });
          return searchParams.toString();
        }
      });

      console.log('API Response:', response.data);
      setResponse(response.data);
    } catch (err) {
      console.error('API Error:', err.response?.data || err.message);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>API Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Blockchain */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Blockchain</label>
            <select
              className="w-full p-2 border rounded-md"
              value={params.blockchain}
              onChange={(e) => handleParamChange('blockchain', e.target.value)}
            >
              {blockchainOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Contract Addresses */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Contract Addresses</label>
            <div className="flex gap-2">
              <Input
                value={newContractAddress}
                onChange={(e) => setNewContractAddress(e.target.value)}
                placeholder="Enter contract address"
              />
              <Button onClick={handleAddContractAddress}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {contractAddresses.map(address => (
                <div key={address} className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1">
                  <span className="text-sm">{address}</span>
                  <button
                    onClick={() => handleRemoveContractAddress(address)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Time Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Time Range</label>
            <select
              className="w-full p-2 border rounded-md"
              value={params.time_range}
              onChange={(e) => handleParamChange('time_range', e.target.value)}
            >
              {timeRangeOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Offset */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Offset</label>
            <Input
              type="number"
              min="0"
              value={params.offset}
              onChange={(e) => handleParamChange('offset', parseInt(e.target.value))}
            />
          </div>

          {/* Limit */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Limit</label>
            <Input
              type="number"
              min="1"
              max="100"
              value={params.limit}
              onChange={(e) => handleParamChange('limit', parseInt(e.target.value))}
            />
          </div>

          {/* Sort By */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Sort By</label>
            <select
              className="w-full p-2 border rounded-md"
              value={params.sort_by}
              onChange={(e) => handleParamChange('sort_by', e.target.value)}
            >
              {sortByOptions.map(option => (
                <option key={option} value={option}>
                  {option.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Order */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Sort Order</label>
            <select
              className="w-full p-2 border rounded-md"
              value={params.sort_order}
              onChange={(e) => handleParamChange('sort_order', e.target.value)}
            >
              {sortOrderOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <Button onClick={fetchData} className="w-full">
            Fetch Data
          </Button>
        </CardContent>
      </Card>

      {loading && <Loader />}

      {error && (
        <Card className="mb-8 border-red-500">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-red-500">{error}</pre>
          </CardContent>
        </Card>
      )}

      {response && (
        <>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <NFTChart data={response.data} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Response</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap overflow-auto max-h-96">
                {JSON.stringify(response, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

export default Test;
