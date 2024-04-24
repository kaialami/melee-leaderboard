import { useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";

const TournamentForm = () => {
    const { register, handleSubmit } = useForm();
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState(false);
    const history = useHistory();

    const onSubmit = (data) => {
        const weight = parseInt(data.weight);
        let type = "Weekly";
        if (weight === 2) type = "Regional";
        else if (weight === 3) type = "Major";

        const answer = window.confirm("Add " + data.url + " as a " + type +"? (" + weight + "x elo multiplier)");
        
        if (answer) {
            setServerError(false);
            setLoading(true);
    
            let isWeekly = 0;
            if (weight === 1) isWeekly = 1;

            const body = JSON.stringify({
                url: data.url,
                isWeekly: isWeekly, 
                weight: weight});

            fetch(process.env.REACT_APP_API_URL + "/add-tournament", {
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
                setServerError(true);
                setLoading(false);
            });
        }
    }

    return (  
        <div className="dev-tournament-form">
            {loading && 
            <div>
                <div className="loader"></div>
                <p>Updating database</p>
                <p>Page will reload when done - may take a while...</p>
            </div>} 
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