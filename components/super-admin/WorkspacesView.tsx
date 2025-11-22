import React, { useState } from 'react';
import type { Workspace, User } from '../../types';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';

interface WorkspacesViewProps {
    workspaces: Workspace[];
    users: User[];
    onSuspendWorkspace: (workspaceId: string) => void;
    onReactivateWorkspace: (workspaceId: string) => void;
    onImpersonateOwner: (workspaceId: string) => void;
}

export const WorkspacesView: React.FC<WorkspacesViewProps> = ({
    workspaces,
    users,
    onSuspendWorkspace,
    onReactivateWorkspace,
    onImpersonateOwner
}) => {
    const [filter, setFilter] = useState<'all' | 'active' | 'suspended'>('all');

    const filteredWorkspaces = workspaces.filter(w => {
        if (filter === 'active') return w.status !== 'suspended';
        if (filter === 'suspended') return w.status === 'suspended';
        return true;
    });

    const getOwnerName = (workspace: Workspace): string => {
        const ownerEntry = Object.entries(workspace.members).find(([_, member]) => member.role === 'owner');
        if (!ownerEntry) return 'Unknown';
        const owner = users.find(u => u.id === ownerEntry[0]);
        return owner?.name || 'Unknown';
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Workspace Management</h2>
                <div className="flex gap-2">
                    <Button 
                        variant={filter === 'all' ? 'primary' : 'secondary'}
                        onClick={() => setFilter('all')}
                    >
                        All ({workspaces.length})
                    </Button>
                    <Button 
                        variant={filter === 'active' ? 'primary' : 'secondary'}
                        onClick={() => setFilter('active')}
                    >
                        Active ({workspaces.filter(w => w.status !== 'suspended').length})
                    </Button>
                    <Button 
                        variant={filter === 'suspended' ? 'primary' : 'secondary'}
                        onClick={() => setFilter('suspended')}
                    >
                        Suspended ({workspaces.filter(w => w.status === 'suspended').length})
                    </Button>
                </div>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Workspace Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Owner
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Members
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
                            {filteredWorkspaces.map(workspace => (
                                <tr key={workspace.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{workspace.name}</div>
                                        <div className="text-xs text-gray-500">{workspace.id}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{getOwnerName(workspace)}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{Object.keys(workspace.members).length}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            workspace.status === 'suspended'
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-green-100 text-green-800'
                                        }`}>
                                            {workspace.status === 'suspended' ? 'Suspended' : 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        {workspace.status === 'suspended' ? (
                                            <Button
                                                variant="primary"
                                                onClick={() => onReactivateWorkspace(workspace.id)}
                                                className="!text-xs !py-1 !px-2"
                                            >
                                                Reactivate
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="secondary"
                                                onClick={() => onSuspendWorkspace(workspace.id)}
                                                className="!text-xs !py-1 !px-2 !bg-red-600 !text-white hover:!bg-red-700"
                                            >
                                                Suspend
                                            </Button>
                                        )}
                                        <Button
                                            variant="secondary"
                                            onClick={() => onImpersonateOwner(workspace.id)}
                                            className="!text-xs !py-1 !px-2"
                                        >
                                            Login as Owner
                                        </Button>
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

