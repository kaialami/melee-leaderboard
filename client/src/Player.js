import { useParams } from "react-router-dom";
import useFetch from "./useFetch.js";
import PlayerDetails from "./PlayerDetails.js";
import { useEffect, useState } from "react";
import NotFound from "./NotFound.js";

const Player = () => {
    const { id } = useParams();
    const { data: player, loading, error } = useFetch(`/player/${id}`);
    const [forbidden, setForbidden] = useState(false);

    useEffect(() => {
        if (player && player.visible === 0) {
            setForbidden(true);
        } 
    }, [player]);

    if (forbidden || error) {
        return (
            <NotFound />
        )
    }

    return (  
        <div className="player">
            { loading && <p>Loading...</p>}
            { player && <PlayerDetails player={player} />}
        </div>
    );
}
 
export default Player;