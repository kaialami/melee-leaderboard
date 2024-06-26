import { useEffect, useState } from "react";
import useFetch from "./useFetch.js";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

const DevLogin = () => {
    const [password, setPassword] = useState("");
    const [checking, setChecking] = useState(false);
    const [loginFail, setLoginfail] = useState(false);

    const { data: dev } = useFetch(process.env.REACT_APP_API_URL + "/dev");
    const history = useHistory();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            history.push("/admin");
        }
    }, [history])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setChecking(true);
        const body = JSON.stringify({ password: password });
        if (dev.length === 0) {
            fetch(process.env.REACT_APP_API_URL + "/signup", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json"
                },
                body: body
            }).then(async (res) => {
                redirect(res);
            }).catch((err) => {
                console.log(err);
            });
        } else {
            fetch(process.env.REACT_APP_API_URL + "/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: body
            }).then(async (res) => {
                redirect(res);
                setChecking(false);
                setLoginfail(true);
            }).catch((err) => {
                console.log(err);
                setChecking(false);
                setLoginfail(true);
            });
        }
    }

    const redirect = async (res) => {
        if (res.ok) {
            const data = await res.json();
            localStorage.setItem("token", data.token);
            history.push("/admin");
        }
    }

    return (
        <div className="dev">
            <h1>Admin Login</h1>
            <Link to="/">go back</Link>
            {checking && <p>Validating...</p>}
            { !checking && 
            <form onSubmit={handleSubmit}>
                <input 
                    type="password" 
                    required 
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button>login</button>
            </form> }
            { loginFail && <p>wrong password</p> }
        </div>
    );
}
 
export default DevLogin;