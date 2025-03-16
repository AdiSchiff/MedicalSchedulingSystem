import React, {useState} from "react";
import {useNavigate} from "react-router-dom";

function Part2({setToken, setIsFlagOn, setPhone, phone}) {
    const navigate = useNavigate()
    const [otp, setOTP] = useState("");

    const handleOTP = (e) => {
        setOTP(e.target.value);
    }

    const setFlag = (e) => {
        setIsFlagOn(true);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!otp) {
            alert("OTP field is required")
            return;
        }
        const otpFormat = /^\d{4}$/.test(otp);
        if (!otpFormat) {
            alert("OTP is not in the correct format (e.g., 4 digits number)");
            return;
        }
        const data = {
            "phone": phone,
            "otp": otp,
        }
        try {
            const res = await fetch(process.env.REACT_APP_API_URL + '/api/Tokens/otp', {
                'method': 'post',
                'headers': {
                    'Content-Type': 'application/json',
                },
                'body': JSON.stringify(data)
            })
            const token = await res.text();
            if (res.status !== 201) {
                throw new Error('Invalid OTP')
            }  else {
                setToken(token)
                setPhone(phone)
                navigate(`/dashboard`);
            }
        } catch (error) {
            alert(error);
        }
    };


    return (
        <div className="card-body">
            <form onSubmit={handleSubmit}>
                {/*OTP input*/}
                <div className="input-group form-group">
                    <input type="text" className="form-control" placeholder="Enter OTP"
                           value={otp} onChange={handleOTP}></input>
                </div>
                {/*otp button*/}
                <div className="input-group form-group">
                    <input type="submit" value="Log in" className="btn btn-primary float-right"></input>
                </div>
                <button className="linkBtn" onClick={setFlag} >Back</button>
            </form>
        </div>
    );
}

export default Part2;