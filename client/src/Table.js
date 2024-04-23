import TableHead from "./TableHead.js";
import TableBody from "./TableBody.js";
import useFetch from "./useFetch.js";

const Table = () => {
    const { data: players, loading, error } = useFetch("/visible");

    return (
        <div className="table">
            {error && <p>{error}</p>}
            {loading && <p>Loading...</p>}
            {players && 
                <table className="leaderboard">
                    <TableHead />
                    <TableBody players={players}/>
                </table>
            }
        </div> 
    );
}
 
export default Table;