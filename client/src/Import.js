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

        fetch(process.env.REACT_APP_API_URL + "/import", {
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
            setLoading(false);
            window.alert("Error parsing file - make sure it follows this format for each URL: \n<start.gg url> <weight> <newline>");
        })
    }

    return (  
        <div className="dev-import">
            <form onSubmit={handleSubmit(onSubmit)}>
                <input {...register("file")} required type="file" accept=".txt" id="file" className="file-input"/>
                <input type="submit" value="Upload"/>
            </form>
            {loading && 
                <div>
                    <div className="loader"></div>
                    <p>Updating database</p>
                    <p>Page will reload when done - may take a while...</p>
                </div>} 
        </div>
    );
}
 
export default Import;