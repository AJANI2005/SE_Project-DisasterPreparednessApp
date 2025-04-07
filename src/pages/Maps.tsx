import SearchBar from "./SearchBar";
import 'leaflet/dist/leaflet.css';
import L, { LatLngBoundsExpression, LatLngExpression } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import './styles/map.css'
import { useEffect, useRef, useState } from "react";


//import data files
import shelters from "../data/shelters.json"
import { useLocation } from "react-router-dom";


interface Props {
    initialShelter?: any;
    selectShelter: (shelter: any) => void
}

// GEOLOCATION
const GetDirectionsButton = ({ shelter }: any) => {
    const [directionsUrl, setDirectionsUrl] = useState<string>('');

    useEffect(() => {
        if (!shelter) return;

        const getUserLocation = () => {
            return new Promise<GeolocationCoordinates | null>((resolve) => {
                if (!navigator.geolocation) {
                    console.error('Geolocation not supported');
                    return resolve(null);
                }

                navigator.geolocation.getCurrentPosition(
                    (position) => resolve(position.coords),
                    (error) => {
                        console.error('Error getting location:', error);
                        resolve(null);
                    }
                );
            });
        };

        const generateUrl = async () => {
            const location = await getUserLocation();
            if (location) {
                const { latitude, longitude } = location;
                const destination = `${shelter.name} ${shelter.parish}`;
                const url = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${encodeURIComponent(destination)}`;
                setDirectionsUrl(url);
            }
        };

        generateUrl();
    }, [shelter]);

    if (!shelter || !directionsUrl) return null;

    return (
        <a target="_blank" rel="noopener noreferrer" href={directionsUrl}>
            <button className="btn btn-primary">Get Directions</button>
        </a>
    );
};

const MapComponent = ({ initialShelter, selectShelter }: Props) => {

    const [selectedShelter, setSelectedShelter] = useState<any>(initialShelter)
    useEffect(() => {
        if (initialShelter) selectShelter(initialShelter);
    }, [initialShelter, selectShelter]);


    const center: LatLngExpression = [13.181584848421421, -59.57119143308145]
    const bounds: LatLngBoundsExpression = [
        [12.879204284001862, -59.87057713192736], [13.547666868639945, -59.17569187802111]
    ];

    const minZoom = 5;
    const zoom = 12;
    // selected icon
    const icon = new L.Icon({
        iconUrl: 'icons/marker.png', // or a URL string
        className: "map-marker",
        iconSize: [32, 32],
        iconAnchor: [16, 32],   // where the point of the icon anchors to the marker location
        popupAnchor: [0, -32],  // where the popup should appear relative to the icon
    });
    const selectedIcon = new L.Icon({
        iconUrl: 'icons/marker2.png', // or a URL string
        className: "map-marker-selected",
        iconSize: [48, 48],
        iconAnchor: [24, 48],   // where the point of the icon anchors to the marker location
        popupAnchor: [0, -32],  // where the popup should appear relative to the icon
    });


    return (<>
        <div className="map-container">
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
                            <Marker
                                icon={shelter.properties.name !== selectedShelter?.properties?.name ? icon : selectedIcon}
                                eventHandlers={{
                                    click: () => {
                                        selectShelter(shelter);
                                        setSelectedShelter(shelter);
                                    }
                                }}
                                key={id}
                                position={[coordinates[1], coordinates[0]]}>
                                <Popup


                                >
                                    <h3>{name}</h3>
                                    <p>{description}</p>
                                    <p>Capacity: {capacity}</p>
                                    <p>Parish: {parish}</p>
                                    <GetDirectionsButton shelter={selectedShelter} />
                                </Popup>
                            </Marker>
                        );

                    })
                }

            </MapContainer>
        </div>
    </>)
}


const Maps = () => {


    const [selectedShelter, setSelectedShelter] = useState<any>()

    const shelterInfoRef = useRef<any>(null);
    const scrollToTarget = () => {
        shelterInfoRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const location = useLocation();
    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        // Check for passed state /maps/shelter.name
        const shelter = location.state?.shelter;
        if (shelter) {
            setSelectedShelter(shelter);
        }
        setMounted(true)
    }, [])

    if (!mounted) return null;
    return (
        <>
            <h2>Maps</h2>
            <h3>Select a location get details on the shelter</h3>
            <SearchBar showShelters={true} />

            <div className="map-wrapper">

                {
                    <MapComponent initialShelter={selectedShelter} selectShelter={(shelter: any) => {
                        //delay the scroll
                        setTimeout(() => {
                            scrollToTarget();
                        }, 100)
                        setSelectedShelter(shelter);
                    }} />
                }
                {
                    selectedShelter &&
                    <div className="shelter-info" ref={shelterInfoRef}>
                        <h2 className="shelter-name">{selectedShelter.properties.name}</h2>
                        <h3 className="shelter-description">{selectedShelter.properties.description}</h3>
                        <ul className="shelter-list-group">
                            <li className="shelter-list-item">
                                <img className="shelter-icon" src="/icons/users.png" alt="Accommodation" />
                                <span>Accommodation {selectedShelter.properties.capacity}</span>
                            </li>
                            <li className="shelter-list-item">
                                <img className="shelter-icon" src="/icons/droplet.png" alt="Potable Water" />
                                <span>Potable Water {selectedShelter.properties.potable ? "Yes" : "No"}</span>
                            </li>
                            <GetDirectionsButton shelter={selectedShelter} />
                        </ul>
                    </div>

                }
            </div>
        </>)
}
export default Maps;
