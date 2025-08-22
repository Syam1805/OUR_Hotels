import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import { Icon, DivIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom hotel icon
const hotelIcon = new Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2776/2776067.png',
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

// Cluster icon for multiple hotels
const clusterIcon = (count) => new DivIcon({
  html: `<div class="cluster-icon">${count}</div>`,
  className: 'custom-cluster-icon',
  iconSize: [40, 40],
});

function MapComponent({ hotels }) {
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]);
  const [mapZoom, setMapZoom] = useState(13);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [filteredHotels, setFilteredHotels] = useState(hotels);
  const [searchTerm, setSearchTerm] = useState('');

  // Set initial map view to show all hotels
  useEffect(() => {
    if (hotels.length > 0) {
      const avgLat = hotels.reduce((sum, hotel) => sum + hotel.coords[0], 0) / hotels.length;
      const avgLng = hotels.reduce((sum, hotel) => sum + hotel.coords[1], 0) / hotels.length;
      setMapCenter([avgLat, avgLng]);
      
      // Calculate appropriate zoom level based on hotel distribution
      const maxDistance = Math.max(...hotels.map(hotel => 
        Math.sqrt(Math.pow(hotel.coords[0] - avgLat, 2) + Math.pow(hotel.coords[1] - avgLng, 2))
      ));
      
      const newZoom = maxDistance > 0.5 ? 11 : maxDistance > 0.2 ? 12 : 13;
      setMapZoom(newZoom);
    }
  }, [hotels]);

  // Filter hotels based on search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredHotels(hotels);
      return;
    }
    
    const filtered = hotels.filter(hotel => 
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (hotel.description && hotel.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredHotels(filtered);
    
    // Adjust map view if results exist
    if (filtered.length > 0) {
      const avgLat = filtered.reduce((sum, hotel) => sum + hotel.coords[0], 0) / filtered.length;
      const avgLng = filtered.reduce((sum, hotel) => sum + hotel.coords[1], 0) / filtered.length;
      setMapCenter([avgLat, avgLng]);
    }
  }, [searchTerm, hotels]);

  // Handle hotel selection
  const handleHotelSelect = (hotel) => {
    setSelectedHotel(hotel);
    setMapCenter(hotel.coords);
    setMapZoom(15);
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-50 rounded-xl shadow-lg">
      {/* Custom styles for Leaflet components */}
      <style jsx>{`
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 0.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .custom-popup .leaflet-popup-content {
          margin: 0;
          min-width: 250px;
        }
        .custom-popup .leaflet-popup-close-button {
          display: none;
        }
        .custom-cluster-icon {
          background: #4a6fdc;
          color: white;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: bold;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }
        .cluster-icon {
          font-size: 16px;
        }
      `}</style>
      
      {/* Map Controls */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Search Bar */}
        <div className="flex-1 min-w-[250px]">
          <div className="flex bg-white rounded-lg overflow-hidden shadow-md">
            <input
              type="text"
              placeholder="Search hotels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-3 focus:outline-none"
            />
            <button className="bg-blue-500 text-white px-5 hover:bg-blue-600 transition-colors">
              🔍
            </button>
          </div>
        </div>
        
        {/* Hotel List */}
        <div className="md:w-1/3 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-blue-500 text-white font-semibold">
            Hotels ({filteredHotels.length})
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filteredHotels.slice(0, 5).map(hotel => (
              <div 
                key={hotel.id} 
                className={`flex p-4 border-b border-gray-200 cursor-pointer transition-colors ${selectedHotel?.id === hotel.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                onClick={() => handleHotelSelect(hotel)}
              >
                <div className="text-2xl mr-3">🏨</div>
                <div>
                  <h3 className="font-semibold text-gray-800">{hotel.name}</h3>
                  <p className="text-sm text-gray-600 truncate max-w-xs">
                    {hotel.description ? `${hotel.description.substring(0, 50)}...` : 'No description available'}
                  </p>
                </div>
              </div>
            ))}
            {filteredHotels.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                No hotels found matching your search
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Map Container */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <MapContainer 
          center={mapCenter} 
          zoom={mapZoom} 
          style={{ height: '500px', width: '100%' }}
          zoomControl={false}
          className="rounded-xl"
        >
          <ZoomControl position="topright" />
          
          {/* Tile Layer */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* Hotel Markers */}
          {filteredHotels.map((hotel) => (
            <Marker 
              key={hotel.id} 
              position={hotel.coords} 
              icon={hotelIcon}
              eventHandlers={{
                click: () => handleHotelSelect(hotel),
              }}
            >
              <Popup className="custom-popup">
                <div className="p-3">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">{hotel.name}</h2>
                  {hotel.image && (
                    <img 
                      src={hotel.image} 
                      alt={hotel.name} 
                      className="w-full h-40 object-cover rounded-lg mb-3"
                    />
                  )}
                  <p className="text-gray-600 mb-4">
                    {hotel.description || 'No description available'}
                  </p>
                  
                  <div className="flex justify-between items-center mb-4">
                    {hotel.rating && (
                      <div className="flex items-center">
                        <div className="text-yellow-400">
                          {'★'.repeat(Math.floor(hotel.rating))}{'☆'.repeat(5 - Math.floor(hotel.rating))}
                        </div>
                        <span className="ml-1 text-gray-600">{hotel.rating}/5</span>
                      </div>
                    )}
                    {hotel.price && (
                      <div className="text-lg font-bold text-blue-600">
                        ${hotel.price}
                      </div>
                    )}
                  </div>
                  
                  <button 
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors"
                    onClick={() => alert(`Booking ${hotel.name}...`)}
                  >
                    Book Now
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default MapComponent;