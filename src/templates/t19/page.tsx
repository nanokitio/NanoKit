'use client'

import React, { useState, useEffect } from 'react'
import { BrandConfig } from '@/lib/types'
import { InlineEditableText } from '@/components/InlineEditableText'

interface Template19Props {
  brand: BrandConfig
}

export function Template19({ brand }: Template19Props) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  // Editable text states
  const [headline, setHeadline] = useState(brand.copy.headline || 'Global Fridays Glow Up 4.20');
  const [subheadline, setSubheadline] = useState(brand.copy.subheadline || '26 SEPTEMBER 2021');
  const [ctaText, setCtaText] = useState(brand.copy.cta || 'GET TICKETS');
  const [eventDescription, setEventDescription] = useState(
    brand.description || 'Join us for an unforgettable night of music and entertainment. Experience the ultimate nightlife extravaganza with world-class DJs and stunning visual effects.'
  );
  
  // Custom styles from editor
  const [fieldStyles, setFieldStyles] = useState<Record<string, any>>({});

  // Check if in edit mode
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const inIframe = window.self !== window.top;
    const editParam = params.get('edit') === '1' || params.get('preview') === '1';
    setIsEditMode(inIframe && editParam);
  }, []);

  // Listen for APPLY_STYLES from parent editor
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'APPLY_STYLES' && event.data.customStyles) {
        console.log('Applying saved styles:', event.data.customStyles);
        setFieldStyles(event.data.customStyles);
        
        // Apply saved text values
        Object.entries(event.data.customStyles).forEach(([field, data]: [string, any]) => {
          if (data?.value) {
            switch (field) {
              case 'headline': setHeadline(data.value); break;
              case 'subheadline': setSubheadline(data.value); break;
              case 'cta': setCtaText(data.value); break;
              case 'eventDescription': setEventDescription(data.value); break;
            }
          }
        });
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Send changes to parent editor
  const notifyChange = (field: string, value: string) => {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({
        type: 'CONTENT_CHANGE',
        field,
        value
      }, '*');
    }
  };

  // Countdown timer effect
  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30); // 30 days from now as default
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;
      
      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const videoBackground = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
  const backgroundImage = brand.backgroundImage || '/api/placeholder/1920/1080';
  const backgroundColor = brand.backgroundColor || '#0f0f23';

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* Hero Section with Video Background */}
      <section className="relative h-screen flex items-center justify-center">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 via-blue-900/50 to-pink-900/50 z-10"></div>
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            poster={backgroundImage}
          >
            <source src={videoBackground} type="video/mp4" />
          </video>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <div className="mb-8">
            <InlineEditableText
              value={headline}
              onChange={(value) => {
                setHeadline(value);
                notifyChange('headline', value);
              }}
              className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent animate-pulse"
              style={fieldStyles.headline?.style}
              fieldName="headline"
            />
            <InlineEditableText
              value={subheadline}
              onChange={(value) => {
                setSubheadline(value);
                notifyChange('subheadline', value);
              }}
              className="text-2xl md:text-3xl mb-6 text-gray-200 font-light"
              style={fieldStyles.subheadline?.style}
              fieldName="subheadline"
            />
          </div>

          <InlineEditableText
            value={eventDescription}
            onChange={(value) => {
              setEventDescription(value);
              notifyChange('eventDescription', value);
            }}
            className="text-lg md:text-xl mb-8 text-gray-300 max-w-2xl mx-auto"
            style={fieldStyles.eventDescription?.style}
            fieldName="eventDescription"
          />

          <a
            href={brand.copy.ctaUrl || '#'}
            className="inline-block px-12 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-lg rounded-full transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 backdrop-blur-sm border border-white/20"
            style={fieldStyles.cta?.style}
          >
            {ctaText}
          </a>
        </div>

        {/* Countdown Timer */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex space-x-4 md:space-x-8">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div key={unit} className="text-center">
                <div className="bg-black/50 backdrop-blur-md border border-white/20 rounded-lg px-4 py-2 md:px-6 md:py-3">
                  <div className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    {value.toString().padStart(2, '0')}
                  </div>
                  <div className="text-xs md:text-sm uppercase text-gray-400 mt-1">
                    {unit}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Upcoming Events
            </h2>
            <p className="text-gray-400 text-lg">Don't miss out on the hottest parties in town</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Electronic Dreams', date: 'OCT 15', price: '$45', image: '/api/placeholder/400/300' },
              { title: 'Techno Nights', date: 'OCT 22', price: '$55', image: '/api/placeholder/400/300' },
              { title: 'House Paradise', date: 'NOV 5', price: '$65', image: '/api/placeholder/400/300' }
            ].map((event, index) => (
              <div key={index} className="group relative overflow-hidden rounded-xl bg-gray-800/50 backdrop-blur-sm border border-white/10 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                      {event.title}
                    </h3>
                    <span className="text-purple-400 font-bold">{event.price}</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">{event.date}</p>
                  <button className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30">
                    Get Tickets
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Ready to Experience the Night?
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            Join thousands of party enthusiasts at the most electrifying events
          </p>
          <a
            href={brand.copy.ctaUrl || '#'}
            className="inline-block px-10 py-3 bg-white text-purple-900 font-bold text-lg rounded-full transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            {ctaText}
          </a>
        </div>
      </section>
    </div>
  );
}
