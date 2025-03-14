import L, { LatLngBoundsExpression, LatLngExpression } from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import 'leaflet/dist/leaflet.css';


const ResetViewButton = ({ position, zoom }: { position: [number, number], zoom: number }) => {
    const map = useMap();
    const resetView = () => {
        map.setView(position, zoom);
    };

    return <button onClick={resetView} style={{ position: 'absolute', top: '100px', left: '10px', zIndex: 1000 }}>Reset View</button>;
};

export const MiniMap = () => {
    const [shelters, setShelters] = useState<any[]>([]); // State to store shelter data
    const [stores, setStores] = useState<any[]>([]); // State to store store data
    const [loading, setLoading] = useState(true); // Loading state

    // Legend Toggles
    const [showShelters, setShowShelters] = useState(true);
    const [showStores, setShowStores] = useState(true);

    // Geo Location
    const [location, setLocation] = useState<GeolocationCoordinates | null>(null); // Default location

    // Fetch shelter and store data when component mounts
    useEffect(() => {
        fetch('/src/data/shelters.json')
            .then((response) => response.json())
            .then((data) => {
                setShelters(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching shelter data:', error);
                setLoading(false);
            });
        fetch('/src/data/stores.json')
            .then((response) => response.json())
            .then((data) => {
                setStores(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching shelter data:', error);
                setLoading(false);
            });
    }, []);



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



    if (loading) {
        return <div>Loading...</div>;
    }
    const center: LatLngExpression = [13.181584848421421, -59.57119143308145]
    const bounds: LatLngBoundsExpression = [
        [12.879204284001862, -59.87057713192736], [13.547666868639945, -59.17569187802111]
    ];

    const minZoom = 10;
    const zoom = 12;

    const shelterIcon = new L.Icon({
        iconUrl: 'shelter.png', // Path to your custom image
        iconSize: [32, 32], // Size of the icon
        iconAnchor: [16, 32], // Anchor point of the icon
        popupAnchor: [0, -32], // Anchor point of the popup
    });
    const storeIcon = new L.Icon({
        iconUrl: 'store.png', // Path to your custom image
        iconSize: [32, 32], // Size of the icon
        iconAnchor: [16, 32], // Anchor point of the icon
        popupAnchor: [0, -32], // Anchor point of the popup
    });


    return (
        <div>
            <h1>MiniMap</h1>
            {/*Legend*/}
            <div>
                <div style={{
                    display: 'grid',
                    width: "200px",
                    gridTemplateColumns: "auto auto auto",
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    marginBottom: '10px',
                }}>
                    <img src="shelter.png" width="32px" /><span>Shelter</span>
                    <input onChange={(e) => { setShowShelters(e.target.checked) }} checked={showShelters} type="checkbox" className="form-check-input" />

                    <img src="store.png" width="32px" /><span>Hardware Store</span>
                    <input onChange={(e) => { setShowStores(e.target.checked) }} checked={showStores} type="checkbox" className="form-check-input" />

                </div>
            </div>
            <MapContainer center={center} maxBounds={bounds} zoom={zoom} minZoom={minZoom}
                style={{ width: '100%', height: '800px' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {
                    // Render shelters
                    showShelters && shelters.map((shelter) => {
                        const p = shelter.properties;
                        const { name, description, capacity, potable, nonpotable, id, parish } = p;
                        const g = shelter.geometry;
                        const coordinates = g.coordinates;

                        return (
                            <Marker icon={shelterIcon} key={id} position={[coordinates[1], coordinates[0]]}>
                                <Popup>
                                    <h3>{name}</h3>
                                    <p>{description}</p>
                                    <p>Capacity: {capacity}</p>
                                    <p>Parish: {parish}</p>
                                    <a href={generateGoogleMapsUrl(name + " " + parish)}>
                                        <button className="btn btn-primary"
                                        >Get Directions</button>
                                    </a>
                                </Popup>
                            </Marker>
                        );

                    })
                }
                {
                    // Render stores
                    showStores && stores.map((store) => {
                        const p = store.properties;
                        const { name, description, id, parish } = p;
                        const g = store.geometry;
                        const coordinates = g.coordinates;

                        return (
                            <Marker icon={storeIcon} key={id} position={[coordinates[1], coordinates[0]]}>
                                <Popup>
                                    <h3>{name}</h3>
                                    <p>{description}</p>
                                    <p>Parish: {parish}</p>
                                    <a href={generateGoogleMapsUrl(name + " " + parish)}>
                                        <button className="btn btn-primary"
                                        >Get Directions</button>
                                    </a>
                                </Popup>
                            </Marker>
                        );

                    })
                }

                <ResetViewButton position={[center[0], center[1]]} zoom={zoom} />
            </MapContainer>
        </div>
    );
};

