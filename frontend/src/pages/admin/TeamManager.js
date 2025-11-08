import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function TeamManager() {
  const [members, setMembers] = useState([]);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState(null);
  
  const { token } = useAuth();
  
  const fetchMembers = async () => {
    const { data } = await axios.get('/api/team');
    setMembers(data);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('role', role);
    formData.append('bio', bio);
    formData.append('image', image); // 'image' naam field se match hona chahiye

    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` } };
      const { data } = await axios.post('/api/team', formData, config);
      setMembers([...members, data]);
      // Form reset
      setName(''); setRole(''); setBio(''); setImage(null); e.target.reset();
    } catch (error) {
      console.error('Failed to create team member', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.delete(`/api/team/${id}`, config);
        setMembers(members.filter((m) => m._id !== id));
      } catch (error) {
        console.error('Failed to delete team member', error);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
      <h3 className="text-2xl font-bold mb-4">Manage Team</h3>
      {/* Add Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-6 pb-6 border-b">
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded" required />
        <input type="text" placeholder="Role (e.g., CEO)" value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-2 border rounded" required />
        <textarea placeholder="Bio" value={bio} onChange={(e) => setBio(e.target.value)} className="w-full p-2 border rounded"></textarea>
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="w-full p-2 border rounded" required />
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Add Member</button>
      </form>
      
      {/* List Members */}
      <div className="space-y-4">
        {members.map((member) => (
          <div key={member._id} className="flex justify-between items-center p-2 border rounded">
            <div>
              <p className="font-semibold">{member.name} ({member.role})</p>
            </div>
            <button onClick={() => handleDelete(member._id)} className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}