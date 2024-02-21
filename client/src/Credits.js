import { Link } from "react-router-dom";

const Credits = () => {
    return ( 
        <div className="credits">
            <div className="credits-line">
                <a className="twitter" href="https://twitter.com/UBCMelee"> twitter </a>
                |
                <a className="discord" href="https://discord.gg/dzHTudRSrN"> discord </a>
                |
                <a className="facebook" href="https://www.facebook.com/groups/368908883137347"> facebook </a>
            </div>
            <div className="credits-line">
                <Link className="dev-login"to="/dev-login"> dev login </Link>
                |
                <Link className="docs" to="/docs"> documentation </Link>
            </div>
            <div className="credits-line">
                by <a href="https://github.com/kaialami/melee-leaderboard">kai alami</a>
            </div>
        </div>
     );
}
 
export default Credits;