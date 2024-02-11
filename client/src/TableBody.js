import { useState } from "react";

const TableBody = () => {
    const [player, setPlayer] = useState("");

    const handleClick = () => {
        setPlayer("kai");
    }

    return ( 
        <>
        <tbody>
            <tr>
                <td>1</td>
                <td className="player"><a href="https://www.start.gg/user/19c63f43" target="_blank">kai</a></td>
                <td>1500</td>
                <td className="sets">12</td>
                <td className="sets">15</td>
            </tr>
        </tbody>
        </>
     );
}
 
export default TableBody;