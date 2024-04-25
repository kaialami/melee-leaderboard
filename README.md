# UBC Melee Leaderboard

This leaderboard tracks entrants in the UBC melee community. Tournaments considered for the ranking include UBC weeklies, UBC-hosted regionals like Janairy 2023, and our region's only major, Battle of BC. 

Tournament data is retrieved through the [start.gg API](https://developer.start.gg/docs/intro/). Elo is calculated using the standard chess elo formula. Read more [here](https://stanislav-stankovic.medium.com/elo-rating-system-6196cc59941e). The important part is that for each set completed in chronological order, there is a calculated elo change based on the difference in rating between the two players, and the difference between the expected and actual outcomes of the set. This elo change is added to the winner's rating and subtracted from the loser's. Game counts are not considered. Basically, you win more for beating a higher rated opponent and lose more for losing to a lower rated oponent. Elo changes are halved for losers bracket sets and have multipliers depending on the scale of the tournament: weeklies are 1x, regionals are 2x and majors are 3x. 

By default, anyone who has attended one UBC melee weekly and has played at least 5 sets will be displayed on the leaderboard (this number may be changed in the future). Everyone begins at the minimum elo of 1000. Until you win 5 sets, you are in placements; no points are lost on either side so long as at least one player is in placements. This is to help mitigate the case when you run into Cody Schwab in Winner's Round 1 at BoBC and lose a million points since he was unrated before the set. 

This is NOT meant to be a definitive ranking of all entrants. It is meant to be light-hearted and fun and low stakes. Please don't attach your skill or self-worth to the imaginary number tied to your name. The algorithm is nowhere close to perfect and is supposed to be a vary vague approximation of skill. If you feel uncomfortable being displayed on the leaderboard, message @kaibiscus on discord to opt out of the leaderboard. I'm sorry if you feel like you're lower than you should be on the leaderboard. I tried to tweak the parameters to get a relatively decent ranking and I think this is close to as good as I can get without getting super complicated. I swear I'm not intentionally sabotaging your reputation :P

Stay tuned for September. There may be prizes avaialable for those who rank at the top of leaderboard by the end of a school term...

For admins - there is a simple interface for adding new tournaments to the database and managing the database of entrants through the website. DM for info.

by kai alami

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).  

Deployed via [Railway](https://railway.app/).

