import { Link } from "react-router-dom";
import SetTable from "./SetTable.js";

const PlayerDetails = ({ player }) => {
    const startgg = "https://start.gg/user/";
    
    return (  
        <div className="player-details">
            <h1>{player.username}</h1>
            <div className="player-details-links">
                <div className="startgg-link">
                    {/* eslint-disable-next-line */}
                    <a href={startgg + player.id} target="_blank">start.gg</a>
                </div>
                <Link to="/">go back</Link>
            </div>

            <SetTable player={player}/>
        </div>
    );
}
 
export default PlayerDetails;