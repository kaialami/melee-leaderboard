import { useEffect, useState } from "react";
import TableHeader from "./TableHead.js";
import TableBody from "./TableBody.js";

const Table = () => {
    const pathname = window.location.pathname;
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        let req = "/players"
        if (pathname === "/dev") {
            req = pathname;
        }

        fetch(req).then(res => res.json()).then(data => {
            setPlayers(data)
        })
    }, []);

    if (players.length === 0) return <p>Loading...</p>;

    return (
        <div>
            <table className="leaderboard">
                <TableHeader />
                <TableBody players={players}/>
            </table>
        </div> 
    );
}
 
export default Table;