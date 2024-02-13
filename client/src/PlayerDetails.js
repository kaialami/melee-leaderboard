import { Link } from "react-router-dom";

const PlayerDetails = ({ player }) => {
    const startgg = "https://start.gg/user/";
    
    return (  
        <div className="player-details">
            <h1>{player.username}</h1>
            <div className="startgg-link">
                {/* eslint-disable-next-line */}
                <a href={startgg + player.id} target="_blank">start.gg</a>
            </div>
            <Link to="/">go back</Link>
        </div>
    );
}
 
export default PlayerDetails;