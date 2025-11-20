import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../components/Loader";
// Later, we will use: import axios from 'axios'; and useState/useEffect

// DUMMY DATA
const dummyTeam = [
  {
    _id: "1",
    name: "Alex Johnson",
    role: "Founder & CEO",
    imageUrl: "https://via.placeholder.com/300",
  },
  {
    _id: "2",
    name: "Maria Garcia",
    role: "Lead Planner",
    imageUrl: "https://via.placeholder.com/300",
  },
  {
    _id: "3",
    name: "Kenji Tanaka",
    role: "Creative Director",
    imageUrl: "https://via.placeholder.com/300",
  },
];

export default function OurTeam() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/team");
        setTeam(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch team", error);
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Meet Our Team
        </h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          The amazing people behind EventApp. Passionate, talented, and dedicated to creating unforgettable experiences! 🌟
        </p>
      </div>

      {/* Team Grid */}
      {team.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">👥</div>
          <p className="text-xl text-gray-600">No team members listed yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {team.map((member) => (
            <div
              key={member._id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group"
            >
              {/* Image Container */}
              <div className="relative overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 p-6">
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full mx-auto object-cover border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-300"
                />
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200 rounded-full opacity-50 -mr-10 -mt-10"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-pink-200 rounded-full opacity-50 -ml-8 -mb-8"></div>
              </div>
              
              {/* Info Container */}
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                  {member.name}
                </h2>
                <p className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                  {member.role}
                </p>
                {member.linkedinId && (
                  <a
                    href={member.linkedinId}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                  >
                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
