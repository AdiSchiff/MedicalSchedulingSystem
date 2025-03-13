import React, {useEffect, useState} from "react";
import ChooseForAppointment from "./chooseForAppontment";
import {useAppointments} from "./AppointmentsContext";

function BookNewAppointment({token, doctorsMap, mfMap, pid}) {
    const { bookedAppointments, setBookedAppointments } = useAppointments();
    const [selectedMFID, setSelectedMFID] = useState("");
    const [selectedDoctorId, setSelectedDoctorId] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [reset, setReset] = useState(true);

    useEffect(() => {
        getBookedAppointments();

    },[]);

    async function getBookedAppointments() {
        try {
            const res = await fetch('http://localhost:5000/api/Appointments/', {
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
                setBookedAppointments(data);
            }
        } catch (error) {
            alert(error);
        }
    }

    function book() {
        if (!selectedMFID || !selectedDoctorId || !selectedDate) {
            alert("Please select a Medical Field, Doctor, Date and Time before booking the appointment.");
            return;
        }
        bookAppointment();
        // Reset all the selections when a meeting was booked
        setReset(!reset)
    }

    async function bookAppointment() {
        const data = {
            did: selectedDoctorId,
            mfid: selectedMFID,
            date: selectedDate,
        }
        try {
            const res = await fetch('http://localhost:5000/api/Appointments/' + pid, {
                'method': 'post',
                'headers': {
                    'Content-Type': 'application/json',
                    "authorization": 'Bearer ' + token,
                },
                'body': JSON.stringify(data)
            })
            if (res.status === 409) {
                throw new Error('This appointment is not available')
            } else if (res.status !== 201) {
                throw new Error('Something went wrong')
            } else {
                alert("The appointment booked successfully")
                const result = await res.json();
                setBookedAppointments([...bookedAppointments, result])
            }
        } catch (error) {
            alert(error);
        }
    }

    return (
        <div>
            <h4>Select the details for your new appointment:</h4>
            <ChooseForAppointment reset={reset} showMedicalField={true} doctorsMap={doctorsMap} mfMap={mfMap} setSelectedDate={setSelectedDate}
                                  selectedDate={selectedDate} setSelectedMFID={setSelectedMFID} selectedMFID={selectedMFID}
                                  setSelectedDoctorId={setSelectedDoctorId} selectedDoctorId={selectedDoctorId}/>

            <button onClick={book} type="button" className="btn btn-success">
                Book Appointment
            </button>
        </div>
    );
}

export default BookNewAppointment;