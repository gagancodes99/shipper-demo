import React from 'react';

/**
 * FeaturedServices component displays promoted services and quick booking options
 * @param {Object} props - Component props
 * @param {Function} props.onServiceClick - Callback function when a service is clicked
 * @returns {JSX.Element} Rendered featured services component
 */
const FeaturedServices = ({ onServiceClick }) => {
  // Featured services data
  const featuredServices = [
    {
      id: 'express',
      title: 'Express Delivery',
      subtitle: 'Same-day delivery',
      description: 'Need it delivered today? Our express service guarantees same-day delivery.',
      icon: '⚡',
      gradient: 'from-yellow-400 to-orange-500',
      badge: 'Popular',
      badgeColor: 'bg-red-500'
    },
    {
      id: 'bulk',
      title: 'Bulk Transport',
      subtitle: 'Large shipments',
      description: 'Moving large quantities? Get discounted rates for bulk shipments.',
      icon: '📦',
      gradient: 'from-green-400 to-blue-500',
      badge: '15% Off',
      badgeColor: 'bg-green-500'
    },
    {
      id: 'fragile',
      title: 'Fragile Handling',
      subtitle: 'Special care',
      description: 'Delicate items handled with extra care and specialized packaging.',
      icon: '🤲',
      gradient: 'from-purple-400 to-pink-500',
      badge: 'New',
      badgeColor: 'bg-purple-500'
    }
  ];

  // Quick booking options
  const quickBookingOptions = [
    {
      id: 'document',
      title: 'Document Delivery',
      subtitle: 'Fast & Secure',
      icon: '📄',
      color: 'bg-blue-500'
    },
    {
      id: 'furniture',
      title: 'Furniture Moving',
      subtitle: 'Professional Care',
      icon: '🪑',
      color: 'bg-green-500'
    },
    {
      id: 'refrigerated',
      title: 'Cold Storage',
      subtitle: 'Temperature Controlled',
      icon: '❄️',
      color: 'bg-cyan-500'
    },
    {
      id: 'interstate',
      title: 'Interstate',
      subtitle: 'Long Distance',
      icon: '🗺️',
      color: 'bg-orange-500'
    }
  ];

  const handleServiceClick = (serviceId, serviceType = 'featured') => {
    if (onServiceClick) {
      onServiceClick(serviceId, serviceType);
    }
  };

  return (
    <div className="space-y-6">
      {/* Featured Services */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Featured Services</h2>
          <div className="text-sm text-gray-500">Special offers</div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredServices.map((service) => (
            <div
              key={service.id}
              onClick={() => handleServiceClick(service.id, 'featured')}
              className={`bg-gradient-to-br ${service.gradient} rounded-xl shadow-lg p-6 text-white cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95 relative overflow-hidden`}
            >
              {/* Badge */}
              <div className={`absolute top-3 right-3 ${service.badgeColor} text-white text-xs px-2 py-1 rounded-full font-medium`}>
                {service.badge}
              </div>
              
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">{service.title}</h3>
                  <p className="text-sm opacity-90 mb-3">{service.subtitle}</p>
                </div>
                <div className="ml-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
                    {service.icon}
                  </div>
                </div>
              </div>
              
              <p className="text-sm opacity-80 mb-4 leading-relaxed">
                {service.description}
              </p>
              
              <div className="flex items-center justify-between">
                <button className="bg-white/20 hover:bg-white/30 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors">
                  Book Now
                </button>
                <svg className="w-5 h-5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Booking Options */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Quick Booking</h2>
          <div className="text-sm text-gray-500">Common services</div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickBookingOptions.map((option) => (
            <div
              key={option.id}
              onClick={() => handleServiceClick(option.id, 'quick')}
              className="bg-white rounded-xl shadow-md p-4 cursor-pointer transform transition-all duration-200 hover:shadow-lg hover:-translate-y-1 active:scale-95"
            >
              <div className="text-center">
                <div className={`w-16 h-16 mx-auto ${option.color} rounded-full flex items-center justify-center text-2xl text-white mb-3`}>
                  {option.icon}
                </div>
                <h3 className="text-sm font-semibold text-gray-800 mb-1">
                  {option.title}
                </h3>
                <p className="text-xs text-gray-600">
                  {option.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Promotional Banner */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">First-Time Customer Special</h3>
            <p className="text-sm opacity-90 mb-4">
              Get 20% off your first booking when you sign up for our newsletter. 
              Valid for new customers only.
            </p>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => handleServiceClick('newsletter', 'promo')}
                className="bg-white text-purple-600 hover:bg-gray-100 text-sm px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Claim Offer
              </button>
              <span className="text-xs opacity-75">Code: WELCOME20</span>
            </div>
          </div>
          <div className="ml-6 text-5xl">
            🎉
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedServices;