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
export default function AdminPage() {
    const navigate = useNavigate();

    const [locations, setLocations] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [personId, setPersonId] = useState("");
    const [password, setPassword] = useState("");
    const [teacherClassId, setTeacherClassId] = useState("");

    const [className, setClassName] = useState("");
    const [classNumber, setClassNumber] = useState("");

    const token = localStorage.getItem("jwtToken");

    useEffect(() => {
        if (!token) {
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
            const res = await CallService("GET", "/api/locations");
            setLocations(res);
        } catch {
            setError("שגיאה בטעינת מיקומים");
        }
    };

    const loadClasses = async () => {
        try {
            setError(null);
            const res = await CallService("GET", "/api/classes");
            setClasses(res);
        } catch {
            setError("שגיאה בטעינת כיתות");
        }
    };

    const addTeacher = async () => {
        try {
            setError(null);

            if (!firstName || !lastName || !personId || !password || !teacherClassId) {
                setError("חובה למלא את כל השדות");
                return;
            }

            await CallService("POST", "/api/persons", {
                firstName,
                lastName,
                personId,
                password,
                role: "teacher",
                classId: Number(teacherClassId)
            });

            setFirstName("");
            setLastName("");
            setPersonId("");
            setPassword("");
            setTeacherClassId("");
        } catch {
            setError("שגיאה בהוספת מורה");
        }
    };

    const addClass = async () => {
        try {
            setError(null);

            if (!className || !classNumber) {
                setError("חובה למלא שכבה ומספר כיתה");
                return;
            }

            await CallService("POST", "/api/classes", {
                gradeName: className,
                number: Number(classNumber)
            });

            setClassName("");
            setClassNumber("");

            await loadClasses();
        } catch {
            setError("שגיאה בהוספת כיתה");
        }
    };

    return (
        <div>
            <h1>דף מנהל</h1>

            <button type="button" onClick={() => navigate("/")}>
                חזרה לדף הבית
            </button>

            {error && <p style={{ color: "red" }}>{error}</p>}

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
                            תלמיד: {location.Person?.firstName} {location.Person?.lastName}                            <br />
                            זמן: {new Date(location.timestamp).toLocaleString()}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            <h2>הוספת מורה</h2>

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
                placeholder="סיסמה"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <select
                value={teacherClassId}
                onChange={(e) => setTeacherClassId(e.target.value)}
            >
                <option value="">בחרי כיתה</option>

                {classes.map((classItem) => (
                    <option key={classItem.id} value={classItem.id}>
                        {classItem.gradeName} {classItem.number}
                    </option>
                ))}
            </select>

            <button type="button" onClick={addTeacher}>
                הוספת מורה
            </button>

            <h2>הוספת כיתה</h2>

            <input
                placeholder="שכבה"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
            />

            <input
                placeholder="מספר כיתה"
                value={classNumber}
                onChange={(e) => setClassNumber(e.target.value)}
            />

            <button type="button" onClick={addClass}>
                הוספת כיתה
            </button>
        </div>
    );
}