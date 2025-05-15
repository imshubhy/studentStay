
import type { Property } from './types';

const commonAmenities = {
  pg: ['wifi', 'power backup', 'food', 'laundry', 'cctv', 'hot water', 'security'],
  apartment: ['wifi', 'kitchen', 'ac', 'laundry', 'parking', 'balcony'],
  room: ['wifi', 'study desk', 'fan', 'shared kitchen', 'shared bathroom'],
  house: ['wifi', 'kitchen', 'laundry', 'parking', 'garden', 'balcony', 'tv']
};

export const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Lunar Living Suites',
    description: 'A spacious and well-furnished 2BHK apartment, perfect for students. Includes Wi-Fi, kitchen, and study area. Walking distance to StudentStay University Gate 1.',
    photos: ["https://images.unsplash.com/photo-1586214601498-4dbcfd0bf2c8?q=80&w=3024&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    amenities: commonAmenities.apartment,
    price: 15000,
    location: { address: 'Alpha II, Greater Noida', lat: 28.4701, lng: 77.4998 },
    type: 'Apartment',
  },
  {
    id: '2',
    title: 'Orion Boys Hostel',
    description: 'Secure and comfortable PG accommodation for boys. Daily meals, cleaning services, and high-speed internet. Close to campus amenities.',
    photos: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxob3N0ZWwlMjBleHRlcmlvcnxlbnwwfHx8fDE2Mzg0NjYwMDl8MA&ixlib=rb-4.0.3&q=80&w=1080'],
    amenities: commonAmenities.pg,
    price: 8000,
    location: { address: 'Knowledge Park III, Greater Noida', lat: 28.4655, lng: 77.5001 },
    type: 'PG',
  },
  {
    id: '3',
    title: 'Venus Girls PG',
    description: 'Affordable shared room in a girls-only PG. Safe environment, includes all basic amenities. Very close to the main StudentStay bus stop.',
    photos: ['https://images.unsplash.com/photo-1600077625345-f401f4ba2fde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxob3N0ZWxzfGVufDB8fHx8MTc0NzEyNDUzNnww&ixlib=rb-4.1.0&q=80&w=1080'],
    amenities: [...commonAmenities.pg.slice(0,3), 'wardrobe'],
    price: 6500,
    location: { address: 'Omega I, Greater Noida', lat: 28.4689, lng: 77.4953 },
    type: 'PG',
  },
  {
    id: '4',
    title: 'Comet Studio Pads',
    description: 'A fully independent studio apartment with a kitchenette and attached bathroom. Ideal for students seeking privacy. 24/7 water and electricity.',
    photos: ['https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzdHVkaW8lMjBhcGFydG1lbnR8ZW58MHx8fHwxNzQ3MTI0NTM2fDA&ixlib=rb-4.1.0&q=80&w=1080'],
    amenities: ['kitchenette', 'attached bathroom', 'power backup', 'parking'],
    price: 12000,
    location: { address: 'Gamma II, Greater Noida', lat: 28.4720, lng: 77.4900 },
    type: 'Apartment',
  },
   {
    id: '5',
    title: 'Nebula Nook Rooms',
    description: 'A clean and simple single room for students on a budget. Shared bathroom and kitchen facilities. Good connectivity to the university.',
    photos: ['https://images.unsplash.com/photo-1505691938895-1758d7feb511?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzaW5nbGUlMjByb29tfGVufDB8fHx8MTc0NzEyNDUzN3ww&ixlib=rb-4.1.0&q=80&w=1080'],
    amenities: commonAmenities.room,
    price: 4500,
    location: { address: 'Knowledge Park I, Greater Noida', lat: 28.4752, lng: 77.4858 },
    type: 'Room',
  },
  {
    id: '6',
    title: 'Sirius Stays PG',
    description: 'Premium PG accommodation with modern amenities including a gym, common recreation room, and study lounge. High-security and all meals included.',
    photos: ['https://images.unsplash.com/photo-1615875605825-5eb9bb5d52ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwcGd8ZW58MHx8fHwxNzQ3MTI0NTM3fDA&ixlib=rb-4.1.0&q=80&w=1080'],
    amenities: [...commonAmenities.pg, 'gym', 'tv', 'study lounge'],
    price: 12500,
    location: { address: 'Alpha I, Greater Noida', lat: 28.4667, lng: 77.4921 },
    type: 'PG',
  },
  {
    id: '7',
    title: 'Polaris Group Flats',
    description: 'Compact 1BHK flat suitable for 2-3 students. Unfurnished, allowing you to set it up as per your needs. Close to local market and transport.',
    photos: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx1bmZ1cm5pc2hlZCUyMGZsYXR8ZW58MHx8fHwxNzQ3MTI0NTM3fDA&ixlib=rb-4.1.0&q=80&w=1080'],
    amenities: ['parking', 'balcony'],
    price: 9000,
    location: { address: 'Beta II, Greater Noida', lat: 28.4601, lng: 77.4880 },
    type: 'Apartment',
  },
  {
    id: '8',
    title: 'Aurora Girls Home',
    description: 'Comfortable and safe PG for girls, with options for rooms with private balconies. Includes meals and Wi-Fi. Strict security measures.',
    photos: ["https://images.unsplash.com/photo-1596224960249-be974914f8fd?q=80&w=2944&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    amenities: [...commonAmenities.pg.slice(0,4), 'balcony'],
    price: 9500,
    location: { address: 'Swarn Nagri, Greater Noida', lat: 28.4588, lng: 77.5020 },
    type: 'PG',
  },
  {
    id: '9',
    title: 'Cosmos Co-Living House',
    description: 'A large 3BHK house ideal for a group of students. Features a large living area, multiple bathrooms, and a private garden. Close to university shuttle service.',
    photos: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwaG91c2UlMjBnYXJkZW58ZW58MHx8fHwxNzQ3MTI0NTM4fDA&ixlib=rb-4.1.0&q=80&w=1080'],
    amenities: commonAmenities.house,
    price: 25000,
    location: { address: 'Chi IV, Greater Noida', lat: 28.4550, lng: 77.5100 },
    type: 'House',
  },
  {
    id: '10',
    title: 'Zenith Premium Rooms',
    description: 'High-quality single room with AC, attached bathroom, and study table. Includes daily housekeeping. Located in a quiet residential area.',
    photos: ['https://images.unsplash.com/photo-1592229505726-a92a2461e759?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwc3R1ZGVudCUyMHJvb218ZW58MHx8fHwxNzQ3MTI0NTM4fDA&ixlib=rb-4.1.0&q=80&w=1080'],
    amenities: [...commonAmenities.room, 'ac', 'attached bathroom', 'security'],
    price: 9000,
    location: { address: 'Delta I, Greater Noida', lat: 28.4780, lng: 77.4950 },
    type: 'Room',
  },
  {
    id: '11',
    title: 'Celestial View Apartments',
    description: 'A stylish apartment on a high floor offering great city views. Comes with modular kitchen, modern fittings, and access to society amenities.',
    photos: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxoaWdoJTIwZmxvb3IlMjBhcGFydG1lbnR8ZW58MHx8fHwxNzQ3MTI0NTM5fDA&ixlib=rb-4.1.0&q=80&w=1080'],
    amenities: [...commonAmenities.apartment, 'gym', 'tv'],
    price: 18000,
    location: { address: 'Sector 150, Noida', lat: 28.4990, lng: 77.4300 },
    type: 'Apartment',
  },
  {
    id: '12',
    title: 'Pioneer Executive PG',
    description: 'Top-tier PG for boys focusing on comfort and convenience. All meals, laundry, high-speed internet, and professional security included. Near major coaching centers.',
    photos: ['https://images.unsplash.com/photo-1623921333970-f0f9e139d71a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxleGVjdXRpdmUlMjBwZyUyMGJveXN8ZW58MHx8fHwxNzQ3MTI0NTM5fDA&ixlib=rb-4.1.0&q=80&w=1080'],
    amenities: [...commonAmenities.pg, 'study lounge'],
    price: 11000,
    location: { address: 'Knowledge Park II, Greater Noida', lat: 28.4700, lng: 77.4900 },
    type: 'PG',
  }
];


export const mockPropertiesWithAiFeatures = mockProperties.map((prop, index) => {
  const highlights = prop.aiHighlights || 
                     (index % 4 === 0 ? ["Great study environment", "Quiet area", "High-speed WiFi"] :
                      index % 4 === 1 ? ["Close to dining options", "Newly renovated", "Secure building"] :
                      index % 4 === 2 ? ["Popular choice", "Near campus shuttle", "Includes laundry"] :
                                        ["Budget friendly", "Well-maintained", "Good sunlight"]);
  return {
    ...prop,
    // matchScore is now managed in HomePage state to avoid hydration issues
    aiHighlights: highlights,
    isAiPowered: prop.isAiPowered === undefined ? index < 5 : prop.isAiPowered, // Mark first 5 as "AI-Powered" for demo
  };
});

