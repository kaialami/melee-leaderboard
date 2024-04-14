import VisibleTable from "./VisibleTable.js";

const DevTables = ({ players }) => {
    return (  
        <div className="dev-tables">
            <VisibleTable players={players}/>
        </div>
    );
}
 
export default DevTables;