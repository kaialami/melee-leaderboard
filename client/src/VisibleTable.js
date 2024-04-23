import { Link, useHistory } from "react-router-dom";
import Checkbox from "./Checkbox.js";
import { useEffect, useState } from "react";

const VisibleTable = ({ players }) => {
    const [checked, setChecked] = useState({});
    const [error, setError] = useState(false);
    const history = useHistory();

    useEffect(() => {
        if (players) {
            for (const player of players) {
                setChecked(prev => ({...prev, [player.id]: false}));
            }
        }
    }, [players]);

    const handleChange = (e) => {
        const { name } = e.target;
        const changed = !checked[name];
        setChecked({...checked, [name]: changed});
    }

    const handleMakeInvisible = async (e) => {
        const body = JSON.stringify(checked);
        fetch("http://localhost:8080/make-invisible", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: body
        }).then((res) => {
            if (res.ok) {
                history.go(0);
            } else {
                setError("Failed to update visibility - try again")
            }
        }).catch((err) => {
            setError("Failed to update visibility - try again");
        })
    }

    return (  
        <div className="dev-visible">
            <h3>Visible Players</h3>
            <p>Played 5 sets and entered one UBC weekly</p>
            <p>OR was forced visible by admin</p>
            <table className="dev-visible-table">
                <thead>
                    <tr>
                        <th>Invisible?</th>
                        <th>Rank</th>
                        <th className="player-column">Player</th>
                        <th>Elo</th>
                        <th>Sets Won</th>
                        <th>Sets Played</th>
                    </tr>
                </thead> 
                <tbody>
                    {players.map(player => {
                        if (player.visible === 0) return <tr key={player.id}></tr>;

                        let ranking = player.ranking;
                        if (ranking == null) ranking = "";
                        return (
                            <tr key={player.id}>
                                <td>
                                    <Checkbox value={checked[player.id]} onChange={handleChange} name={player.id}/>
                                </td>
                                <td>{ranking}</td>
                                <td className="player-column">
                                    <Link to={"/player/" + player.id}>{player.username}</Link>
                                </td>
                                <td>{player.elo}</td>
                                <td className="cell-align-right">{player.wins}</td>
                                <td className="cell-align-right">{player.played}</td>
                            </tr>
                        )
                    })}
                    <tr>
                        <td>
                            <button className="make-invisible" onClick={handleMakeInvisible}>Make Invisible</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            {error && <p>{error}</p>}
        </div>
    );
}
 
export default VisibleTable;