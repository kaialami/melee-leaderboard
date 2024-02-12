import Credits from "./Credits.js";
import Table from "./Table.js";
import Title from "./Title.js";

const Home = () => {
    return (
        <div className="home">
            <Title />
            <Table />
            <Credits />
        </div>
    );
}
 
export default Home;