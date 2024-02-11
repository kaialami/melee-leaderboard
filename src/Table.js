const Table = () => {
    return ( 
        <table className="leaderboard">
            <thead>
                <tr>
                    <th>Rank</th>
                    <th className="player">Player</th>
                    <th>Elo</th>
                    <th>Won</th>
                    <th>Played</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1</td>
                    <td>kai</td>
                    <td>1500</td>
                    <td className="sets">12</td>
                    <td className="sets">15</td>
                </tr>
            </tbody>
        </table>
    );
}
 
export default Table;