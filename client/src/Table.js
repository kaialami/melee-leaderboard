import TableHeader from "./TableHead.js";
import TableBody from "./TableBody.js";
import useFetch from "./useFetch.js";

const Table = () => {
    const { data: players, loading, error } = useFetch("/players");

    return (
        <div className="table">
            {error && <p>{error}</p>}
            {loading && <p>Loading...</p>}
            <table className="leaderboard">
                <TableHeader />
                {players && <TableBody players={players}/>}
            </table>
        </div> 
    );
}
 
export default Table;