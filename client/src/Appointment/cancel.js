import React, {useState} from "react";
import {useAppointments} from "./AppointmentsContext";
import SelectAppointment from "./selectAppointment";

function CancelAppointment({token, doctorsMap, mfMap}) {
    const { futureAppointments, setFutureAppointments } = useAppointments();

    const [apid, setAPID] = useState("");
    const [selectedMFID, setSelectedMFID] = useState("");
    const [selectedDoctorId, setSelectedDoctorId] = useState("");
    const [selectedDate, setSelectedDate] = useState("");

    function validateAndCancel() {
        if (!selectedMFID || !selectedDoctorId || !selectedDate) {
            alert("Please select a Medical Field, Doctor, and Date before canceling the appointment.");
            return;
        }

        const confirmation = window.confirm("Are you sure you want to cancel this appointment?");
        if (confirmation) {
            cancelAppointment();
        }
    }

    async function cancelAppointment() {
        try {
            const res = await fetch('http://localhost:5000/api/Appointments/', {
                'method': 'post',
                'headers': {
                    'Content-Type': 'application/json',
                    "authorization": 'Bearer ' + token,
                },
                'body': JSON.stringify({ "apid": apid })
            })
            if (res.status !== 201) {
                throw new Error('Something went wrong')
            } else {
                alert("The appointment canceled successfully")
                const result = await res.json();
                setFutureAppointments(futureAppointments.filter(app => app.apid !== result.apid));
            }
        } catch (error) {
            alert(error);
        }
    }

    return (
        <div>
            <h4>Select the appointment you wish to cancel:</h4>
            <SelectAppointment doctorsMap={doctorsMap} mfMap={mfMap}
                               setAPID={setAPID}
                               setSelectedMFID={setSelectedMFID}
                               setSelectedDoctorId={setSelectedDoctorId}
                               setSelectedDate={setSelectedDate}/>
            <button onClick={validateAndCancel} type="button" className="btn btn-danger">
                Cancel Appointment
            </button>
        </div>
    );
}

export default CancelAppointment;