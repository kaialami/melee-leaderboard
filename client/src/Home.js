import Credits from "./Credits.js";
import Table from "./Table.js";
import Title from "./Title.js";

const Home = () => {
    const title = "UBC Melee Leaderboard";
    return (
        <div className="home">
            <Title title={title}/>
            <Table dev={false}/>
            <Credits />
        </div>
    );
}
 
export default Home;