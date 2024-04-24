import { useEffect, useState } from "react";
import InvisibleTable from "./InvisibleTable.js";
import TournamentTable from "./TournamentTable.js";
import VisibleTable from "./VisibleTable.js";
import useFetch from "./useFetch.js";

const DevTables = () => {
    const { data: visible, loadingVisible, errorVisible } = useFetch(process.env.REACT_APP_API_URL + "/visible");
    const { data: invisible, loadingInvisible, errorInvisible } = useFetch(process.env.REACT_APP_API_URL + "/invisible");
    const { data: tournaments, loadingTournaments, errorTournaments } = useFetch(process.env.REACT_APP_API_URL + "/tournaments");

    const [error, setError] = useState(false);

    useEffect(() => {
        if ((errorVisible !== undefined || errorInvisible !== undefined || errorTournaments !== undefined)) {
            setError(true);
        }
    }, [errorVisible, errorInvisible, errorTournaments]);

    if (loadingVisible || loadingInvisible || loadingTournaments) {
        return (
            <div className="loading">
                <p>Loading...</p>
            </div>
        )
    }
    
    return (  
        <div className="dev-tables">
            {error && <p>Failed to fetch data</p>}
            {!error && tournaments && <TournamentTable tournaments={tournaments} />}
            <br /><br />
            {!error && visible && <VisibleTable players={visible}/>}
            <br /><br />
            {!error && invisible && <InvisibleTable players={invisible} />}
        </div>
    );
}
 
export default DevTables;