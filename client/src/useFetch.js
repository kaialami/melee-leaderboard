import { useEffect, useState } from "react";

const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // let req = "/players"
        // if (window.location.pathname === "/dev") {
        //     req = window.location.pathname;
        // }

        fetch(url).then(res => {
            if (!res.ok) {
                throw Error("Failed to fetch data");
            }
            return res.json();
        }).then(data => {
            setData(data);
            setLoading(false);
            setError(null);
        }).catch(err => {
            setError(err.message);
            setLoading(false);
        })
    }, [url]);

    return { data, loading, error };
}

export default useFetch;