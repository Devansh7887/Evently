import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ApplyPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { jobId } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume) {
      setMessage('Please upload your resume.');
      return;
    }
    setLoading(true);
    setMessage('');
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('resume', resume); // Use 'image' field for resume

    try {
      await axios.post(`/api/careers/apply/${jobId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setLoading(false);
      setMessage('Application submitted successfully! We will get back to you.');
      setTimeout(() => navigate('/careers'), 3000); // Go back after 3s
    } catch (error) {
      setLoading(false);
      setMessage(error.response?.data?.message || 'Submission failed.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">📝</div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Job Application
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">Fill in your details to apply for this position</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          {message && (
            <div className={`p-4 rounded-xl mb-6 ${message.includes('success') ? 'bg-green-100 border border-green-300 text-green-800' : 'bg-red-100 border border-red-300 text-red-800'}`}>
              <div className="flex items-center">
                <span className="text-2xl mr-3">{message.includes('success') ? '✅' : '⚠️'}</span>
                <p className="text-sm sm:text-base font-semibold">{message}</p>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload Resume <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResume(e.target.files[0])}
                  className="block w-full text-sm text-gray-600
                    file:mr-4 file:py-3 file:px-6
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-gradient-to-r file:from-blue-500 file:to-purple-600
                    file:text-white file:cursor-pointer
                    hover:file:from-blue-600 hover:file:to-purple-700
                    file:transition-all file:duration-300"
                  required
                />
                <p className="text-xs text-gray-500 mt-2">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                '📤 Submit Application'
              )}
            </button>
          </form>
        </div>

        {/* Back to Careers */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/careers')}
            className="text-purple-600 hover:text-purple-800 font-semibold text-sm sm:text-base transition-colors"
          >
            ← Back to Careers
          </button>
        </div>
      </div>
    </div>
  );
}