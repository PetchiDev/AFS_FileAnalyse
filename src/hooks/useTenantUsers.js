import { useState, useCallback, useEffect } from 'react';
import { graphService } from '@/services/graph.service';

/**
 * Hook to search users from the Microsoft tenant via Backend
 */
export const useTenantUsers = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [topLimit, setTopLimit] = useState(10);
    const [totalCount, setTotalCount] = useState(0);

    const formatUsers = (userList) => {
        return userList.map(user => ({
            id: user.object_id,
            name: user.display_name,
            email: user.email,
            title: user.job_title,
            avatar: user.display_name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
        }));
    };

    const fetchUsers = useCallback(async (query = '', limit = 10) => {
        setIsLoading(true);
        setError(null);
        try {
            // We use the cumulative 'top' parameter to get users from the start up to the limit
            const result = await graphService.searchUsers(query, limit, null);
            setUsers(formatUsers(result.users));
            setTotalCount(result.total_count);
        } catch (err) {
            setError(err.message);
            setUsers([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const searchUsers = useCallback((query = '') => {
        setTopLimit(10);
        fetchUsers(query, 10);
    }, [fetchUsers]);

    const loadMore = useCallback((query = '') => {
        const nextLimit = topLimit + 10;
        setTopLimit(nextLimit);
        fetchUsers(query, nextLimit);
    }, [topLimit, fetchUsers]);

    // Initial load
    useEffect(() => {
        fetchUsers('', 10);
    }, []); // Run once on mount

    return {
        users,
        isLoading,
        hasNextPage: users.length > 0,
        error,
        searchUsers,
        loadMore
    };
};
