import React, {useEffect, useState} from "react";
import {useAppointments} from "./AppointmentsContext";
import SelectAppointment from "./selectAppointment";
import ChooseForAppointment from "./chooseForAppontment";

function RescheduleAppointment({token, doctorsMap, mfMap, pid}) {
    const { futureAppointments, setFutureAppointments, bookedAppointments, setBookedAppointments } = useAppointments();
    const [apid, setAPID] = useState("");
    const [selectedMFID, setSelectedMFID] = useState("");
    const [selectedDoctorId, setSelectedDoctorId] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedNewDid, setSelectedNewDid] = useState("");
    const [selectedNewDate, setSelectedNewDate] = useState("");
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

    function validateAndReschedule() {
        if (!selectedMFID || !selectedDoctorId || !selectedDate || !selectedNewDid || !selectedNewDate) {
            alert("Please select all the selection Fields.");
            return;
        }

        const confirmation = window.confirm("Are you sure you want to reschedule this appointment?");
        if (confirmation) {
            bookAppointment();
            cancelAppointment();
            // Reset all the selections when a meeting was booked
            setSelectedMFID("");
            setSelectedDoctorId("");
            setSelectedDate("");
            setSelectedNewDid("");
            setSelectedNewDate("");
            setReset(!reset)
            alert("The appointment rescheduled successfully")
        }
    }

    async function bookAppointment() {
        const data = {
            did: selectedNewDid,
            mfid: selectedMFID,
            date: selectedNewDate,
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
                console.log("The appointment booked successfully")
                const result = await res.json();
                setBookedAppointments([...bookedAppointments, result])
                setFutureAppointments([...futureAppointments, result])
            }
        } catch (error) {
            alert(error);
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
                console.log("The appointment canceled successfully")
                const result = await res.json();
                setFutureAppointments(futureAppointments.filter(app => app.apid !== result.apid));
                setBookedAppointments(bookedAppointments.filter(app => app.apid !== result.apid));
            }
        } catch (error) {
            alert(error);
        }
    }

    return (
        <div>
            <h4>Select the appointment you wish to reschedule:</h4>
            <SelectAppointment reset={reset} doctorsMap={doctorsMap} mfMap={mfMap} setAPID={setAPID} setSelectedMFID={setSelectedMFID}
                               setSelectedDoctorId={setSelectedDoctorId} setSelectedDate={setSelectedDate}/>

            <h4>Update your appointment details:</h4>
            <ChooseForAppointment reset={reset} showMedicalField={false} doctorsMap={doctorsMap} mfMap={mfMap}
                                  setSelectedMFID={setSelectedMFID} selectedMFID={selectedMFID}
                                  setSelectedDate={setSelectedNewDate} selectedDate={selectedNewDate}
                                  setSelectedDoctorId={setSelectedNewDid}  selectedDoctorId={selectedNewDid}/>

            <button onClick={validateAndReschedule} type="button" className="btn btn-secondary">
                Reschedule Appointment
            </button>
        </div>
    );
}

export default RescheduleAppointment;