import useFetch from "./useFetch.js";

const SetTable = ({player}) => {
    const startgg = "https://start.gg/tournament/";
    const urlSuffix = "/event/melee-singles";
    const { data: sets, loading, error } = useFetch(process.env.REACT_APP_API_URL + `/sets/${player.id}`);

    return (  
        <div className="set-table">
            { loading && <p>loading...</p> }
            { error && <p>{error}</p> }
            { sets && 
                <table>
                    <thead>
                        <tr>
                            <th>Vs.</th>
                            <th>Tournament</th>
                            <th>Round</th>
                            <th>Elo Change</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sets.map(set => {
                            let otherName = set.p2name;
                            let change = set.eloChange;

                            if (player.id === set.p2) {
                                otherName = set.p1name;
                                change = change * -1;
                            }

                            if (change < 0 && set.placement === 1) {
                                change = " ";
                            }

                            if (change > 0) change = "+" + change;

                            let posneg = "pos";
                            if (change < 0) posneg = "neg";

                            let placement = "not-placement";
                            if (set.placement === 1) placement = "placement";
                            
                            return (
                                <tr key={set.id} className={placement}>
                                    <td>{otherName}</td>
                                    <td>
                                    {/* eslint-disable-next-line */}
                                        <a href={startgg + set.tournament + urlSuffix} target="_blank">{set.tournament}</a>
                                    </td>
                                    <td>{set.round}</td>
                                    <td className={"cell-align-right " + posneg}>{change}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            }
        </div>
    );
}
 
export default SetTable;