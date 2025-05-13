import { useState, useCallback } from 'react';
import ReactMapGL, { Marker, NavigationControl } from 'react-map-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './App.css';

function App() {
  const [pickup, setPickup] = useState(null);
  const [dropoff, setDropoff] = useState(null);
  const [selecting, setSelecting] = useState('pickup');
  const [rideType, setRideType] = useState('UberX');
  const [viewport, setViewport] = useState({
    latitude: 51.505,
    longitude: -0.09,
    zoom: 13
  });

  const handleMapClick = useCallback((e) => {
    const location = {
      lat: e.lngLat[1],
      lng: e.lngLat[0]
    };
    
    if (selecting === 'pickup') setPickup(location);
    else setDropoff(location);
  }, [selecting]);

  const bookRide = () => {
    if (!pickup || !dropoff) return;
    
    alert(`Requesting ${rideType} from [${pickup.lat.toFixed(3)},${pickup.lng.toFixed(3)}] to [${dropoff.lat.toFixed(3)},${dropoff.lng.toFixed(3)}]`);
  };

  return (
    <div className="app">
      <header className="topbar">
        <h1>Ride Demo</h1>
      </header>
      <div className="content">
        <aside className="sidebar">
          <h2>Get a ride</h2>
          <label>
            Ride type:
            <select value={rideType} onChange={(e) => setRideType(e.target.value)}>
              <option>UberX</option>
              <option>UberXL</option>
              <option>Black</option>
            </select>
          </label>
          <div style={{ margin: '1rem 0' }}>
            <button onClick={() => setSelecting('pickup')}>
              {selecting === 'pickup' ? '👉 ' : ''}
              Set Pickup
            </button>
            <p>
              {pickup ? `Pickup: ${pickup.lat.toFixed(4)}, ${pickup.lng.toFixed(4)}` : 'Click map to choose'}
            </p>
            <button onClick={() => setSelecting('dropoff')}>
              {selecting === 'dropoff' ? '👉 ' : ''}
              Set Drop-off
            </button>
            <p>
              {dropoff ? `Drop-off: ${dropoff.lat.toFixed(4)}, ${dropoff.lng.toFixed(4)}` : 'Click map to choose'}
            </p>
          </div>
          <button disabled={!pickup || !dropoff} onClick={bookRide}>
            Book Ride
          </button>
        </aside>

        <div className="map-container">
          <ReactMapGL
            {...viewport}
            mapStyle="https://demotiles.maplibre.org/style.json"
            onMove={evt => setViewport(evt.viewState)}
            onClick={handleMapClick}
          >
            <NavigationControl position="top-right" />
            {pickup && (
              <Marker latitude={pickup.lat} longitude={pickup.lng}>
                <div className="marker pickup-marker">P</div>
              </Marker>
            )}
            {dropoff && (
              <Marker latitude={dropoff.lat} longitude={dropoff.lng}>
                <div className="marker dropoff-marker">D</div>
              </Marker>
            )}
          </ReactMapGL>
        </div>
      </div>
    </div>
  );
}

export default App;