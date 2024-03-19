import { Link, useHistory } from "react-router-dom";
import Table from "./Table.js";
import { useEffect } from "react";

const Dev = () => {
    const history = useHistory();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            history.push("/dev-login");
        }

        fetch("/authenticated", {
            headers: {
                Authorization: token,
                "Content-Type": "application/json"
            }
        }).then((res) => {
            if (!res.ok) {
                history.push("/dev-login");
            }
        }).catch((err) => {
            console.log(err);
        });
    }, [history]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        history.push("/");
    }
    
 
    return (
        <div className="dev">
            <h1>Developer Page</h1>
            <div className="home-link">
                <Link to="/">home page </Link>
                |
                <Link to="/" onClick={handleLogout}> logout</Link>
            </div>
            <Table />
        </div>
    );
}
 
export default Dev;