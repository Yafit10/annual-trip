import { useNavigate } from "react-router-dom";
import { GetJwt } from "./Service.ts";
import { useState } from "react";

export default function LoginPage() {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [Id, setId] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [remember, setRemember] = useState(true);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            // קורא ל-GetJwt עם המייל והסיסמה
            const token = await GetJwt(Id, password);

            console.log("JWT:", token);

            // אם רוצים לשמור ב-localStorage (לשימוש בכל דף)
            if (remember) {
                localStorage.setItem("jwtToken", token);
            }
            const payload = JSON.parse(atob(token.split(".")[1]));
            const role = payload.role;
            if (role === "admin") {
                navigate("/admin");

            }
            else {
                if (role === "teacher") {
                    navigate("/teacher");

                }
                else
                    navigate("/");
            }

        } catch (err: any) {
            setError(err.message || "שגיאה בהתחברות");
        }
    };
    return (
        <div>
            <h1>דף התחברות</h1>
            <p>אנא הזן את פרטי התחברות שלך כדי להתחבר.</p>
            <button type="button" onClick={() => navigate("/")} >
                חזרה לדף הבית
            </button>
            <input
                placeholder="ID"
                required
                value={Id}
                onChange={(e) => setId(e.target.value)}
            />
            <input
                placeholder="password"
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" onClick={onSubmit}>
                לחץ להתחברות
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}