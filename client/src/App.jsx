import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MumbaiSkylineStreet } from './components/MumbaiSkylineStreet';
import { FareSummaryCard } from './components/FareSummaryCard';
import { ActiveRideTracker } from './components/ActiveRideTracker';
import { VipDriverModal } from './components/VipDriverModal';
import { RatingModal } from './components/RatingModal';
import { RideHistoryModal } from './components/RideHistoryModal';
import { ProfileModal } from './components/ProfileModal';
import { LoginPage } from './components/LoginPage';
import { SeatSelector } from './components/SeatSelector';
import { api } from './services/api';

export default function App() {
  const [user, setUser] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [dbStatus, setDbStatus] = useState(null);

  const [selectedRouteId, setSelectedRouteId] = useState('');
  const [selectedRouteCategory, setSelectedRouteCategory] = useState('all');
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [step, setStep] = useState('home');
  const [selectedVehicleCategory, setSelectedVehicleCategory] = useState('all');
  const [estimatedFare, setEstimatedFare] = useState(0);
  const [isBooking, setIsBooking] = useState(false);

  const [activeRide, setActiveRide] = useState(null);
  const [vipDriverPrompt, setVipDriverPrompt] = useState(null);
  const [rideToRate, setRideToRate] = useState(null);

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [historyRides, setHistoryRides] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Initial load
  useEffect(() => {
    const initializeAppData = async () => {
      try {
        const [routesRes, vehiclesRes, statusRes] = await Promise.all([
          api.getRoutes(),
          api.getVehicles(),
          api.getSystemStatus().catch(() => null)
        ]);

        setRoutes(routesRes.routes || []);
        setVehicles(vehiclesRes.vehicles || []);
        if (statusRes) setDbStatus(statusRes.database);

        // Pre-select first route and vehicle for quick preview
        if (routesRes.routes?.[0]?.items?.[0]) {
          setSelectedRouteId(routesRes.routes[0].items[0].id);
        }
        if (vehiclesRes.vehicles?.[0]?.items?.[0]) {
          setSelectedVehicleId(vehiclesRes.vehicles[0].items[0].id);
        }

        const token = localStorage.getItem('buzzaxi_token');
        if (token) {
          const profile = await api.getMe().catch(() => null);
          if (profile?.user) {
            setUser(profile.user);
          } else {
            localStorage.removeItem('buzzaxi_token');
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('App initialization error:', err);
      } finally {
        setAuthReady(true);
      }
    };

    initializeAppData();
  }, []);

  useEffect(() => {
    if (!vehicles.length) return undefined;
    const firstCategory = vehicles[0]?.category;
    const media = window.matchMedia('(max-width: 760px)');
    const syncVehicleCategory = () => {
      setSelectedVehicleCategory(current => media.matches
        ? (current === 'all' ? firstCategory : current)
        : 'all');
    };
    syncVehicleCategory();
    media.addEventListener('change', syncVehicleCategory);
    return () => media.removeEventListener('change', syncVehicleCategory);
  }, [vehicles]);

  useEffect(() => {
    if (!routes.length) return undefined;
    const firstCategory = routes[0]?.category;
    const media = window.matchMedia('(max-width: 760px)');
    const syncRouteCategory = () => {
      setSelectedRouteCategory(current => media.matches
        ? (current === 'all' ? firstCategory : current)
        : 'all');
    };
    syncRouteCategory();
    media.addEventListener('change', syncRouteCategory);
    return () => media.removeEventListener('change', syncRouteCategory);
  }, [routes]);

  // Recalculate Fare whenever route or vehicle changes
  useEffect(() => {
    if (!selectedRouteId || !selectedVehicleId) {
      setEstimatedFare(0);
      return;
    }

    const calcFare = async () => {
      try {
        const est = await api.estimateFare(selectedRouteId, selectedVehicleId);
        setEstimatedFare(est.fare);
      } catch (err) {
        console.error('Fare estimation error:', err);
      }
    };

    calcFare();
  }, [selectedRouteId, selectedVehicleId]);

  // Find active route & vehicle objects for summary
  const currentRoute = routes
    .flatMap(group => group.items)
    .find(r => r.id === selectedRouteId);

  const currentVehicle = vehicles
    .flatMap(group => group.items)
    .find(v => v.id === selectedVehicleId);

  const handleSelectVehicle = (vehicleId) => {
    setSelectedVehicleId(vehicleId);
    setSelectedSeat(null);
  };

  // Booking Flow
  const handleInitiateBooking = async () => {
    if (!user) {
      setStep('login');
      return;
    }
    if (!selectedRouteId || !selectedVehicleId || !selectedSeat) return;

    setIsBooking(true);
    try {
      const res = await api.bookRide({
        routeId: selectedRouteId,
        vehicleId: selectedVehicleId,
        seatNumber: selectedSeat,
        userName: user?.username || 'Mumbaikar Rider'
      });

      if (res.vipRequired) {
        setVipDriverPrompt(res.vipDriver);
      } else if (res.ride) {
        setActiveRide(res.ride);
      }
    } catch (err) {
      alert(`Booking error: ${err.message}`);
    } finally {
      setIsBooking(false);
    }
  };

  // VIP Driver Acceptance
  const handleAcceptVip = async () => {
    setIsBooking(true);
    try {
      const res = await api.bookRide({
        routeId: selectedRouteId,
        vehicleId: selectedVehicleId,
        seatNumber: selectedSeat,
        acceptVip: true,
        userName: user?.username || 'Mumbaikar Rider'
      });
      if (res.ride) {
        setActiveRide(res.ride);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setIsBooking(false);
      setVipDriverPrompt(null);
    }
  };

  // VIP Driver Rejection
  const handleRejectVip = async () => {
    setIsBooking(true);
    try {
      const res = await api.bookRide({
        routeId: selectedRouteId,
        vehicleId: selectedVehicleId,
        seatNumber: selectedSeat,
        rejectVip: true,
        userName: user?.username || 'Mumbaikar Rider'
      });
      if (res.ride) {
        setActiveRide(res.ride);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setIsBooking(false);
      setVipDriverPrompt(null);
    }
  };

  // Confirm Seat on Shared Shuttle
  const handleConfirmSeat = async (rideId, seatNumber) => {
    try {
      const res = await api.confirmSeat(rideId, seatNumber);
      setActiveRide(res.ride);
    } catch (err) {
      alert(`Seat error: ${err.message}`);
    }
  };

  // Status Progression
  const handleUpdateStatus = async (rideId, status) => {
    try {
      const res = await api.updateRideStatus(rideId, status);
      setActiveRide(res.ride);
      return res.ride;
    } catch (err) {
      console.error('Status update error:', err);
      throw err;
    }
  };

  // Submit Rating to MongoDB
  const handleSubmitRating = async (rideId, rating) => {
    try {
      await api.rateRide(rideId, rating);
      setRideToRate(null);
      setActiveRide(null);
      setStep('home');
      // Refresh ride history if open
      fetchHistory();
    } catch (err) {
      alert(`Rating submission error: ${err.message}`);
    }
  };

  const handleFinishRide = () => {
    setRideToRate(null);
    setActiveRide(null);
    setStep('home');
  };

  // Cancel Ride
  const handleCancelRide = async (rideId) => {
    try {
      await api.cancelRide(rideId);
      setActiveRide(null);
      setStep('home');
    } catch (err) {
      alert(`Cancellation error: ${err.message}`);
    }
  };

  // Fetch Ride History
  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await api.getMyRides(user?.username);
      setHistoryRides(res.rides || []);
    } catch (err) {
      console.error('Error loading history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleOpenHistory = () => {
    if (!user) {
      setStep('login');
      return;
    }
    setIsHistoryOpen(true);
    fetchHistory();
  };

  // Authentication Handlers
  const handleAuthSuccess = async (credentials, mode) => {
    let res;
    if (mode === 'login') {
      res = await api.login(credentials.username, credentials.password);
    } else {
      res = await api.register(credentials.username, credentials.email, credentials.password, credentials.name);
    }
    localStorage.setItem('buzzaxi_token', res.token);
    const profile = await api.getMe().catch(() => ({ user: res.user }));
    setUser(profile.user || res.user);
    setStep('home');
  };

  const handleLogout = () => {
    localStorage.removeItem('buzzaxi_token');
    setUser(null);
    setActiveRide(null);
    setIsProfileOpen(false);
    setIsHistoryOpen(false);
    setStep('login');
  };

  const handleSaveProfile = async (fields) => {
    const res = await api.updateProfile(fields);
    setUser(res.user);
  };

  if (!authReady) return <div className="auth-loading">Getting your Buzzaxi ride ready…</div>;
  if (!user && step === 'login') return <LoginPage onSubmit={handleAuthSuccess} />;

  const flowSteps = [
    { id: 'route', label: 'Route' }, { id: 'ride', label: 'Ride' },
    { id: 'seat', label: 'Seat' }, { id: 'overview', label: 'Overview' }
  ];
  const stepIndex = flowSteps.findIndex(item => item.id === step);
  const previousStep = flowSteps[Math.max(0, stepIndex - 1)]?.id || 'route';

  return (
    <div className={`app-viewport ${step !== 'home' ? 'viewport-locked' : ''} ${step === 'ride' && !activeRide ? 'ride-selection' : ''} ${step === 'route' && !activeRide ? 'route-selection' : ''}`}>
      {/* Top Navbar */}
      <Navbar 
        user={user}
        onOpenAuth={() => setStep('login')}
        onLogout={handleLogout}
        onOpenHistory={handleOpenHistory}
        onOpenProfile={() => setIsProfileOpen(true)}
        dbStatus={dbStatus}
        onHome={() => setStep('home')}
      />

      {/* Animated Mumbai Skyline & Taxi accompanies the booking flow. */}
      {step === 'route' && <MumbaiSkylineStreet />}

      {/* Main Experience: Active Ride or Booking Form */}
      {activeRide ? (
        <ActiveRideTracker 
          ride={activeRide}
          onConfirmSeat={handleConfirmSeat}
          onUpdateStatus={handleUpdateStatus}
          onCancelRide={handleCancelRide}
          onTriggerRating={(ride) => setRideToRate(ride)}
        />
      ) : (
        step === 'home' ? (
          <main className="home-page">
            <section className="home-hero">
              <div className="home-copy">
                <span className="eyebrow">YOUR CITY, IN MOTION</span>
                <h1>Good rides.<br /><em>Good company.</em></h1>
                <p>Find a seat, share the road, and make every Mumbai journey a little easier.</p>
                <button className="btn-flat btn-accent home-cta" onClick={() => setStep(user ? 'route' : 'login')}>Book a ride <span aria-hidden="true">→</span></button>
                <div className="home-trust"><span>●</span> Simple fares · Shared rides · Made for Mumbai</div>
              </div>
              <div className="home-illustration" aria-hidden="true">
                <div className="home-sun" /><div className="home-skyline skyline-back" /><div className="home-skyline skyline-front" />
                <div className="home-road"><span /><span /><span /></div>
                <div className="home-auto">🛺</div>
                <div className="home-location location-one">ANDHERI</div><div className="home-location location-two">BANDRA</div>
              </div>
            </section>
            <section className="home-highlights" aria-label="How Buzzaxi works">
              <article><span className="highlight-icon">↗</span><div><strong>Pick your route</strong><p>Choose from popular Mumbai connections.</p></div></article>
              <article><span className="highlight-icon">🚕</span><div><strong>Find your ride</strong><p>Compare vehicles and see your fare upfront.</p></div></article>
              <article><span className="highlight-icon">♧</span><div><strong>Ride together</strong><p>Choose your seat and travel comfortably.</p></div></article>
            </section>
          </main>
        ) : (
        <main className="booking-flow">
          <div className="flow-heading">
            <div><span className="eyebrow">PLAN YOUR RIDE</span><h1>{['Choose your route', 'Choose your ride', 'Choose your seat', 'Review your ride'][stepIndex]}</h1></div>
            <div className="flow-steps" aria-label="Booking progress">{flowSteps.map((item, index) => <div key={item.id} className={`flow-step ${index <= stepIndex ? 'complete' : ''}`}><span>{index + 1}</span>{item.label}</div>)}</div>
          </div>
          {step === 'route' && <section className="flat-card flow-card route-selection-card"><h2>Where are you going?</h2><p className="flow-help">Choose a Mumbai route to see rides for your trip.</p><div className="route-category-tabs" aria-label="Filter routes by area"><button type="button" className={`route-category-tab route-category-all ${selectedRouteCategory === 'all' ? 'active' : ''}`} onClick={() => setSelectedRouteCategory('all')}>All routes</button>{routes.map(group => { const name = group.category.replace(/^\S+\s*/, ''); const shortName = name.includes('Andheri') ? 'Andheri' : name.includes('Airport') ? 'Airport' : name.includes('South') ? 'South' : 'Outer'; return <button type="button" key={group.category} className={`route-category-tab ${selectedRouteCategory === group.category ? 'active' : ''}`} onClick={() => setSelectedRouteCategory(group.category)}>{shortName}</button>; })}</div><div className="route-options">{routes.filter(group => selectedRouteCategory === 'all' || group.category === selectedRouteCategory).flatMap(group => group.items.map(route => <button type="button" key={route.id} className={`route-option ${selectedRouteId === route.id ? 'selected' : ''}`} onClick={() => setSelectedRouteId(route.id)}><span className="route-icon">{route.icon || '↗'}</span><span><strong>{route.name}</strong><small>{route.distance} km · {group.category.replace(/^\S+\s*/, '')}</small></span><span className="route-arrow">→</span></button>))}</div><div className="flow-actions"><button className="btn-flat" onClick={() => setStep('home')}>← Home</button><span>{currentRoute?.name || 'Select a route to continue'}</span><button className="btn-flat btn-primary" disabled={!selectedRouteId} onClick={() => setStep('ride')}>Choose a ride →</button></div></section>}
          {step === 'ride' && <section className="flat-card flow-card ride-selection-card"><h2>Pick the ride that suits you</h2><p className="flow-help">Fare is based on your route distance and the vehicle price per kilometre.</p><div className="vehicle-category-tabs" aria-label="Filter vehicles by type"><button type="button" className={`vehicle-category-tab vehicle-category-all ${selectedVehicleCategory === 'all' ? 'active' : ''}`} onClick={() => setSelectedVehicleCategory('all')}>All rides</button>{vehicles.map(group => { const name = group.category.replace(/^\S+\s*/, ''); const shortName = name.includes('Auto') ? 'Auto' : name.includes('Economy') ? 'Economy' : name.includes('SUV') ? 'SUV' : name.includes('Luxury') ? 'Luxury' : name; return <button type="button" key={group.category} className={`vehicle-category-tab ${selectedVehicleCategory === group.category ? 'active' : ''}`} onClick={() => setSelectedVehicleCategory(group.category)}>{shortName}</button>; })}</div><div className="vehicles-grid flow-vehicles">{vehicles.filter(group => selectedVehicleCategory === 'all' || group.category === selectedVehicleCategory).flatMap(group => group.items.map(vehicle => <button type="button" key={vehicle.id} className={`vehicle-card ${selectedVehicleId === vehicle.id ? 'selected' : ''}`} onClick={() => handleSelectVehicle(vehicle.id)}><span className="vehicle-emoji">{vehicle.icon || '🚘'}</span><span className="vehicle-card-name">{vehicle.name}</span><span className="vehicle-card-meta">{vehicle.passengerCapacity} seats <b>₹{vehicle.pricePerKm}/km</b></span></button>))}</div><div className="flow-actions"><button className="btn-flat" onClick={() => setStep('route')}>← Back</button><button className="btn-flat btn-primary" disabled={!selectedVehicleId} onClick={() => setStep('seat')}>Choose a seat →</button></div></section>}
          {step === 'seat' && <section className="flat-card flow-card seat-flow-card"><h2>Select your seat</h2><p className="flow-help">Choose an open seat in your {currentVehicle?.name || 'vehicle'}.</p>{currentVehicle && <SeatSelector capacity={currentVehicle.passengerCapacity} selectedSeat={selectedSeat} onSelect={setSelectedSeat} />}<div className="flow-actions"><button className="btn-flat" onClick={() => setStep('ride')}>← Back</button><button className="btn-flat btn-primary" disabled={!selectedSeat} onClick={() => setStep('overview')}>Review ride →</button></div></section>}
          {step === 'overview' && <section className="flat-card flow-card overview-card"><h2>Your ride overview</h2><p className="flow-help">Check your trip details before continuing.</p><div className="overview-route"><span className="route-icon">{currentRoute?.icon || '↗'}</span><div><small>YOUR ROUTE</small><strong>{currentRoute?.name}</strong><span>{currentRoute?.distance} km</span></div></div><div className="overview-details"><div><small>VEHICLE</small><strong>{currentVehicle?.name}</strong></div><div><small>SEAT</small><strong>Seat {selectedSeat}</strong></div><div><small>FARE</small><strong>{estimatedFare ? `₹${estimatedFare}` : 'Calculating…'}</strong></div></div><FareSummaryCard selectedRoute={currentRoute} selectedVehicle={currentVehicle} selectedSeat={selectedSeat} fare={estimatedFare} loading={isBooking} onBookRide={handleInitiateBooking} /><div className="flow-actions"><button className="btn-flat" onClick={() => setStep(previousStep)}>← Change seat</button></div></section>}
        </main>
        )
      )}

      {/* Modals */}
      <VipDriverModal 
        vipDriver={vipDriverPrompt}
        onAccept={handleAcceptVip}
        onReject={handleRejectVip}
      />

      <RatingModal 
        ride={rideToRate}
        onSubmitRating={handleSubmitRating}
        onClose={handleFinishRide}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        user={user}
        onClose={() => setIsProfileOpen(false)}
        onSave={handleSaveProfile}
      />

      <RideHistoryModal 
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        rides={historyRides}
        loading={loadingHistory}
      />
    </div>
  );
}
