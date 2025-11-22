import React, { useState, useEffect } from 'react';
import type { User, Workspace, PlatformConfig, AuditLogEntry } from '../../types';
import { SuperAdminDashboard } from './Dashboard';
import { WorkspacesView } from './WorkspacesView';
import { UsersView } from './UsersView';
import { AuditLogView } from './AuditLogView';
import { ConfigurationView } from './ConfigurationView';
import { Button } from '../shared/Button';
import { queryCollection, updateDocument, getDocument, addDocument } from '../../services/firestoreService';

interface SuperAdminPanelProps {
    onLogout: () => void;
    onImpersonateUser: (user: User, workspace: Workspace) => void;
}

type View = 'dashboard' | 'workspaces' | 'users' | 'audit' | 'config';

export const SuperAdminPanel: React.FC<SuperAdminPanelProps> = ({ onLogout, onImpersonateUser }) => {
    const [currentView, setCurrentView] = useState<View>('dashboard');
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
    const [platformConfig, setPlatformConfig] = useState<PlatformConfig | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [workspacesData, usersData, configData, auditData] = await Promise.all([
                queryCollection<Workspace>('workspaces'),
                queryCollection<User>('users'),
                getDocument<PlatformConfig>('platform', 'config'),
                queryCollection<AuditLogEntry>('platform/config/auditLog')
            ]);

            setWorkspaces(workspacesData);
            setUsers(usersData);
            setPlatformConfig(configData);
            setAuditLog(auditData);
        } catch (error) {
            console.error('Error loading Super Admin data:', error);
        }
    };

    const logAction = async (action: string, targetType: 'user' | 'workspace', targetId: string, details: string) => {
        const entry: Omit<AuditLogEntry, 'id'> = {
            timestamp: new Date().toISOString(),
            action,
            performedBy: 'Super Admin',
            targetType,
            targetId,
            details
        };

        try {
            await addDocument('platform/config/auditLog', entry);
            await loadData(); // Reload to get updated audit log
        } catch (error) {
            console.error('Error logging action:', error);
        }
    };

    const handleSuspendWorkspace = async (workspaceId: string) => {
        try {
            await updateDocument('workspaces', workspaceId, { status: 'suspended' });
            const workspace = workspaces.find(w => w.id === workspaceId);
            await logAction('SUSPEND_WORKSPACE', 'workspace', workspaceId, `Suspended workspace: ${workspace?.name}`);
            await loadData();
        } catch (error) {
            console.error('Error suspending workspace:', error);
        }
    };

    const handleReactivateWorkspace = async (workspaceId: string) => {
        try {
            await updateDocument('workspaces', workspaceId, { status: 'active' });
            const workspace = workspaces.find(w => w.id === workspaceId);
            await logAction('REACTIVATE_WORKSPACE', 'workspace', workspaceId, `Reactivated workspace: ${workspace?.name}`);
            await loadData();
        } catch (error) {
            console.error('Error reactivating workspace:', error);
        }
    };

    const handleSuspendUser = async (userId: string) => {
        try {
            await updateDocument('users', userId, { status: 'suspended' });
            const user = users.find(u => u.id === userId);
            await logAction('SUSPEND_USER', 'user', userId, `Suspended user: ${user?.name} (${user?.email})`);
            await loadData();
        } catch (error) {
            console.error('Error suspending user:', error);
        }
    };

    const handleReactivateUser = async (userId: string) => {
        try {
            await updateDocument('users', userId, { status: 'active' });
            const user = users.find(u => u.id === userId);
            await logAction('REACTIVATE_USER', 'user', userId, `Reactivated user: ${user?.name} (${user?.email})`);
            await loadData();
        } catch (error) {
            console.error('Error reactivating user:', error);
        }
    };

    const handleImpersonateOwner = async (workspaceId: string) => {
        const workspace = workspaces.find(w => w.id === workspaceId);
        if (!workspace) return;

        const ownerEntry = Object.entries(workspace.members).find(([_, member]) => member.role === 'owner');
        if (!ownerEntry) {
            alert('No owner found for this workspace');
            return;
        }

        const owner = users.find(u => u.id === ownerEntry[0]);
        if (!owner) {
            alert('Owner user not found');
            return;
        }

        await logAction('IMPERSONATE', 'workspace', workspaceId, `Impersonated owner ${owner.name} of workspace ${workspace.name}`);
        onImpersonateUser(owner, workspace);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold">🔐 Super Admin Panel</h1>
                        <Button variant="secondary" onClick={onLogout} className="!bg-white !text-purple-600 hover:!bg-gray-100">
                            Logout
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="mb-6 flex gap-2 overflow-x-auto">
                    {[
                        { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
                        { id: 'workspaces', label: '🏢 Workspaces', icon: '🏢' },
                        { id: 'users', label: '👥 Users', icon: '👥' },
                        { id: 'audit', label: '📋 Audit Log', icon: '📋' },
                        { id: 'config', label: '⚙️ Configuration', icon: '⚙️' }
                    ].map(({ id, label }) => (
                        <Button
                            key={id}
                            variant={currentView === id ? 'primary' : 'secondary'}
                            onClick={() => setCurrentView(id as View)}
                        >
                            {label}
                        </Button>
                    ))}
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    {currentView === 'dashboard' && <SuperAdminDashboard workspaces={workspaces} users={users} />}
                    {currentView === 'workspaces' && (
                        <WorkspacesView
                            workspaces={workspaces}
                            users={users}
                            onSuspendWorkspace={handleSuspendWorkspace}
                            onReactivateWorkspace={handleReactivateWorkspace}
                            onImpersonateOwner={handleImpersonateOwner}
                        />
                    )}
                    {currentView === 'users' && (
                        <UsersView
                            users={users}
                            workspaces={workspaces}
                            onSuspendUser={handleSuspendUser}
                            onReactivateUser={handleReactivateUser}
                        />
                    )}
                    {currentView === 'audit' && <AuditLogView auditLog={auditLog} />}
                    {currentView === 'config' && <ConfigurationView config={platformConfig} />}
                </div>
            </div>
        </div>
    );
};

