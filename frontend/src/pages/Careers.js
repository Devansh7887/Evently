import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
// DUMMY DATA
const dummyJobs = [
  {
    _id: "c1",
    jobTitle: "Senior Event Planner",
    location: "Delhi, IN",
    description: "Seeking an experienced planner...",
  },
  {
    _id: "c2",
    jobTitle: "Marketing Intern",
    location: "Remote",
    description: "Join our marketing team...",
  },
];

export default function Careers() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/careers");
        setJobs(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch careers", error);
        setLoading(false);
      }
    };
    fetchCareers();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl p-8 sm:p-12 mb-12 text-center shadow-2xl">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Join Our Team</h1>
        <p className="text-lg sm:text-xl text-gray-100 max-w-2xl mx-auto">
          Be part of something amazing. Build the future of events with us! 🚀
        </p>
      </div>

      {/* Jobs Section */}
      <div className="max-w-5xl mx-auto">
        {jobs.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 text-center">
            <div className="text-6xl mb-4">💼</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">No Open Positions</h2>
            <p className="text-gray-600">
              We don't have any openings right now, but check back soon! We're always looking for talented individuals.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                    <div className="flex-1">
                      <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                        {job.jobTitle}
                      </h2>
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="inline-flex items-center bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          {job.location}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                        {job.description}
                      </p>
                    </div>
                    <Link
                      to={`/apply/${job.slug}`}
                      className="btn-success flex-shrink-0 text-center whitespace-nowrap"
                    >
                      Apply Now →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="mt-16 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 sm:p-12 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
          Don't see a role that fits?
        </h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          We're always interested in meeting talented people. Send us your resume and let's talk about future opportunities!
        </p>
        <a
          href="mailto:careers@eventapp.com"
          className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
        >
          Get in Touch
        </a>
      </div>
    </div>
  );
}
