
import { useNavigate } from "react-router-dom";
export default function HomePage() {
    const navigate = useNavigate();

    return (
        <div>
            <h1>ברוך הבא לטיול השנתי</h1>
            <button  type="button" onClick={() => navigate("/login")} >
                התחברות מורה
            </button>
            <button  type="button" onClick={() => navigate("/student-location")} >
            בדיקת מיקום תלמיד על פי תעודת זהות
            </button>
            
        </div>

    );

}