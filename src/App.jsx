import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StationFinder from './components/StationFinder';
import BookingModal from './components/BookingModal';
import TokenPassModal from './components/TokenPassModal';
import LiveQueueTracker from './components/LiveQueueTracker';
import OperatorDashboard from './components/OperatorDashboard';
import SavingsCalculator from './components/SavingsCalculator';
import Footer from './components/Footer';

import { 
  getStoredStations, 
  saveStations, 
  getStoredBookings, 
  saveBooking, 
  updateBookingStatus, 
  getFavorites, 
  toggleFavorite 
} from './utils/storage';

export default function App() {
  const [stations, setStations] = useState(getStoredStations);
  const [bookings, setBookings] = useState(getStoredBookings);
  const [favorites, setFavorites] = useState(getFavorites);
  
  const [selectedCity, setSelectedCity] = useState('Mumbai');
  const [currentTab, setCurrentTab] = useState('stations'); // 'stations' | 'liveQueue' | 'calculator' | 'operator'
  
  const [bookingModalStation, setBookingModalStation] = useState(null);
  const [activePassModal, setActivePassModal] = useState(null);

  // Active bookings count for badge notification
  const activeBookingsCount = bookings.filter(b => b.status === 'Active' || b.status === 'In Progress').length;

  // Handle station booking submit
  const handleBookingSubmit = (newBooking) => {
    const updatedBookings = saveBooking(newBooking);
    setBookings(updatedBookings);
    setStations(getStoredStations()); // Refresh stations queue count
    setBookingModalStation(null);
    setActivePassModal(newBooking);
  };

  // Handle update status of booking
  const handleUpdateBookingStatus = (id, newStatus) => {
    const updated = updateBookingStatus(id, newStatus);
    setBookings(updated);
  };

  // Handle station telemetry updates from Operator Dashboard
  const handleUpdateStation = (updatedStation) => {
    const updatedList = stations.map(s => s.id === updatedStation.id ? updatedStation : s);
    setStations(updatedList);
    saveStations(updatedList);
  };

  // Handle favorite toggle
  const handleToggleFavorite = (stationId) => {
    const updated = toggleFavorite(stationId);
    setFavorites(updated);
  };

  return (
    <div className="app-container">
      {/* Navigation Header */}
      <Navbar 
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        activeBookingsCount={activeBookingsCount}
      />

      {/* Main View Area */}
      <main className="main-content">
        {currentTab === 'stations' && (
          <StationFinder 
            stations={stations}
            selectedCity={selectedCity}
            onBookStation={(st) => setBookingModalStation(st)}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {currentTab === 'liveQueue' && (
          <LiveQueueTracker 
            bookings={bookings}
            onUpdateBookingStatus={handleUpdateBookingStatus}
            stations={stations}
          />
        )}

        {currentTab === 'calculator' && (
          <SavingsCalculator />
        )}

        {currentTab === 'operator' && (
          <OperatorDashboard 
            stations={stations}
            onUpdateStation={handleUpdateStation}
            bookings={bookings}
            onUpdateBookingStatus={handleUpdateBookingStatus}
          />
        )}
      </main>

      {/* Modals */}
      {bookingModalStation && (
        <BookingModal 
          station={bookingModalStation}
          onClose={() => setBookingModalStation(null)}
          onSubmitBooking={handleBookingSubmit}
        />
      )}

      {activePassModal && (
        <TokenPassModal 
          booking={activePassModal}
          onClose={() => setActivePassModal(null)}
          onGoToTracker={() => {
            setActivePassModal(null);
            setCurrentTab('liveQueue');
          }}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
