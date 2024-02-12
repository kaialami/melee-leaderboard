const PlayerDetails = ({ player }) => {
    const startgg = "https://start.gg/user/";
    
    return (  
        <div className="player-details">
            <h1>{player.username}</h1>
            {/* eslint-disable-next-line */}
            <a href={startgg + player.id} target="_blank">start.gg</a>
        </div>
    );
}
 
export default PlayerDetails;