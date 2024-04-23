import Reset from "./Reset.js";
import Export from "./Export.js";
import Import from "./Import.js";

const TournamentOptions = () => {
    return (  
        <div className="dev-tournament-options">
            <Export />
            <Reset />
            <Import />
        </div>
    );
}
 
export default TournamentOptions;