import React from 'react';
import type { User, Workspace } from '../../types';
import { Card } from '../shared/Card';

interface SuperAdminDashboardProps {
    workspaces: Workspace[];
    users: User[];
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ workspaces, users }) => {
    const activeWorkspaces = workspaces.filter(w => w.status !== 'suspended').length;
    const suspendedWorkspaces = workspaces.filter(w => w.status === 'suspended').length;
    const activeUsers = users.filter(u => u.status !== 'suspended').length;
    const suspendedUsers = users.filter(u => u.status === 'suspended').length;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Platform Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card title="Total Workspaces" className="bg-blue-50">
                    <div className="text-4xl font-bold text-blue-600">{workspaces.length}</div>
                    <div className="text-sm text-gray-600 mt-2">
                        {activeWorkspaces} active, {suspendedWorkspaces} suspended
                    </div>
                </Card>

                <Card title="Total Users" className="bg-green-50">
                    <div className="text-4xl font-bold text-green-600">{users.length}</div>
                    <div className="text-sm text-gray-600 mt-2">
                        {activeUsers} active, {suspendedUsers} suspended
                    </div>
                </Card>

                <Card title="Active Workspaces" className="bg-purple-50">
                    <div className="text-4xl font-bold text-purple-600">{activeWorkspaces}</div>
                    <div className="text-sm text-gray-600 mt-2">
                        Currently operational
                    </div>
                </Card>

                <Card title="Active Users" className="bg-orange-50">
                    <div className="text-4xl font-bold text-orange-600">{activeUsers}</div>
                    <div className="text-sm text-gray-600 mt-2">
                        Currently active
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Recent Workspaces">
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {workspaces.slice(0, 5).map(workspace => (
                            <div key={workspace.id} className="p-3 bg-gray-50 rounded-md flex justify-between items-center">
                                <div>
                                    <div className="font-semibold">{workspace.name}</div>
                                    <div className="text-sm text-gray-600">
                                        {Object.keys(workspace.members).length} member(s)
                                    </div>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                    workspace.status === 'suspended' 
                                        ? 'bg-red-100 text-red-800' 
                                        : 'bg-green-100 text-green-800'
                                }`}>
                                    {workspace.status === 'suspended' ? 'Suspended' : 'Active'}
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card title="Recent Users">
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {users.slice(0, 5).map(user => (
                            <div key={user.id} className="p-3 bg-gray-50 rounded-md flex justify-between items-center">
                                <div>
                                    <div className="font-semibold">{user.name}</div>
                                    <div className="text-sm text-gray-600">{user.email}</div>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                    user.status === 'suspended' 
                                        ? 'bg-red-100 text-red-800' 
                                        : 'bg-green-100 text-green-800'
                                }`}>
                                    {user.status === 'suspended' ? 'Suspended' : 'Active'}
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

