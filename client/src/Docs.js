import { Link } from "react-router-dom";

const Docs = () => {
    return (  
        <div className="docs">
            <h1>Documentation</h1>
            <Link to="/">home page</Link>
            <p>This leaderboard tracks entrants in the UBC melee community. Tournaments considered for the ranking include UBC weeklies, UBC-hosted regionals like Janairy 2023, and our region's only major, Battle of BC. </p>
            <p>Tournament data is retrieved through the <a href="https://developer.start.gg/docs/intro/">start.gg API</a>. Elo is calculated using the standard chess elo formula. Read more <a href="https://stanislav-stankovic.medium.com/elo-rating-system-6196cc59941e">here</a>. The important part is that for each set completed in chronological order, there is a calculated elo change based on the difference in rating between the two players, and the difference between the expected and actual outcomes of the set. This elo change is added to the winner's rating and subtracted from the loser's. Game counts are not considered. Basically, you win more for beating a higher rated opponent and lose more for losing to a lower rated oponent. Elo changes are halved for losers bracket sets and have multipliers depending on the scale of the tournament: weeklies are 1x, regionals are 2x and majors are 3x. </p>
            <p>By default, anyone who has attended one UBC melee weekly and has played at least 5 sets will be displayed on the leaderboard (this number may be changed in the future). Everyone begins at the minimum elo of 1000. Until you win 5 sets, you are in placements; no points are lost on either side so long as at least one player is in placements. This is to help mitigate the case when you run into Cody Schwab in Winner's Round 1 at BoBC and lose a million points since he was unrated before the set. </p>
            <p>This is NOT meant to be a definitive ranking of all entrants. It is meant to be light-hearted and fun and low stakes. Please don't attach your skill or self-worth to the imaginary number tied to your name. The algorithm is nowhere close to perfect and is supposed to be a vary vague approximation of skill. If you feel uncomfortable being displayed on the leaderboard, message @kaibiscus on discord to opt out of the leaderboard. I'm sorry if you feel like you're lower than you should be on the leaderboard. I tried to tweak the parameters to get a relatively decent ranking and I think this is close to as good as I can get without getting super complicated. I swear I'm not intentionally sabotaging your reputation :P</p>
            <p>Stay tuned for September. There may be prizes avaialable for those who rank at the top of leaderboard by the end of a school term...</p>
            <p>by <a href="https://github.com/kaialami/melee-leaderboard">kai alami</a></p>
        </div>
    );
}
 
export default Docs;