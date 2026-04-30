import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { CallServiceOpen } from "./Service.ts";
import L from "leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

function ChangeMapCenter({ position }: { position: [number, number] }) {
    const map = useMap();

    useEffect(() => {
        map.setView(position, 13);
    }, [position, map]);

    return null;
}

export default function StudentLocationPage() {
    const navigate = useNavigate();

    const [location, setLocation] = useState<any>(null);
    const [studentId, setStudentId] = useState("");
    const [searchedId, setSearchedId] = useState("");
    const [error, setError] = useState<string | null>(null);

    const position: [number, number] = location
        ? [Number(location.latitude), Number(location.longitude)]
        : [32.0853, 34.7818];

    const loadLocation = async (id: string) => {
        try {
            setError(null);
            const res = await CallServiceOpen("GET", `/api/locations/${id}`);
            setLocation(res);
        } catch {
            setLocation(null);
            setError("לא נמצא מיקום לתלמידה");
        }
    };

    const handleSearchLocation = async () => {
        if (!studentId) {
            setError("חובה להזין תעודת זהות");
            return;
        }

        setSearchedId(studentId);
        await loadLocation(studentId);
    };

    useEffect(() => {
        if (!searchedId) {
            return;
        }

        const intervalId = setInterval(() => {
            loadLocation(searchedId);
        }, 5000);

        return () => clearInterval(intervalId);
    }, [searchedId]);

    return (
        <div>
            <h1>בדיקת מיקום תלמידה</h1>

            <p>הכניסי תעודת זהות כדי לראות את המיקום האחרון.</p>

            <input
                placeholder="תעודת זהות"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
            />

            <button type="button" onClick={handleSearchLocation}>
                חיפוש מיקום
            </button>

            <button type="button" onClick={() => navigate("/")}>
                חזרה לדף הבית
            </button>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <MapContainer
                center={position}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: "300px", width: "100%" }}
            >
                <ChangeMapCenter position={position} />

                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {location && (
                    <Marker position={position}>
                        <Popup>
                            תלמידה: {location.Person?.firstName} {location.Person?.lastName}
                            <br />
                            תעודת זהות: {location.personId}
                            <br />
                            זמן: {new Date(location.timestamp).toLocaleString()}
                        </Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
}