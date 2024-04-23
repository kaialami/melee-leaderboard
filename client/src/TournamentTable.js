import TournamentForm from "./TournamentForm.js";
import TournamentOptions from "./TournamentOptions.js";

const TournamentTable = ({ tournaments }) => {
    const url = "https://www.start.gg/tournament/";
    const urlEvent = "/event/";

    return (  
        <div className="dev-tournament">
            <h3>Tournaments</h3>
            <TournamentForm />
            <table className="dev-tournament-table">
                <thead>
                    <tr>
                        <th>Tournament</th>
                        <th>Event</th>
                        <th>Weekly?</th>
                        <th>Weight</th>
                    </tr>
                </thead>
                <tbody>
                    {tournaments.map(tournament => {
                        const name = tournament.tournamentName;
                        const event = tournament.eventName;
                        const weight = tournament.weight;

                        let isWeekly = "n";
                        if (tournament.isWeekly === 1) isWeekly = "y";

                        return (
                            <tr key={tournament.tournamentName}>
                                <td>
                                    {/* eslint-disable-next-line */}                                
                                    <a href={url + name + urlEvent + event} target="_blank">{name}</a>
                                </td>
                                <td>{event}</td>
                                <td className="cell-align-right">{isWeekly}</td>
                                <td className="cell-align-right">{weight}x</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <TournamentOptions />
        </div>
    );
}
 
export default TournamentTable;