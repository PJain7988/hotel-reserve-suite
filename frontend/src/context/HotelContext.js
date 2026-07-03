import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authAPI, roomsAPI, bookingsAPI } from '../utils/api';
import toast from 'react-hot-toast';

const HotelContext = createContext();

export const HotelProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastBooked, setLastBooked] = useState([]);
  const [stats, setStats] = useState({ available: 97, occupied: 0, totalBookings: 0 });

  // User management state
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('hotel_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Tab navigation state
  const [activeTab, setActiveTab] = useState('operations');

  // Booking option state modifiers
  const [holidayMod, setHolidayMod] = useState(false);
  const [preferredFeatures, setPreferredFeatures] = useState([]);

  const computeStats = useCallback((roomList, bookingList) => {
    const available = roomList.filter(r => r.status === 'Available').length;
    const occupied = roomList.filter(r => r.status === 'Occupied' || r.status === 'Reserved').length;
    setStats({ available, occupied, totalBookings: bookingList.length });
  }, []);

  const fetchRooms = useCallback(async () => {
    try {
      const { data } = await roomsAPI.getAll();
      setRooms(data.rooms);
      return data.rooms;
    } catch (err) {
      toast.error('Failed to load rooms');
      return [];
    }
  }, []);

  const fetchBookings = useCallback(async () => {
    try {
      const { data } = await bookingsAPI.getAll();
      setBookings(data.bookings);
      return data.bookings;
    } catch (err) {
      toast.error('Failed to load bookings');
      return [];
    }
  }, []);

  const fetchPayments = useCallback(async () => {
    try {
      const { data } = await bookingsAPI.getPayments();
      setPayments(data.payments);
    } catch (err) {
      console.error('Failed to load payments', err);
    }
  }, []);

  const fetchReviews = useCallback(async () => {
    try {
      const { data } = await bookingsAPI.getReviews();
      setReviews(data.reviews);
    } catch (err) {
      console.error('Failed to load reviews', err);
    }
  }, []);

  const fetchAnalytics = useCallback(async () => {
    try {
      const { data } = await bookingsAPI.getAnalytics();
      setAnalytics(data.analytics);
    } catch (err) {
      console.error('Failed to load analytics', err);
    }
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [roomsData, bookingsData] = await Promise.all([
        roomsAPI.getAll(),
        bookingsAPI.getAll()
      ]);
      setRooms(roomsData.data.rooms);
      setBookings(bookingsData.data.bookings);
      computeStats(roomsData.data.rooms, bookingsData.data.bookings);
      
      // Secondary fetches in background
      fetchPayments();
      fetchReviews();
      fetchAnalytics();
    } finally {
      setLoading(false);
    }
  }, [computeStats, fetchPayments, fetchReviews, fetchAnalytics]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Auth Operations
  const registerCustomer = async (name, email, password, phone) => {
    setLoading(true);
    try {
      const { data } = await authAPI.register({ name, email, password, phone });
      toast.success(data.message || 'Registered successfully!');
      setUser(data.user);
      localStorage.setItem('hotel_user', JSON.stringify(data.user));
      return data.user;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const loginCustomer = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await authAPI.login({ email, password });
      toast.success(data.message || 'Welcome back!');
      setUser(data.user);
      localStorage.setItem('hotel_user', JSON.stringify(data.user));
      return data.user;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email, newPassword) => {
    setLoading(true);
    try {
      const { data } = await authAPI.resetPassword({ email, newPassword });
      toast.success(data.message || 'Password reset completed');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password reset failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hotel_user');
    toast.success('Logged out successfully');
  };

  // Booking operation wrapper supporting features, holiday dynamic mods, and logged email session
  const bookRooms = useCallback(async (numberOfRooms, guestName, specialRequests, roomTier = 'Any', acPreference = 'Any') => {
    setLoading(true);
    try {
      const { data } = await bookingsAPI.book({
        numberOfRooms,
        guestName,
        userEmail: user ? user.email : '',
        isHoliday: holidayMod,
        preferredFeatures,
        specialRequests,
        roomTier,
        acPreference
      });
      setLastBooked(data.roomNumbers || []);
      toast.success(`Booked ${numberOfRooms} room(s)! Total: $${data.totalAmount}`);
      await fetchAll();
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchAll, user, holidayMod, preferredFeatures]);

  const cancelBooking = useCallback(async (id) => {
    setLoading(true);
    try {
      await bookingsAPI.cancel(id);
      toast.success('Booking cancelled and fully refunded');
      setLastBooked([]);
      await fetchAll();
    } catch (err) {
      toast.error('Failed to cancel booking');
    } finally {
      setLoading(false);
    }
  }, [fetchAll]);

  const payBooking = async (bookingId, amount, paymentMethod) => {
    setLoading(true);
    try {
      const { data } = await bookingsAPI.pay({ bookingId, amount, paymentMethod });
      toast.success(`Simulated payment of $${amount} via ${paymentMethod} approved!`);
      await fetchAll();
      return data.payment;
    } catch (err) {
      toast.error('Payment processing failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async (guestName, roomNumber, rating, comment) => {
    setLoading(true);
    try {
      const { data } = await bookingsAPI.createReview({ guestName, roomNumber, rating, comment });
      toast.success(`Review saved! Detected sentiment: ${data.review.sentiment}`);
      await fetchAll();
      return data.review;
    } catch (err) {
      toast.error('Review submission failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Admin Room Builder wrappers
  const addAdminRoom = async (roomNumber, floor, position, roomType, price, features) => {
    setLoading(true);
    try {
      const { data } = await roomsAPI.create({ roomNumber, floor, position, roomType, price, features });
      toast.success(`Room ${roomNumber} added to floor ${floor}`);
      await fetchAll();
      return data.room;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add room');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateAdminRoom = async (roomNumber, updateData) => {
    setLoading(true);
    try {
      const { data } = await roomsAPI.update(roomNumber, updateData);
      toast.success(`Room ${roomNumber} status successfully updated!`);
      await fetchAll();
      return data.room;
    } catch (err) {
      toast.error('Failed to update room');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteAdminRoom = async (roomNumber) => {
    setLoading(true);
    try {
      await roomsAPI.delete(roomNumber);
      toast.success(`Room ${roomNumber} permanently deleted`);
      await fetchAll();
    } catch (err) {
      toast.error('Failed to delete room');
    } finally {
      setLoading(false);
    }
  };

  const randomOccupancy = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await roomsAPI.randomOccupancy();
      toast.success(data.message);
      setLastBooked([]);
      await fetchAll();
    } catch (err) {
      toast.error('Failed to set random occupancy');
    } finally {
      setLoading(false);
    }
  }, [fetchAll]);

  const resetAll = useCallback(async () => {
    setLoading(true);
    try {
      await roomsAPI.reset();
      toast.success('All bookings and mock systems cleared');
      setLastBooked([]);
      await fetchAll();
    } catch (err) {
      toast.error('Failed to reset');
    } finally {
      setLoading(false);
    }
  }, [fetchAll]);

  return (
    <HotelContext.Provider value={{
      rooms, bookings, payments, reviews, analytics, loading, lastBooked, stats,
      user, activeTab, holidayMod, preferredFeatures,
      setUser, setActiveTab, setHolidayMod, setPreferredFeatures,
      fetchAll, fetchRooms, fetchBookings, fetchPayments, fetchReviews, fetchAnalytics,
      registerCustomer, loginCustomer, resetPassword, logout,
      bookRooms, cancelBooking, payBooking, submitReview,
      addAdminRoom, updateAdminRoom, deleteAdminRoom,
      randomOccupancy, resetAll
    }}>
      {children}
    </HotelContext.Provider>
  );
};

export const useHotel = () => {
  const ctx = useContext(HotelContext);
  if (!ctx) throw new Error('useHotel must be used inside HotelProvider');
  return ctx;
};
