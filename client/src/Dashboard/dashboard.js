import {useEffect, useState} from "react";
import NewDashboard from "./newDashboard";
import MyDashboard from "./myDashboard";
import {useLocation} from "react-router-dom";

function Dashboard({token, phone}) {
    const location = useLocation();
    const { pid } = location.state || {};
    const [username, setUsername] = useState("");
    const [pID, setPID] = useState("");
    const [isNew, setIsNew] = useState(true);
    const [family, setFamily] = useState(true);

    useEffect(() => {
            getUserDetails();
        },[]);

    async function getUserDetails() {
        try {
            const res = await fetch(process.env.REACT_APP_API_URL + '/api/Users/' + phone, {
                'method': 'get',
                'headers': {
                    'Content-Type': 'application/json',
                    "authorization": 'Bearer ' + token,
                },
            })
            if (res.status !== 200) {
                throw new Error('Something went wrong')
            } else {
                const data = await res.json();
                setUsername(data.username);
                setIsNew(data.isNew);
                setFamily(data.family);
                if(pid){
                    setPID(pid)
                } else {
                    setPID(data.pid);
                }
            }
        } catch (error) {
            alert(error);
        }
    }

    return (
        <div className="container">
            {/* Conditional rendering of Part1 and Part2 */}
            {isNew ? (
                <NewDashboard username={username} setIsNew={setIsNew}/>
            ) : (
                <MyDashboard token={token} setPID={setPID} pid={pID} family={family}/>
            )}
        </div>
    );
}

export default Dashboard;