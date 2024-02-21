import { useState } from "react";
import useFetch from "./useFetch.js";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Cookies from "universal-cookie";
import jwt from "jwt-decode";

const DevLogin = () => {
    const [password, setPassword] = useState("");
    const [checking, setChecking] = useState(false);
    const [loginFail, setLoginfail] = useState(false);

    const { data: dev, error } = useFetch("/dev");
    const history = useHistory();

    const cookies = new Cookies()

    const handleSubmit = async (e) => {
        e.preventDefault();
        setChecking(true);
        const body = JSON.stringify({ password: password });
        if (dev.length === 0) {
            fetch("http://localhost:9090/signup", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json"
                },
                body: body
            }).then(() => {
                history.push("/dev");
            });
        } else {
            fetch("http://localhost:9090/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: body
            }).then(res => {
                if (res.ok) {
                    history.push("/dev");
                }
                setChecking(false);
                setLoginfail(true);
            });
        }
    }

    const login = () => {

    }


    return (
        <div className="dev">
            <h1>Dev Login</h1>
            <Link to="/">go back</Link>
            {checking && <p>Validating...</p>}
            { !checking && 
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
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