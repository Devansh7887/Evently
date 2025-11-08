import React from 'react';
import ApplicationViewer from '../../components/admin/ApplicationViewer';

export default function AdminViewApplications() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">View Job Applications</h1>
      <ApplicationViewer />
    </div>
  );
}