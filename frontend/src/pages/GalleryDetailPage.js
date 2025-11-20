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
  if (!event) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🖼️</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Gallery Not Found</h1>
        <Link to="/gallery" className="text-purple-600 hover:text-purple-800 font-semibold">
          ← Back to Gallery
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link
          to="/gallery"
          className="inline-flex items-center text-purple-600 hover:text-purple-800 font-semibold mb-6 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Gallery
        </Link>

        {/* Title & Description */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {event.title}
          </h1>
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed">{event.description}</p>
        </div>

        {/* Swiper Carousel */}
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-4 sm:p-6 rounded-2xl shadow-2xl">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={30}
            centeredSlides={true}
            loop={true}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            navigation={true}
            className="w-full h-[50vh] sm:h-[60vh] lg:h-[70vh] rounded-xl shadow-2xl bg-gray-900 overflow-hidden"
          >
            {/* Thumbnail as first slide */}
            <SwiperSlide>
              <div className="relative w-full h-full">
                <img
                  src={event.thumbnailImageUrl}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-white bg-opacity-90 px-4 py-2 rounded-full shadow-lg">
                  <span className="text-sm font-bold text-purple-600">Cover Photo</span>
                </div>
              </div>
            </SwiperSlide>

            {/* Gallery images */}
            {event.galleryImages.map((image, index) => (
              <SwiperSlide key={index}>
                <div className="relative w-full h-full">
                  <img
                    src={image.imageUrl}
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 px-3 py-1 rounded-full">
                    <span className="text-xs text-white font-semibold">
                      {index + 1} / {event.galleryImages.length}
                    </span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800 flex items-center">
            <span className="text-3xl mr-3">📸</span>
            Event Highlights
          </h2>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            This gallery showcases the best moments from our {event.title} event. 
            Swipe through the images to relive the experience and see what made this event special!
          </p>
        </div>
      </div>
    </div>
  );
}