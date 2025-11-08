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
  const [team, setTeam] = useState([]); // Dummy data hata diya
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
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">Meet Our Team</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {team.map((member) => (
          <div
            key={member._id}
            className="bg-white rounded-lg shadow-lg text-center p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <img
              src={member.imageUrl}
              alt={member.name}
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
            />
            <h2 className="text-2xl font-semibold mb-1">{member.name}</h2>
            <p className="text-blue-500 font-medium">{member.role}</p>
            {member.linkedinId && (
              <a
                href={member.linkedinId}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                View LinkedIn
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
