import React, { useState } from 'react';
import type { User, Workspace } from '../../types';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';

interface UsersViewProps {
    users: User[];
    workspaces: Workspace[];
    onSuspendUser: (userId: string) => void;
    onReactivateUser: (userId: string) => void;
}

export const UsersView: React.FC<UsersViewProps> = ({
    users,
    workspaces,
    onSuspendUser,
    onReactivateUser
}) => {
    const [filter, setFilter] = useState<'all' | 'active' | 'suspended'>('all');

    const filteredUsers = users.filter(u => {
        if (filter === 'active') return u.status !== 'suspended';
        if (filter === 'suspended') return u.status === 'suspended';
        return true;
    });

    const getUserWorkspaces = (userId: string): number => {
        return workspaces.filter(w => userId in w.members).length;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
                <div className="flex gap-2">
                    <Button 
                        variant={filter === 'all' ? 'primary' : 'secondary'}
                        onClick={() => setFilter('all')}
                    >
                        All ({users.length})
                    </Button>
                    <Button 
                        variant={filter === 'active' ? 'primary' : 'secondary'}
                        onClick={() => setFilter('active')}
                    >
                        Active ({users.filter(u => u.status !== 'suspended').length})
                    </Button>
                    <Button 
                        variant={filter === 'suspended' ? 'primary' : 'secondary'}
                        onClick={() => setFilter('suspended')}
                    >
                        Suspended ({users.filter(u => u.status === 'suspended').length})
                    </Button>
                </div>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Workspaces
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map(user => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                        <div className="text-xs text-gray-500">{user.id}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{getUserWorkspaces(user.id)}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            user.status === 'suspended'
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-green-100 text-green-800'
                                        }`}>
                                            {user.status === 'suspended' ? 'Suspended' : 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {user.status === 'suspended' ? (
                                            <Button
                                                variant="primary"
                                                onClick={() => onReactivateUser(user.id)}
                                                className="!text-xs !py-1 !px-2"
                                            >
                                                Reactivate
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="secondary"
                                                onClick={() => onSuspendUser(user.id)}
                                                className="!text-xs !py-1 !px-2 !bg-red-600 !text-white hover:!bg-red-700"
                                            >
                                                Suspend
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

