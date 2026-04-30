import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { CallService } from "./Service.ts";
import L from "leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

export default function TeacherPage() {
    const navigate = useNavigate();

    const [locations, setLocations] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [personId, setPersonId] = useState("");
    const [email, setEmail] = useState("");

    const token = localStorage.getItem("jwtToken");

    let classId = "";
    let teacherPersonId = "";

    if (token) {
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            classId = payload.classId || "";
            teacherPersonId = payload.personId || "";
        } catch {
            classId = "";
            teacherPersonId = "";
        }
    }

    const teacherLocation = locations.find(
        (location) => location.personId === teacherPersonId
    );

    const studentLocations = locations.filter(
        (location) => location.personId !== teacherPersonId
    );

    const farStudents = teacherLocation
        ? studentLocations
            .map((location) => {
                const distance = getDistance(
                    Number(teacherLocation.latitude),
                    Number(teacherLocation.longitude),
                    Number(location.latitude),
                    Number(location.longitude)
                );

                return {
                    ...location,
                    distance
                };
            })
            .filter((location) => location.distance > 3)
        : [];

    useEffect(() => {
        if (!token || !classId) {
            navigate("/login");
            return;
        }

        loadLocations();

        const intervalId = setInterval(() => {
            loadLocations();
        }, 5000);

        return () => clearInterval(intervalId);
    }, []);

    const loadLocations = async () => {
        try {
            setError(null);
            const res = await CallService("GET", `/api/locations/class/${classId}`);
            setLocations(Array.isArray(res) ? res : []);
        } catch (err: any) {
            setError("שגיאה בטעינת מיקומי התלמידים: " + err.message);
        }
    };

    const addStudent = async () => {
        try {
            setError(null);

            if (!firstName || !lastName || !personId) {
                setError("חובה למלא שם פרטי, שם משפחה ותעודת זהות");
                return;
            }

            await CallService("POST", "/api/persons", {
                firstName,
                lastName,
                personId,
                email,
                role: "student",
                classId
            });

            setFirstName("");
            setLastName("");
            setPersonId("");
            setEmail("");

            await loadLocations();
        } catch {
            setError("שגיאה בהוספת תלמיד");
        }
    };

    return (
        <div>
            <h1>דף מורה</h1>

            <button type="button" onClick={() => navigate("/")}>
                חזרה לדף הבית
            </button>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {teacherLocation && farStudents.length > 0 && (
                <div style={{ color: "red" }}>
                    <h3>התראות</h3>

                    {farStudents.map((student) => (
                        <p key={student.id}>
                            {student.Person?.firstName} {student.Person?.lastName} התרחקה {student.distance.toFixed(2)} ק״מ מהמורה
                        </p>
                    ))}
                </div>
            )}

            <h2>מיקומי תלמידים</h2>

            <MapContainer
                center={[32.0853, 34.7818]}
                zoom={8}
                scrollWheelZoom={false}
                style={{ height: "400px", width: "100%" }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {locations.map((location) => (
                    <Marker
                        key={location.id}
                        position={[Number(location.latitude), Number(location.longitude)]}
                    >
                        <Popup>
                            {location.personId === teacherPersonId ? "מורה" : "תלמידה"}: {location.Person?.firstName} {location.Person?.lastName}
                            <br />
                            זמן: {new Date(location.timestamp).toLocaleString()}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            <h2>הוספת תלמידה לכיתה שלי</h2>

            <input
                placeholder="שם פרטי"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
            />

            <input
                placeholder="שם משפחה"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
            />

            <input
                placeholder="תעודת זהות"
                value={personId}
                onChange={(e) => setPersonId(e.target.value)}
            />

            <input
                placeholder="מייל"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <button type="button" onClick={addStudent}>
                הוספת תלמידה
            </button>
        </div>
    );
}