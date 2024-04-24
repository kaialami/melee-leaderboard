import useFetch from "./useFetch.js";

const Export = () => {
    const startgg = "https://www.start.gg/tournament/";
    const { data: tournaments } = useFetch(process.env.REACT_APP_API_URL + "/export");

    const handleClick = () => {
        if (tournaments) {
            let exportString = "";
            for (const tournament of tournaments) {
                exportString += startgg;
                exportString += tournament.tournamentName;
                exportString += "/event/";
                exportString += tournament.eventName;
                exportString += " " + tournament.weight;
                exportString += "\n";
            }

            // https://stackoverflow.com/questions/44656610/download-a-string-as-txt-file-in-react 
            // downloading string as txt 
            const element = document.createElement("a");
            const file = new Blob([exportString]);
            element.href = URL.createObjectURL(file);
            element.download = "tournament-urls.txt";
            document.body.appendChild(element);
            element.click();
        }
    }

    return (  
        <button className="dev-export" onClick={handleClick}>Download URLs</button>
    );
}
 
export default Export;