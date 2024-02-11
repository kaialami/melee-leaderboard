import { useState } from "react";
import TableHeader from "./TableHead.js";

const Table = () => {
    const [players, setPlayers] = useState([]);
    return ( 
        <table className="leaderboard">
            <TableHeader />
            <tbody>
                <tr>
                    <td>1</td>
                    {/* eslint-disable-next-line */}
                    <td className="player"><a href="https://www.start.gg/user/19c63f43" target="_blank">kai</a></td>
                    <td>1500</td>
                    <td className="sets">12</td>
                    <td className="sets">15</td>
                </tr>
            </tbody>
        </table>
    );
}
 
export default Table;