import { useHistory } from "react-router-dom";

const Reset = () => {
    const history = useHistory();

    const handleClick = () => {
        const answer = window.confirm("DANGER: This will completely erase all data. Export and save tournament URLs for backup.\nAre you sure you want to delete?");
        if (answer) {
            fetch("/reset-database", {
                method: "DELETE"
            }).then(res => {
                if (res.ok) {
                    history.go(0)
                } 
            });
        }
    }

    return (  
        <button className="dev-reset-database" onClick={handleClick}>Reset Database</button>
    );
}
 
export default Reset;