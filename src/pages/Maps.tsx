import SearchBar from "./SearchBar";
import 'leaflet/dist/leaflet.css';
import L, { LatLngBoundsExpression, LatLngExpression } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import './styles/map.css'
import { useEffect, useState } from "react";


//import data files
import shelters from "../data/shelters.json"


const MapComponent = () => {
    const center: LatLngExpression = [13.181584848421421, -59.57119143308145]
    const bounds: LatLngBoundsExpression = [
        [12.879204284001862, -59.87057713192736], [13.547666868639945, -59.17569187802111]
    ];

    const minZoom = 5;
    const zoom = 12;

    // User's Location
    const [location, setLocation] = useState<GeolocationCoordinates | null>(null); // Default location

    // GEOLOCATION
    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation(position.coords);
                },
                (error) => {
                    console.error('Error getting location:', error);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    }
    // Generate Google Maps Directions URL
    const generateGoogleMapsUrl = (destination: string) => {
        // Attempt to get user location
        if (!location) {
            getUserLocation();
        }
        if (location) {
            const { latitude, longitude } = location;
            return `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${destination}`;
        }
        return '';
    };

    useEffect(() => {
        getUserLocation();
    }, []);



    return (<>
        <MapContainer center={center} maxBounds={bounds} zoom={zoom} minZoom={minZoom}
            style={{ width: '1280px', height: '720px' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {
                // Render shelters
                shelters.map((shelter) => {
                    const p = shelter.properties;
                    const { name, description, capacity, potable, nonpotable, id, parish } = p;
                    const g = shelter.geometry;
                    const coordinates = g.coordinates;

                    return (
                        <Marker key={id} position={[coordinates[1], coordinates[0]]}>
                            <Popup>
                                <h3>{name}</h3>
                                <p>{description}</p>
                                <p>Capacity: {capacity}</p>
                                <p>Parish: {parish}</p>
                                <a target="_blank" href={generateGoogleMapsUrl(name + " " + parish)}>
                                    <button className="btn btn-primary"
                                    >Get Directions</button>
                                </a>
                            </Popup>
                        </Marker>
                    );

                })
            }

        </MapContainer>

    </>)
}


const Maps = () => {
    return (
        <>
            <h2>Maps</h2>
            <h3>Select a location get details</h3>
            <SearchBar />
            <div className="map-container">
                <MapComponent />
            </div>
        </>)
}
export default Maps;
