import React from 'react';
import TeamManager from '../../components/admin/TeamManager';

export default function AdminManageTeam() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Manage Team</h1>
      <TeamManager />
    </div>
  );
}