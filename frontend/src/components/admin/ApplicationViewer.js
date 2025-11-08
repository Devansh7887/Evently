import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function ApplicationViewer() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get('/api/careers/applications', config);
        setApplications(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch applications', error);
      }
    };
    fetchApplications();
  }, [token]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
      <h3 className="text-2xl font-bold mb-4">View Applications</h3>
      {loading ? (
        <p>Loading applications...</p>
      ) : applications.length === 0 ? (
        <p>No applications submitted yet.</p>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app._id} className="p-4 border rounded-lg">
              <p className="font-bold text-lg">{app.name} <span className="font-normal text-gray-600">- {app.email}</span></p>
              <p className="text-blue-600">Applied for: {app.jobId.jobTitle}</p>
              <p className="text-sm text-gray-500">Applied on: {new Date(app.appliedAt).toLocaleDateString()}</p>
              <a 
                href={app.resumeUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-green-600 font-semibold hover:underline"
              >
                View Resume
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}