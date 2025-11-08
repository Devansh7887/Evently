import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function CareerManager() {
  const [careers, setCareers] = useState([]);
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  
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
            <button onClick={() => handleDelete(career._id)} className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}