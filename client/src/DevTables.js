import InvisibleTable from "./InvisibleTable.js";
import VisibleTable from "./VisibleTable.js";
import useFetch from "./useFetch.js";

const DevTables = ({ players }) => {
    const {data: invisible, error } = useFetch("/invisible");
    return (  
        <div className="dev-tables">
            <VisibleTable players={players}/>
            <br />
            {error && <p>{error}</p>}
            {invisible && <InvisibleTable />}
        </div>
    );
}
 
export default DevTables;