import { useHistory } from "react-router-dom";
import Checkbox from "./Checkbox.js";
import { useEffect, useState } from "react";

const InvisibleTable = ({ players }) => {
    const [checked, setChecked] = useState({});
    const [cerror, setCerror] = useState(false);
    const history = useHistory();

    useEffect(() => {
        for (const player of players) {
            setChecked(prev => ({...prev, [player.id]: false}));
        }
    }, [players]);

    const handleChange = (e) => {
        const { name } = e.target;
        const changed = !checked[name];
        setChecked({...checked, [name]: changed});
    }

    const handleMakeVisible = async (e) => {
        const body = JSON.stringify(checked);
        fetch(process.env.REACT_APP_API_URL + "/make-visible", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: body
        }).then((res) => {
            if (res.ok) {
                history.go(0);
            } else {
                setCerror("Failed to update visibility - try again")
            }
        }).catch((err) => {
            setCerror("Failed to update visibility - try again");
        })
    }

    return (  
        <div className="dev-invisible">
            <h3>Invisible Players</h3>
            <p>Played &lt; 5 sets or did not enter a UBC weekly</p>
            <p>OR was forced invisible by admin</p>
            {players && <table className="dev-invisible-table">
                <thead>
                    <tr>
                        <th>Visible?</th>
                        <th className="player-column">Player</th>
                        <th>Elo</th>
                        <th>Sets Won</th>
                        <th>Sets Played</th>
                    </tr>
                </thead> 
                <tbody>
                {players.map(player => {
                    let ranking = player.ranking;
                    if (ranking == null) ranking = "";
                    return (
                        <tr key={player.id}>
                            <td>
                                <Checkbox value={checked[player.id]} onChange={handleChange} name={player.id}/>
                            </td>
                            <td className="player-column">
                                {/* eslint-disable-next-line */}
                                <a href={"https://start.gg/user/" + player.id} target="_blank">{player.username}</a>
                            </td>
                            <td>{player.elo}</td>
                            <td className="cell-align-right">{player.wins}</td>
                            <td className="cell-align-right">{player.played}</td>
                        </tr>
                    )
                    })}
                    <tr>
                        <td>
                            <button className="make-visible" onClick={handleMakeVisible}>Make Visible</button>
                        </td>
                    </tr>
                </tbody>
            </table> }
            {cerror && <p>{cerror}</p>}
        </div>
    );
}
 
export default InvisibleTable;