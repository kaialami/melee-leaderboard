const TableBody = ({ players }) => {
    const startgg = "https://start.gg/user/";
    
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
                        <td className="player"><a href={startgg + player.id} target="_blank">{player.username}</a></td>
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