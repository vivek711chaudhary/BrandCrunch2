import { fetchAllData, getCombinedBrandData } from './debugData.js';

const runTest = async () => {
  console.log('Starting data fetch test...');

  try {
    // Fetch all data
    console.log('\nFetching all data...');
    const allData = await fetchAllData();
    
    if (!allData.success) {
      console.error('Failed to fetch all data:', allData.error);
      return;
    }

    // Get combined data
    console.log('\nGetting combined data...');
    const combinedData = await getCombinedBrandData();
    
    if (!combinedData.success) {
      console.error('Failed to get combined data:', combinedData.error);
      return;
    }

    console.log('\n=== TEST RESULTS ===\n');

    // Log data counts per endpoint
    console.log('Data counts per endpoint:');
    Object.entries(allData.data).forEach(([endpoint, data]) => {
      console.log(`${endpoint}: ${data.sorted.length} items`);
    });

    // Log combined data stats
    console.log('\nCombined data stats:');
    console.log(`Total unique brands: ${combinedData.data.length}`);

    // Sample data check
    if (combinedData.data.length > 0) {
      console.log('\nSample brand data:');
      console.log(JSON.stringify(combinedData.data[0], null, 2));
    }

    console.log('\nTest completed successfully!');
  } catch (error) {
    console.error('Test failed with error:', error);
  }
};

// Run the test
runTest();
