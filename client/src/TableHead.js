const TableHead = () => {
    return (  
        <thead>
            <tr>
                <th>Rank</th>
                <th className="player-column">Player</th>
                <th>Elo</th>
                <th>Sets Won</th>
                <th>Sets Played</th>
            </tr>
        </thead>
    );
}
 
export default TableHead;