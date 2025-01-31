import { CheckCircleIcon, XCircleIcon, UserGroupIcon } from '@heroicons/react/24/solid';

const BrandTable = ({ brands }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Brand
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Market Cap
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Growth
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Volume
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Holders
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {brands.map((brand, index) => (
            <tr key={index} className="hover:bg-gray-800/50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="text-sm font-medium">{brand.name}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm">${(brand.marketCap / 1000000).toFixed(2)}M</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className={`text-sm ${brand.growth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {brand.growth >= 0 ? '+' : ''}{brand.growth.toFixed(2)}%
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm">${(brand.volume / 1000).toFixed(2)}K</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm flex items-center">
                  <UserGroupIcon className="w-4 h-4 mr-1 text-gray-400" />
                  {brand.holders}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {brand.verified ? (
                  <span className="flex items-center text-green-400">
                    <CheckCircleIcon className="w-5 h-5 mr-1" />
                    Verified
                  </span>
                ) : (
                  <span className="flex items-center text-red-400">
                    <XCircleIcon className="w-5 h-5 mr-1" />
                    Unverified
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BrandTable;
