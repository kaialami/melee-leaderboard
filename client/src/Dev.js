import { Link, useHistory } from "react-router-dom";
import { useEffect } from "react";
import Title from "./Title.js";
import DevTables from "./DevTables.js";

const Dev = () => {
    const title = "Admin";
    const history = useHistory();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.log("going to login");
            history.push("/admin-login");
        }

        fetch(process.env.REACT_APP_API_URL + "/authenticated", {
            headers: {
                Authorization: token,
                "Content-Type": "application/json"
            }
        }).then((res) => {
            if (!res.ok) {
                localStorage.removeItem("token");
                history.push("/admin-login");
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
            <Title title={title}/>
            <div className="home-link">
                <Link to="/">home page </Link>
                |
                <Link to="/" onClick={handleLogout}> logout</Link>
            </div>
            <DevTables />
        </div>
    );
}
 
export default Dev;