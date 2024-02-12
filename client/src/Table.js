import { useEffect, useState } from "react";
import TableHeader from "./TableHead.js";

const Table = () => {
    const startgg = "https://start.gg/user/";
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
                <tbody>
                    {players.map(player => {
                        if (player.visible === 0) return <tr key={player.id}></tr>;

                        let ranking = player.ranking;
                        if (ranking == null) ranking = "";
                        return (
                            <tr key={player.id}>
                                <td>{ranking}</td>
                                {/* eslint-disable-next-line */}
                                <td className="player"><a href={startgg + player.id} target="_blank">{player.username}</a></td>
                                <td>{player.elo}</td>
                                <td className="sets">{player.wins}</td>
                                <td className="sets">{player.played}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div> 
    );
}
 
export default Table;