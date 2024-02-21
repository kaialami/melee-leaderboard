import { Link } from "react-router-dom";

const NotFound = () => {
    return (  
        <div className="not-found">
            <h1>Page Not Found</h1>
            <Link to="/">home page</Link>
        </div>
    );
}
 
export default NotFound;