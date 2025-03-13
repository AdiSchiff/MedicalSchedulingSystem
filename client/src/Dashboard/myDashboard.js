import React, {useEffect, useMemo, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAppointments} from "../Appointment/AppointmentsContext";
import AppointmentsList from "./appointmentsList";

function MyDashboard({token, pid}) {
    const navigate = useNavigate()
    const { futureAppointments, setFutureAppointments } = useAppointments();
    const [oldAppointments, setOld] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [mf, setMF] = useState([]);
    const now = new Date();

    useEffect(() => {
        getMyAppointments();
    },[futureAppointments]);

    useEffect(() => {
        getDoctors();
        getMF();
    },[]);

    const handleButtonClick = (action) => {
        if(action === 'cancel' && !futureAppointments){
            alert("There are no future appointments to cancel")
            return;
        }
        if(action === 'reschedule' && !futureAppointments){
            alert("There are no future appointments to reschedule")
            return;
        }
        navigate('/appointment', { state: { action, doctorsMap, mfMap, pid } });
    };

    const mfMap = useMemo(() => {
        return mf.reduce((acc, mfItem) => {
            acc[mfItem.mfid] = mfItem.speciality;
            return acc;
        }, {});
    }, [mf]);

    const doctorsMap = useMemo(() => {
        if (doctors && doctors.length > 0 && mfMap && Object.keys(mfMap).length > 0) {
            return doctors.reduce((acc, doctor) => {
                const specialties = doctor.mfids.map((mfid) => mfMap[mfid] || "Unknown");

                acc[doctor.did] = {
                    name: doctor.username,
                    specialties: specialties,
                    mfids: doctor.mfids,
                    details: doctor.details,
                };
                return acc;
            }, {});
        }
        return {};
    }, [doctors, mfMap]);

    async function getMyAppointments() {
        try {
            const res = await fetch('http://localhost:5000/api/Appointments/' + pid, {
                'method': 'get',
                'headers': {
                    'Content-Type': 'application/json',
                    "authorization": 'Bearer ' + token,
                },
            })
            if (res.status !== 200 && res.status !== 404) {
                throw new Error('Something went wrong')
            } else if(res.status == 200) {
                const data = await res.json();
                const old = data.filter(appointment => new Date(appointment.date) < now);
                const future = data.filter(appointment => new Date(appointment.date) >= now);

                setOld(old);
                setFutureAppointments(future);
            }
        } catch (error) {
            alert(error);
        }
    }

    async function getDoctors() {
        try {
            const res = await fetch('http://localhost:5000/api/Doctors/', {
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
                setDoctors(data);
            }
        } catch (error) {
            alert(error);
        }
    }

    async function getMF() {
        try {
            const res = await fetch('http://localhost:5000/api/MedFields/', {
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
                setMF(data);
            }
        } catch (error) {
            alert(error);
        }
    }

    return (
        <div>
            {/* Future Appointments List */}
            <h2>Upcoming Appointments:</h2>
            <AppointmentsList appointments={futureAppointments} doctorsMap={doctorsMap} mfMap={mfMap}/>

            {/* Past Appointments List */}
            <h2>Past Appointments:</h2>
            <AppointmentsList appointments={oldAppointments} doctorsMap={doctorsMap} mfMap={mfMap}/>

            <button onClick={() => handleButtonClick('cancel')} type="button" className="btn btn-danger">
                Cancel appointment
            </button>
            <button onClick={() => handleButtonClick('book')} type="button" className="btn btn-success">
                Book new appointment
            </button>
            <button onClick={() => handleButtonClick('reschedule')} type="button" className="btn btn-secondary">
                Reschedule appointment
            </button>
        </div>
    );
}

export default MyDashboard;