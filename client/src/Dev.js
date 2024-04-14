import { Link, useHistory } from "react-router-dom";
import Table from "./Table.js";
import { useEffect } from "react";
import Title from "./Title.js";

const Dev = () => {
    const title = "Admin";
    const history = useHistory();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.log("going to login");
            history.push("/dev-login");
        }

        fetch("/authenticated", {
            headers: {
                Authorization: token,
                "Content-Type": "application/json"
            }
        }).then((res) => {
            if (!res.ok) {
                localStorage.removeItem("token");
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
            <Title title={title}/>
            <div className="home-link">
                <Link to="/">home page </Link>
                |
                <Link to="/" onClick={handleLogout}> logout</Link>
            </div>
            <Table dev={true}/>
        </div>
    );
}
 
export default Dev;