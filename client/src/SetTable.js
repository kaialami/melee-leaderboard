import { useEffect, useState } from "react";
import useFetch from "./useFetch.js";

const SetTable = ({player}) => {
    const startgg = "https://start.gg/tournament/";
    const urlSuffix = "/event/melee-singles";
    const { data: sets, loading, error } = useFetch(`/sets/${player.id}`);

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
                            let other = set.p2;
                            let otherName = set.p2name;
                            let change = set.eloChange;

                            if (player.id === set.p2) {
                                other = set.p1;
                                otherName = set.p1name;
                                change = change * -1;
                            }

                            if (change < 0 && set.placement === 1) {
                                change = " ";
                            }

                            let posneg = "pos";
                            if (change < 0) posneg = "neg";
                            
                            return (
                                <tr key={set.id}>
                                    <td>{otherName}</td>
                                    <td>
                                        <a href={startgg + set.tournament + urlSuffix} target="_blank">{set.tournament}</a>
                                    </td>
                                    <td>{set.round}</td>
                                    <td className={"elo " + posneg}>{change}</td>
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