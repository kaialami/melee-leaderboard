import { useState } from "react";
import { Link } from "react-router-dom";
import useFetch from "./useFetch.js";
import Table from "./Table.js";

const Dev = () => {
 
    return (
        <div className="dev">
            <h1>Developer</h1>
            <div  className="home-link">
                <Link to="/">log out</Link>
            </div>
            <Table />
        </div>
    );
}
 
export default Dev;