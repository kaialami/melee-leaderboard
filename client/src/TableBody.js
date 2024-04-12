import { Link } from "react-router-dom";

const TableBody = ({ players }) => {
    return ( 
        <tbody>
            {players.map(player => {
                if (player.visible === 0) return <tr key={player.id}></tr>;

                let ranking = player.ranking;
                if (ranking == null) ranking = "";
                return (
                    <tr key={player.id}>
                        <td>{ranking}</td>
                        {/* eslint-disable-next-line */}
                        <td className="player-column">
                            <Link to={"/player/" + player.id}>{player.username}</Link>
                        </td>
                        <td>{player.elo}</td>
                        <td className="sets">{player.wins}</td>
                        <td className="sets">{player.played}</td>
                    </tr>
                )
            })}
        </tbody>
     );
}
 
export default TableBody;