import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';

// --- NAYE IMPORTS ---
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
// --- END IMPORTS ---

export default function GalleryDetailPage() {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/gallery/${slug}`);
        setEvent(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [slug]);

  if (loading) return <Loader />;
  if (!event) return <div className="text-center p-10">Gallery event not found.</div>;

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <Link to="/gallery" className="text-blue-500 mb-4 inline-block">&larr; Back to Gallery</Link>
      
      {/* Event Title aur Description waise hi rahenge */}
      <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
      <p className="text-lg text-gray-700 mb-8">{event.description}</p>
      
      {/* Thumbnail ko bhi hum carousel mein hi daal denge */}

      {/* --- YAHAN BADA BADLAAV HAI --- */}
      {/* Purana grid hata kar naya Swiper component */}
      <Swiper
        modules={[Autoplay, Pagination, Navigation]} // Zaroori modules
        spaceBetween={30}
        centeredSlides={true}
        loop={true}
        autoplay={{
          delay: 3000, // Har 3 second mein auto-scroll
          disableOnInteraction: false, // Manual scroll ke baad bhi chalu rahe
        }}
        pagination={{
          clickable: true, // Yeh aapke "dots" hain
        }}
        navigation={true} // Yeh "manual change" (Next/Prev) arrows hain
        className="w-full h-[60vh] rounded-lg shadow-2xl bg-gray-800"
      >
        {/* Pehli slide thumbnail ko banate hain */}
        <SwiperSlide>
          <img
            src={event.thumbnailImageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </SwiperSlide>

        {/* Baaki ki gallery images */}
        {event.galleryImages.map((image, index) => (
          <SwiperSlide key={index}>
            <img 
              src={image.imageUrl} 
              alt={`Gallery image ${index + 1}`}
              className="w-full h-full object-cover" 
            />
          </SwiperSlide>
        ))}
      </Swiper>
      {/* --- END SWIPER --- */}
    </div>
  );
}