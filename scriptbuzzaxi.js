document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const loginForm = document.getElementById("login-form");
  const loginContainer = document.getElementById("login-container");
  const appContainer = document.getElementById("app-container");
  const rideForm = document.getElementById("ride-form");
  const fareDisplay = document.getElementById("fare");
  const rideStatus = document.getElementById("ride-status");
  const rideStatusMessage = document.getElementById("ride-status-message");
  const driverDetails = document.getElementById("driver-details");
  const driverNameSpan = document.getElementById("driver-name");
  const driverVehicleSpan = document.getElementById("driver-vehicle");
  const driverPhotoImg = document.getElementById("driver-photo");
  const cancelBtn = document.getElementById("cancel");

  const vipPopup = document.getElementById("vip-popup");
  const vipNameSpan = document.getElementById("vip-name");
  const vipCarSpan = document.getElementById("vip-car");
  const acceptVipBtn = document.getElementById("accept-vip");
  const rejectVipBtn = document = document.getElementById("reject-vip");

  const ratingPopup = document.getElementById("rating-popup");
  const stars = document.querySelectorAll(".star");
  const closeRatingBtn = document.getElementById("close-rating");

  const seatSelectionDiv = document.getElementById("seat-selection");
  const currentPassengersP = document.getElementById("current-passengers");
  const availableSeatsP = document.getElementById("available-seats");
  const seatNumberSelect = document.getElementById("seat-number");
  const confirmSeatBtn = document.getElementById("confirm-seat");
  const vehicleSelect = document.getElementById("vehicle");

  let currentFare = 0;
  let currentDriver = null;

  // Refined Driver Data separated by vehicle type
  const autoDrivers = [
    { name: "Sanjay Mane", vehicle: "Standard Auto", photo: "https://via.placeholder.com/100/A020F0/FFFFFF?text=SM" },
    { name: "Prakash Shinde", vehicle: "Electric Auto", photo: "https://via.placeholder.com/100/40E0D0/000000?text=PS" },
  ];

  const carDrivers = [
    { name: "Rajesh Kumar", vehicle: "Maruti Swift", photo: "https://via.placeholder.com/100/FFA500/FFFFFF?text=RK" },
    { name: "Sunil Patil", vehicle: "Tata Nexon EV", photo: "https://via.placeholder.com/100/FFD700/000000?text=SP" },
    { name: "Aarti Desai", vehicle: "Hyundai Creta", photo: "https://via.placeholder.com/100/ADFF2F/000000?text=AD" }
  ];

  const suvDrivers = [
    { name: "Vikram Gokhale", vehicle: "Mahindra XUV700", photo: "https://via.placeholder.com/100/FF6347/FFFFFF?text=VG" },
    { name: "Pooja Sharma", vehicle: "Toyota Fortuner", photo: "https://via.placeholder.com/100/FF1493/FFFFFF?text=PS" }
  ];

  const luxuryDrivers = [
    { name: "Arjun Singh", vehicle: "Mercedes E-Class", photo: "https://via.placeholder.com/100/8A2BE2/FFFFFF?text=AS" },
    { name: "Nisha Mehta", vehicle: "BMW 5 Series", photo: "https://via.placeholder.com/100/4682B4/FFFFFF?text=NM" }
  ];
  
  const ferrariDrivers = [
    { name: "Rahul Jaiswal", vehicle: "Ferrari SF-90", photo: "https://via.placeholder.com/100/FF0000/FFFFFF?text=RJ" }
  ];

  const vipDriver = { name: "Amitabh Bachchan", vehicle: "Mercedes Maybach", photo: "https://via.placeholder.com/100/FF4500/FFFFFF?text=AB" };

  // Login Functionality
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    loginContainer.style.display = "none";
    appContainer.style.display = "block";
  });

  // Fare Calculation
  const updateFare = () => {
    const routeSelect = document.getElementById("route");
    const selectedRoute = routeSelect.options[routeSelect.selectedIndex];
    const selectedVehicle = vehicleSelect.options[vehicleSelect.selectedIndex];
    if (selectedRoute && selectedVehicle) {
      const distance = parseFloat(selectedRoute.getAttribute("data-distance"));
      const pricePerKm = parseFloat(selectedVehicle.getAttribute("data-price"));
      currentFare = distance * pricePerKm;
      fareDisplay.textContent = `Estimated Fare: ₹${currentFare}`;
    }
  };

  document.getElementById("route").addEventListener("change", updateFare);
  vehicleSelect.addEventListener("change", updateFare);

  // Seat Selection Logic
  const prepareSeatSelection = () => {
    const selectedVehicle = vehicleSelect.options[vehicleSelect.selectedIndex];
    const capacity = parseInt(selectedVehicle.getAttribute("data-capacity"));
    
    // Seat calculation logic based on vehicle type
    const passengerCapacity = (selectedVehicle.value.startsWith("auto-")) ? capacity - 1 : capacity;
    
    const currentPassengers = Math.floor(Math.random() * passengerCapacity);
    const availableSeats = passengerCapacity - currentPassengers;

    currentPassengersP.textContent = `Currently riding: ${currentPassengers}`;
    availableSeatsP.textContent = `Available seats: ${availableSeats}`;
    seatNumberSelect.innerHTML = "";

    if (availableSeats > 0) {
      for (let i = 1; i <= availableSeats; i++) {
        let option = document.createElement("option");
        option.value = i;
        option.textContent = `Seat ${i}`;
        seatNumberSelect.appendChild(option);
      }
      seatSelectionDiv.style.display = "block";
    } else {
      seatSelectionDiv.innerHTML = "<p>Ride full. No seats available.</p>";
    }
  };

  // Ride Booking
  rideForm.addEventListener("submit", (e) => {
    e.preventDefault();
    updateFare();
    rideForm.style.display = "none";
    rideStatus.style.display = "block";
    
    const selectedVehicleOption = vehicleSelect.options[vehicleSelect.selectedIndex];
    const vehicleValue = selectedVehicleOption.value;
    
    let driversList = [];
    if (vehicleValue === "vip-maybach") {
      vipNameSpan.textContent = vipDriver.name;
      vipCarSpan.textContent = vipDriver.vehicle;
      vipPopup.style.display = "flex";
      return;
    } else if (vehicleValue.startsWith("auto-")) {
      driversList = autoDrivers;
    } else if (vehicleValue.startsWith("economy-")) {
      driversList = carDrivers;
    } else if (vehicleValue.startsWith("suv-")) {
      driversList = suvDrivers;
    } else if (vehicleValue.startsWith("luxury-")) {
      driversList = luxuryDrivers;
    } else if (vehicleValue === "ferrari-sf90") {
      driversList = ferrariDrivers;
    } else {
        driversList = carDrivers;
    }

    currentDriver = driversList[Math.floor(Math.random() * driversList.length)];
    driverNameSpan.textContent = currentDriver.name;
    driverVehicleSpan.textContent = currentDriver.vehicle;
    driverPhotoImg.src = currentDriver.photo;
    driverPhotoImg.style.display = "block";
    driverDetails.style.display = "block";
    prepareSeatSelection();
    rideStatusMessage.textContent = "Driver is on the way...";
  });

  // VIP Driver Acceptance
  acceptVipBtn.addEventListener("click", () => {
    currentDriver = vipDriver;
    driverNameSpan.textContent = currentDriver.name;
    driverVehicleSpan.textContent = currentDriver.vehicle;
    driverPhotoImg.src = currentDriver.photo;
    driverPhotoImg.style.display = "block";
    driverDetails.style.display = "block";
    vipPopup.style.display = "none";
    prepareSeatSelection();
    rideStatusMessage.textContent = "Driver is on the way...";
  });

  rejectVipBtn.addEventListener("click", () => {
    const normalDrivers = carDrivers;
    currentDriver = normalDrivers[Math.floor(Math.random() * normalDrivers.length)];
    driverNameSpan.textContent = currentDriver.name;
    driverVehicleSpan.textContent = currentDriver.vehicle;
    driverPhotoImg.src = currentDriver.photo;
    driverPhotoImg.style.display = "block";
    driverDetails.style.display = "block";
    vipPopup.style.display = "none";
    prepareSeatSelection();
    rideStatusMessage.textContent = "Driver is on the way...";
  });

  // Seat Confirmation
  confirmSeatBtn.addEventListener("click", () => {
    const selectedSeat = seatNumberSelect.value;
    rideStatusMessage.textContent = `Seat confirmed (Seat ${selectedSeat}). Ride in progress...`;
    seatSelectionDiv.style.display = "none";
    simulateRideProgress();
  });

  // Ride Simulation
  const simulateRideProgress = () => {
    setTimeout(() => {
      rideStatusMessage.textContent = "Driver has arrived.";
    }, 3000); 

    setTimeout(() => {
      rideStatusMessage.textContent = "Ride completed.";
      ratingPopup.style.display = "flex";
    }, 6000);
  };

  // Ride Cancellation
  cancelBtn.addEventListener("click", () => {
    resetAppState();
  });

  // Rating Functionality
  stars.forEach(star => {
    star.addEventListener("click", () => {
      const rating = parseInt(star.getAttribute("data-rating"));
      stars.forEach(s => {
        const starRating = parseInt(s.getAttribute("data-rating"));
        s.textContent = starRating <= rating ? "★" : "☆";
      });
    });
  });

  closeRatingBtn.addEventListener("click", () => {
    resetAppState();
  });

  // Reset Application State
  const resetAppState = () => {
    rideForm.style.display = "block";
    rideStatus.style.display = "none";
    driverDetails.style.display = "none";
    seatSelectionDiv.style.display = "none";
    fareDisplay.textContent = "Estimated Fare: ₹0";
    rideForm.reset();
    vipPopup.style.display = "none";
    ratingPopup.style.display = "none";
    driverPhotoImg.style.display = "none";
  };
});