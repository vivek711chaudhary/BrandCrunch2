import { useState, useEffect } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import store from '../store/store';

const RefreshButton = () => {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);

    useEffect(() => {
        // Subscribe to store updates
        const unsubscribe = store.subscribe((state) => {
            setIsRefreshing(state.isLoading);
            setLastUpdated(state.lastUpdated);
        });

        return () => unsubscribe();
    }, []);

    const handleRefresh = async () => {
        await store.refreshData();
    };

    return (
        <div className="flex items-center space-x-2">
            <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    isRefreshing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
                <ArrowPathIcon
                    className={`-ml-0.5 mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
                    aria-hidden="true"
                />
                {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
            </button>
            {lastUpdated && (
                <span className="text-sm text-gray-400">
                    Last updated: {new Date(lastUpdated).toLocaleTimeString()}
                </span>
            )}
        </div>
    );
};

export default RefreshButton;
