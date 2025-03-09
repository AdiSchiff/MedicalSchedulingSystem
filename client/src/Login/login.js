import './login.css'
import {useState} from "react";
import Part1 from "./part1";
import Part2 from "./part2";

function Login({setToken, setPhone}) {
    const [isFlagOn, setIsFlagOn] = useState(true);
    const [phone, setPhoneNum] = useState("");

    return (
        <div className="container">
            <div className="title">
                Welcome to SHEBA's Medical Scheduling System
            </div>
            <div className="d-flex justify-content-center h-100 align-items-center vh-100">
                <div className="card">
                    <div className="card-header">
                        Sign In
                    </div>

                    {/* Conditional rendering of Part1 and Part2 */}
                    {isFlagOn ? (
                        <Part1 setPhone={setPhoneNum} setIsFlagOn={setIsFlagOn}/>
                    ) : (
                        <Part2 setToken={setToken} setIsFlagOn={setIsFlagOn} setPhone={setPhone} phone={phone}/>
                        )}
                </div>
            </div>
        </div>
    );
}

export default Login;