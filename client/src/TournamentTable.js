import TournamentForm from "./TournamentForm.js";

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
                        <td>Tournament</td>
                        <td>Event</td>
                        <td>Weekly?</td>
                        <td>Weight</td>
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
        </div>
    );
}
 
export default TournamentTable;