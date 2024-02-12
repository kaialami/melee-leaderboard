import { useParams } from "react-router-dom";
import useFetch from "./useFetch.js";
import PlayerDetails from "./PlayerDetails.js";

const Player = () => {
    const { id } = useParams();
    const { data: player, loading, error } = useFetch(`/player/${id}`);

    return (  
        <div className="player">
            { error && <p>{ error }</p>}
            { loading && <p>Loading...</p>}
            { player && <PlayerDetails player={player} />}
        </div>
    );
}
 
export default Player;