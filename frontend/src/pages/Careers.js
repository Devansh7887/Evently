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
  const [jobs, setJobs] = useState([]); // Dummy data hata diya
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
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">Join Our Team</h1>
      <div className="space-y-6">
        {jobs.length === 0 ? (
          <p className="text-center text-gray-500">
            No open positions at the moment. Please check back later!
          </p>
        ) : (
          jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white p-6 rounded-lg shadow-lg flex justify-between items-center"
            >
              <div>
                <h2 className="text-2xl font-semibold text-blue-600">
                  {job.jobTitle}
                </h2>
                <p className="text-gray-500 mb-2">{job.location}</p>
                <p className="text-gray-700">{job.description}</p>
              </div>
              <Link
                to={`/apply/${job.slug}`}
                className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md
               transform transition-all duration-300
               hover:bg-green-600 hover:shadow-lg hover:-translate-y-0.5"
              >
                Apply Now
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
