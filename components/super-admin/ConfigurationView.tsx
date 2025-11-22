import React from 'react';
import type { PlatformConfig } from '../../types';
import { Card } from '../shared/Card';

interface ConfigurationViewProps {
    config: PlatformConfig | null;
}

export const ConfigurationView: React.FC<ConfigurationViewProps> = ({ config }) => {
    if (!config) {
        return (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Platform Configuration</h2>
                <Card>
                    <p className="text-gray-500">No configuration data available</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Platform Configuration</h2>
            
            <Card title="Feature Flags">
                <div className="space-y-2">
                    {Object.entries(config.featureFlags).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                            <span className="font-medium text-gray-700">{key}</span>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                                {value ? 'Enabled' : 'Disabled'}
                            </span>
                        </div>
                    ))}
                </div>
            </Card>

            <Card title="Default Permissions">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Feature
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Enabled
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Allowed Roles
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {Object.entries(config.defaultPermissions).map(([feature, permission]) => (
                                <tr key={feature}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {feature}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            permission.enabled
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {permission.enabled ? 'Yes' : 'No'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        <div className="flex flex-wrap gap-1">
                                            {permission.allowedRoles.map(role => (
                                                <span key={role} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                                    {role}
                                                </span>
                                            ))}
                                        </div>
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

