
// Natural Disaster APIS

import { useEffect, useState } from "react";
import "./styles/alert.css"
/*
    Volcano - "https://volcanoes.usgs.gov/hans-public/api/volcano/getElevatedVolcanoes"
    Earthquake - "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2025-03-25" 
    Hurricane - "https://api.weather.gov/alerts/active?event=Earthquake" 
*/


const Alerts = () => {

    const [volcanoAlerts, setVolcanoAlerts] = useState<any[]>([]);
    const [earthquakeAlerts, setEarthquakeAlerts] = useState<any[]>([]);

    // Fetch API data and store them as alerts
    useEffect(() => {
        // Volcano Alerts
        fetch("https://volcanoes.usgs.gov/hans-public/api/volcano/getElevatedVolcanoes")
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const alerts = data.map((volcano: any) => ({
                    observatory: volcano.obs_fullname,
                    volcanoName: volcano.volcano_name,
                    volcanoID: volcano.vnum,
                    status: {
                        colorCode: volcano.color_code,
                        alertLevel: volcano.alert_level
                    },
                    noticeType: volcano.notice_type_cd,
                    sentTimeUTC: volcano.sent_utc
                }));
                setVolcanoAlerts(alerts);
            })
            .catch(error => {
                console.error("Error fetching volcano data:", error);
            });
        // Earthquake alerts
        fetch("https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2025-03-25")
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const alerts = data.features.map((earthquake: any) => ({
                    magnitude: earthquake.properties.mag,
                    location: earthquake.properties.place,
                    time: earthquake.properties.time,
                    updated: earthquake.properties.updated,
                    status: earthquake.properties.status,
                    significance: earthquake.properties.sig,
                    tsunami: earthquake.properties.tsunami,
                    coordinates: earthquake.geometry.coordinates,
                    detailURL: earthquake.properties.detail
                }));
                setEarthquakeAlerts(alerts);

            })
            .catch(error => {
                console.error("Error fetching earthquake data:", error);
            });

    }, [])
    return (
        <>
            <h1>Alerts</h1>

            {
                // Render volcano alerts
                volcanoAlerts.map((alert: any) => (
                    <div key={alert.volcanoID} className="alert-card">
                        <div>
                            <img className="alert-icon" src="icons/Volcano-icon.png"></img>
                        </div>
                        <div>
                            <p className="alert-heading" >Volcano: {alert.volcanoName}</p>
                            <p className="alert-text">Alert Level: {alert.status.alertLevel}</p>
                        </div>
                    </div>
                ))
            }
            {
                // Render earthquake alerts
                earthquakeAlerts.map((alert: any) => (
                    <div key={alert.time} className="alert-card">
                        <div>
                            <img className="alert-icon" src="icons/Earthquake-icon.png"></img>
                        </div>
                        <div>
                            <p className="alert-heading" >Earthquake: {alert.location}</p>
                            <p className="alert-text">Magnitude: {alert.magnitude}</p>
                        </div>
                    </div>
                ))
            }

        </>)
}
export default Alerts;
