import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function CareerManager() {
  const [careers, setCareers] = useState([]);
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [editingCareer, setEditingCareer] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  
  const { token } = useAuth();
  
  const fetchCareers = async () => {
    const { data } = await axios.get('/api/careers');
    setCareers(data);
  };

  useEffect(() => {
    fetchCareers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.post('/api/careers', { jobTitle, location, description }, config);
      setCareers([...careers, data]);
      // Form reset
      setJobTitle(''); setLocation(''); setDescription('');
    } catch (error) {
      console.error('Failed to create career', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.delete(`/api/careers/${id}`, config);
        setCareers(careers.filter((c) => c._id !== id));
      } catch (error) {
        console.error('Failed to delete career', error);
      }
    }
  };

  const openEditModal = (career) => {
    setEditingCareer(career);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setEditingCareer(null);
    setShowEditModal(false);
  };

  const handleCareerUpdated = (updatedCareer) => {
    setCareers(careers.map((c) => (c._id === updatedCareer._id ? updatedCareer : c)));
    closeEditModal();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
      <h3 className="text-2xl font-bold mb-4">Manage Careers</h3>
      {/* Add Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-6 pb-6 border-b">
        <input type="text" placeholder="Job Title" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className="w-full p-2 border rounded" required />
        <input type="text" placeholder="Location (e.g., Remote)" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full p-2 border rounded" required />
        <textarea placeholder="Job Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded"></textarea>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Add Job</button>
      </form>
      
      {/* List Careers */}
      <div className="space-y-4">
        {careers.map((career) => (
          <div key={career._id} className="flex justify-between items-center p-2 border rounded">
            <div>
              <p className="font-semibold">{career.jobTitle} ({career.location})</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEditModal(career)} className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600">Edit</button>
              <button onClick={() => handleDelete(career._id)} className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {showEditModal && editingCareer && (
        <EditCareerModal
          career={editingCareer}
          onClose={closeEditModal}
          onCareerUpdated={handleCareerUpdated}
          token={token}
        />
      )}
    </div>
  );
}

// Edit Career Modal Component
function EditCareerModal({ career, onClose, onCareerUpdated, token }) {
  const [jobTitle, setJobTitle] = useState(career.jobTitle);
  const [location, setLocation] = useState(career.location);
  const [description, setDescription] = useState(career.description || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(`/api/careers/${career._id}`, { jobTitle, location, description }, config);
      onCareerUpdated(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update career');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Edit Job Posting</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-gray-700">Job Title</label>
            <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className="w-full p-2 border rounded" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full p-2 border rounded" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Job Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded" rows="5"></textarea>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400">
              {loading ? 'Updating...' : 'Update Job'}
            </button>
            <button type="button" onClick={onClose} className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}