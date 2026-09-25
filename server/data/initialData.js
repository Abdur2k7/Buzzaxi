export const initialRoutes = [
  {
    category: "🏙️ Andheri Area",
    items: [
      { id: "andheri-airport", name: "Andheri to Airport", distance: 6, icon: "✈️" },
      { id: "andheri-bkc", name: "Andheri to BKC", distance: 7, icon: "🏢" },
      { id: "andheri-juhu", name: "Andheri to Juhu", distance: 4, icon: "🏖️" },
      { id: "andheri-powai", name: "Andheri to Powai", distance: 9, icon: "🏫" }
    ]
  },
  {
    category: "✈️ Airport Routes",
    items: [
      { id: "airport-gateway", name: "Airport to Gateway of India", distance: 23, icon: "🗼" },
      { id: "airport-marinedrive", name: "Airport to Marine Drive", distance: 22, icon: "🌊" },
      { id: "airport-bandrawest", name: "Airport to Bandra West", distance: 8, icon: "🏘️" },
      { id: "airport-thane", name: "Airport to Thane", distance: 25, icon: "🌇" }
    ]
  },
  {
    category: "🏛️ South Mumbai",
    items: [
      { id: "cst-colaba", name: "CST to Colaba", distance: 4, icon: "🏰" },
      { id: "nariman-haji", name: "Nariman Point to Haji Ali", distance: 3, icon: "🕌" },
      { id: "fort-churchgate", name: "Fort to Churchgate", distance: 2, icon: "⛪" },
      { id: "colaba-mahalaxmi", name: "Colaba to Mahalaxmi", distance: 5, icon: "💎" }
    ]
  },
  {
    category: "🌆 Extended Mumbai",
    items: [
      { id: "thane-borivali", name: "Thane to Borivali", distance: 18, icon: "🌳" },
      { id: "dadar-parel", name: "Dadar to Parel", distance: 6, icon: "🏭" },
      { id: "virar-miraroad", name: "Virar to Mira Road", distance: 12, icon: "🌉" },
      { id: "ghatkopar-chembur", name: "Ghatkopar to Chembur", distance: 8, icon: "🌃" },
      { id: "miraroad-dharavi", name: "Mira Road to Dharavi", distance: 28, icon: "🏰" }
    ]
  }
];

export const initialVehicles = [
  {
    category: "🛺 Auto Rickshaws",
    items: [
      { id: "auto-standard", name: "Standard Auto", pricePerKm: 14, capacity: 3, passengerCapacity: 2, icon: "🛺" },
      { id: "auto-premium", name: "Premium Auto", pricePerKm: 18, capacity: 3, passengerCapacity: 2, icon: "🛺" },
      { id: "auto-electric", name: "Electric Auto", pricePerKm: 16, capacity: 3, passengerCapacity: 2, icon: "⚡" },
      { id: "auto-shared", name: "Shared Auto", pricePerKm: 10, capacity: 3, passengerCapacity: 2, icon: "👥" }
    ]
  },
  {
    category: "🚗 Economy Cars",
    items: [
      { id: "economy-swift", name: "Maruti Swift", pricePerKm: 18, capacity: 5, passengerCapacity: 4, icon: "🚗" },
      { id: "economy-nexon", name: "Tata Nexon EV", pricePerKm: 20, capacity: 5, passengerCapacity: 4, icon: "⚡" },
      { id: "economy-ertiga", name: "Maruti Ertiga", pricePerKm: 22, capacity: 7, passengerCapacity: 6, icon: "🚐" },
      { id: "economy-xcent", name: "Hyundai Xcent", pricePerKm: 19, capacity: 5, passengerCapacity: 4, icon: "🚗" }
    ]
  },
  {
    category: "🚙 SUVs",
    items: [
      { id: "suv-creta", name: "Hyundai Creta", pricePerKm: 28, capacity: 7, passengerCapacity: 6, icon: "🚙" },
      { id: "suv-xuv700", name: "Mahindra XUV700", pricePerKm: 32, capacity: 7, passengerCapacity: 6, icon: "🚙" },
      { id: "suv-fortuner", name: "Toyota Fortuner", pricePerKm: 45, capacity: 7, passengerCapacity: 6, icon: "🚙" },
      { id: "suv-safari", name: "Tata Safari", pricePerKm: 35, capacity: 7, passengerCapacity: 6, icon: "🚙" }
    ]
  },
  {
    category: "💎 Luxury Vehicles",
    items: [
      { id: "luxury-mercedes", name: "Mercedes E-Class", pricePerKm: 80, capacity: 5, passengerCapacity: 4, icon: "✨" },
      { id: "luxury-bmw", name: "BMW 5 Series", pricePerKm: 85, capacity: 5, passengerCapacity: 4, icon: "✨" },
      { id: "luxury-audi", name: "Audi A6", pricePerKm: 90, capacity: 5, passengerCapacity: 4, icon: "✨" },
      { id: "vip-maybach", name: "Mercedes Maybach", pricePerKm: 300, capacity: 4, passengerCapacity: 3, icon: "👑", isVip: true },
      { id: "ferrari-sf90", name: "Ferrari SF-90", pricePerKm: 300, capacity: 3, passengerCapacity: 2, icon: "🏎️" }
    ]
  }
];

export const initialDrivers = [
  {
    name: "Sanjay Mane",
    vehicle: "Standard Auto",
    category: "auto",
    photo: "https://api.dicebear.com/7.x/bottts/svg?seed=SanjayMane",
    rating: 4.8,
    isVip: false
  },
  {
    name: "Prakash Shinde",
    vehicle: "Electric Auto",
    category: "auto",
    photo: "https://api.dicebear.com/7.x/bottts/svg?seed=PrakashShinde",
    rating: 4.9,
    isVip: false
  },
  {
    name: "Rajesh Kumar",
    vehicle: "Maruti Swift",
    category: "economy",
    photo: "https://api.dicebear.com/7.x/bottts/svg?seed=RajeshKumar",
    rating: 4.7,
    isVip: false
  },
  {
    name: "Sunil Patil",
    vehicle: "Tata Nexon EV",
    category: "economy",
    photo: "https://api.dicebear.com/7.x/bottts/svg?seed=SunilPatil",
    rating: 4.9,
    isVip: false
  },
  {
    name: "Aarti Desai",
    vehicle: "Hyundai Creta",
    category: "economy",
    photo: "https://api.dicebear.com/7.x/bottts/svg?seed=AartiDesai",
    rating: 5.0,
    isVip: false
  },
  {
    name: "Vikram Gokhale",
    vehicle: "Mahindra XUV700",
    category: "suv",
    photo: "https://api.dicebear.com/7.x/bottts/svg?seed=VikramGokhale",
    rating: 4.8,
    isVip: false
  },
  {
    name: "Pooja Sharma",
    vehicle: "Toyota Fortuner",
    category: "suv",
    photo: "https://api.dicebear.com/7.x/bottts/svg?seed=PoojaSharma",
    rating: 4.9,
    isVip: false
  },
  {
    name: "Arjun Singh",
    vehicle: "Mercedes E-Class",
    category: "luxury",
    photo: "https://api.dicebear.com/7.x/bottts/svg?seed=ArjunSingh",
    rating: 4.95,
    isVip: false
  },
  {
    name: "Nisha Mehta",
    vehicle: "BMW 5 Series",
    category: "luxury",
    photo: "https://api.dicebear.com/7.x/bottts/svg?seed=NishaMehta",
    rating: 4.9,
    isVip: false
  },
  {
    name: "Rahul Jaiswal",
    vehicle: "Ferrari SF-90",
    category: "ferrari",
    photo: "https://api.dicebear.com/7.x/bottts/svg?seed=RahulJaiswal",
    rating: 5.0,
    isVip: false
  },
  {
    name: "Amitabh Bachchan",
    vehicle: "Mercedes Maybach",
    category: "vip",
    photo: "https://api.dicebear.com/7.x/bottts/svg?seed=AmitabhBachchanVIP",
    rating: 5.0,
    isVip: true
  }
];
