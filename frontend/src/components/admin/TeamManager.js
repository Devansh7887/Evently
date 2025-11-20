import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function TeamManager() {
  const [members, setMembers] = useState([]);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState(null);
  const [linkedinId, setLinkedinId] = useState('');
  const [editingMember, setEditingMember] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  
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
    formData.append('linkedinId', linkedinId);
    formData.append('image', image); // 'image' naam field se match hona chahiye

    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` } };
      const { data } = await axios.post('/api/team', formData, config);
      setMembers([...members, data]);
      // Form reset
      setName(''); setRole(''); setBio(''); setImage(null);setLinkedinId(''); e.target.reset();
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

  const openEditModal = (member) => {
    setEditingMember(member);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setEditingMember(null);
    setShowEditModal(false);
  };

  const handleMemberUpdated = (updatedMember) => {
    setMembers(members.map((m) => (m._id === updatedMember._id ? updatedMember : m)));
    closeEditModal();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
      <h3 className="text-2xl font-bold mb-4">Manage Team</h3>
      {/* Add Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-6 pb-6 border-b">
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded" required />
        <input type="text" placeholder="Role (e.g., CEO)" value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-2 border rounded" required />
        <textarea placeholder="Bio" value={bio} onChange={(e) => setBio(e.target.value)} className="w-full p-2 border rounded"></textarea>
        <input type="text" placeholder="LinkedIn Profile URL (Optional)" value={linkedinId} onChange={(e) => setLinkedinId(e.target.value)} className="w-full p-2 border rounded" />
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
            <div className="flex gap-2">
              <button onClick={() => openEditModal(member)} className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600">Edit</button>
              <button onClick={() => handleDelete(member._id)} className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {showEditModal && editingMember && (
        <EditTeamModal
          member={editingMember}
          onClose={closeEditModal}
          onMemberUpdated={handleMemberUpdated}
          token={token}
        />
      )}
    </div>
  );
}

// Edit Team Member Modal Component
function EditTeamModal({ member, onClose, onMemberUpdated, token }) {
  const [name, setName] = useState(member.name);
  const [role, setRole] = useState(member.role);
  const [bio, setBio] = useState(member.bio || '');
  const [linkedinId, setLinkedinId] = useState(member.linkedinId || '');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('role', role);
    formData.append('bio', bio);
    formData.append('linkedinId', linkedinId);

    if (image) formData.append('image', image);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(`/api/team/${member._id}`, formData, config);
      onMemberUpdated(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update team member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Edit Team Member</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <input type="text" value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-2 border rounded" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full p-2 border rounded"></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">LinkedIn Profile URL</label>
            <input type="text" value={linkedinId} onChange={(e) => setLinkedinId(e.target.value)} className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Image (Optional - leave empty to keep current)</label>
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="w-full p-2 border rounded" />
            {member.imageUrl && <img src={member.imageUrl} alt="Current" className="mt-2 w-32 h-32 object-cover rounded-full" />}
          </div>

          <div className="flex gap-4 pt-4">
            <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400">
              {loading ? 'Updating...' : 'Update Member'}
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