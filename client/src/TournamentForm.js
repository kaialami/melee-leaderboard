import { useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";

const TournamentForm = () => {
    const { register, handleSubmit } = useForm();
    const [loading, setLoading] = useState(false);
    const [urlError, setUrlError] = useState(false);
    const [serverError, setServerError] = useState(false);
    const history = useHistory();

    const onSubmit = (data) => {
        const weight = parseInt(data.weight);
        let type = "Weekly";
        if (weight === 2) type = "Regional";
        else if (weight === 3) type = "Major";

        const answer = window.confirm("Add " + data.url + " as a " + type +"? (" + weight + "x elo multiplier)");
        
        if (answer) {
            setUrlError(false);
            setServerError(false);
            setLoading(true);
    
            const { tournament, event, error } = parseUrl(data.url);
            console.log(error);
            if (!error) {
                let isWeekly = 0;
                if (weight === 1) isWeekly = 1;
    
                const body = JSON.stringify({
                    tournament: tournament, 
                    event: event, 
                    isWeekly: isWeekly, 
                    weight: weight});
    
                fetch("/add-tournament", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: body
                }).then(res => {
                    if (res.ok) {
                        history.go(0);
                    } else {
                        setServerError(true);
                        setLoading(false);
                    }
                }).catch(err => {
                    console.log(err);
                    setServerError(true);
                    setLoading(false);
                })
            } else {
                setUrlError(true);
                setLoading(false);
            }
        }
    }

    const parseUrl = (url) => {
        let tournament = "";
        let event = "";
        let error = false;
        
        let prefix = "https://www.start.gg/tournament/";

        if (!matches(url, prefix)) {
            error = true;
            return { tournament, event, error }
        };

        tournament = url.substring(prefix.length);
        tournament = tournament.substring(0, tournament.indexOf("/"));
        prefix = prefix + tournament + "/event/";

        if (!matches(url, prefix)) {
            error = true;
            return { tournament, event, error }
        };

        event = url.substring(prefix.length);

        return { tournament, event, error };
    }

    const matches = (url, prefix) => {
        const urlPrefix = url.substring(0, prefix.length);
        return prefix === urlPrefix;
    }

    return (  
        <div className="dev-tournament-form">
            {loading && <p>Loading... page will reload shortly</p>}
            {urlError && <p>Invalid start.gg url</p>}
            {serverError && <p>Server Error - double check URL</p>}
            <form onSubmit={handleSubmit(onSubmit)}>
                <input {...register("url")} type="text" className="dev-tournament-form-url" required placeholder="https://www.start.gg/tournament/<name>/event/melee-singles" />
                <select {...register("weight")}>
                    <option value="1">Weekly (1x)</option>
                    <option value="2">Regional (2x)</option>
                    <option value="3">Major (3x)</option>
                </select>
                <input type="submit" value="Add Tournament"/>
            </form>
        </div>
    );
}
 
export default TournamentForm;