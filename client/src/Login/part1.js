import React, {useState} from "react";

function Part1({setPhone, setIsFlagOn}) {

    const [phone, setPhoneNum] = useState("");

    const handlePhone = (e) => {
        setPhoneNum(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!phone) {
            alert("Phone number field is required")
            return;
        }
        const phoneFormat = /^05\d{8}$/.test(phone);
        if (!phoneFormat) {
            alert("Phone number is not in the correct format (e.g., 0521234567)");
            return;
        }
        const data = {
            "phone": phone,
        }
        try {
            const res = await fetch(process.env.REACT_APP_API_URL + '/api/Tokens', {
                'method': 'post',
                'headers': {
                    'Content-Type': 'application/json',
                },
                'body': JSON.stringify(data)
            })
            const result = await res.text();
            if (res.status !== 201) {
                throw new Error('Incorrect phone number')
            }  else {
                setPhone(phone)
                setIsFlagOn(false)
                console.log(result)
            }
        } catch (error) {
            alert(error);
        }
    };


    return (
        <div className="card-body">
            <form onSubmit={handleSubmit}>
                {/*phone input*/}
                <div className="input-group form-group">
                    <input type="text" className="form-control" placeholder="Enter phone number"
                           value={phone} onChange={handlePhone}></input>
                </div>
                {/*otp button*/}
                <div className="input-group form-group">
                    <input type="submit" value="Get OTP" className="btn btn-primary float-right"></input>
                </div>
            </form>
        </div>
    );
}

export default Part1;