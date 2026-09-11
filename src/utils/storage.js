import { INITIAL_STATIONS } from '../data/mockStations';

const BOOKINGS_KEY = 'greenflow_cng_bookings';
const STATIONS_KEY = 'greenflow_cng_stations';
const FAVORITES_KEY = 'greenflow_cng_favorites';

export const getStoredStations = () => {
  const data = localStorage.getItem(STATIONS_KEY);
  if (!data) {
    localStorage.setItem(STATIONS_KEY, JSON.stringify(INITIAL_STATIONS));
    return INITIAL_STATIONS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_STATIONS;
  }
};

export const saveStations = (stations) => {
  localStorage.setItem(STATIONS_KEY, JSON.stringify(stations));
};

export const getStoredBookings = () => {
  const data = localStorage.getItem(BOOKINGS_KEY);
  if (!data) {
    // Generate 1 realistic active demo token for instant wow factor
    const initialBooking = [
      {
        id: 'GF-BDW-8942',
        stationId: 'st-101',
        stationName: 'Mahanagar Gas Mega Station - Bandra West',
        stationAddress: 'Plot 42, SV Road, Near Bandra Flyover, Mumbai',
        city: 'Mumbai',
        driverName: 'Rahul Sharma',
        phone: '+91 98201 44321',
        vehicleType: 'Car',
        vehicleNo: 'MH-02-CB-4890',
        refillQty: '10 kg (Full Tank)',
        bookingType: 'Express Queue',
        slotTime: 'Instant Express',
        bookingDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        tokenNo: 'GF-BDW-108',
        positionInQueue: 3,
        estWaitMinutes: 7,
        assignedNozzle: 'Dispenser No. 3',
        status: 'Active', // Active, In Progress, Completed, Cancelled
        qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=GF-BDW-8942-MH02CB4890'
      }
    ];
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(initialBooking));
    return initialBooking;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
};

export const saveBooking = (newBooking) => {
  const current = getStoredBookings();
  const updated = [newBooking, ...current];
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated));
  
  // Also increment station queue count
  const stations = getStoredStations();
  const targetStation = stations.find(s => s.id === newBooking.stationId);
  if (targetStation) {
    targetStation.queueCount = (targetStation.queueCount || 0) + 1;
    targetStation.avgWaitMins = Math.round(targetStation.queueCount * 2.2);
    saveStations(stations);
  }
  return updated;
};

export const updateBookingStatus = (bookingId, newStatus) => {
  const current = getStoredBookings();
  const updated = current.map(b => b.id === bookingId ? { ...b, status: newStatus } : b);
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated));
  return updated;
};

export const getFavorites = () => {
  const data = localStorage.getItem(FAVORITES_KEY);
  return data ? JSON.parse(data) : ['st-101'];
};

export const toggleFavorite = (stationId) => {
  const favs = getFavorites();
  const updated = favs.includes(stationId)
    ? favs.filter(id => id !== stationId)
    : [...favs, stationId];
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return updated;
};
