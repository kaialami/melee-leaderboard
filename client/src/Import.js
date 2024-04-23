import { useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";

const Import = () => {
    const history = useHistory();
    const { register, handleSubmit } = useForm();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        
        const file = data.file[0];
        const text = await file.text();
        const body = JSON.stringify({content: text});

        fetch("/import", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: body
        }).then(res => {
            if (res.ok) {
                setLoading(false);
                history.go(0);
            } else {
                throw Error();
            }
        }).catch(err => {
            window.alert("Error parsing file - make sure it follows this format for each URL: \n<start.gg url> <weight> <newline>");
        })
    }

    return (  
        <div className="dev-import">
            <form onSubmit={handleSubmit(onSubmit)}>
                <input {...register("file")} required type="file" accept=".txt"/>
                <input type="submit" value="Import URLs"/>
            </form>
            {loading && 
                <div>
                    <div className="loader"></div>
                    <p>Updating database - page will reload shortly</p>
                </div>}
        </div>
    );
}
 
export default Import;