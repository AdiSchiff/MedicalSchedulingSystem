import {useEffect, useState} from "react";
import NewDashboard from "./newDashboard";
import MyDashboard from "./myDashboard";

function Dashboard({token, phone}) {
    const [username, setUsername] = useState("");
    const [pid, setPID] = useState("");
    const [isNew, setIsNew] = useState(true);

    useEffect(() => {
            getUserDetails();
        },[]);

    async function getUserDetails() {
        try {
            const res = await fetch('http://localhost:5000/api/Users/' + phone, {
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
                setPID(data.pid);
                setIsNew(data.isNew);
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
                <MyDashboard token={token} pid={pid}/>
            )}
        </div>
    );
}

export default Dashboard;