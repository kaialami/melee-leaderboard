import { useEffect, useState } from "react";
import TableHeader from "./TableHead.js";

const Table = () => {
    const startgg = "https://start.gg/user/";
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        fetch("/players").then(res => res.json()).then( data => {
            setPlayers(data);
        })
    }, []);

    return (
        <div>
            {(players.length === 0) ? (<p>Loading...</p>): (
                <table className="leaderboard">
                    <TableHeader />
                    <tbody>
                        {players.map(player => {
                            if (player.visible === 0) return <tr key={player.id}></tr>;

                            let ranking = player.ranking;
                            if (ranking == null) ranking = "n/a";
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
            )}
        </div> 
    );
}
 
export default Table;