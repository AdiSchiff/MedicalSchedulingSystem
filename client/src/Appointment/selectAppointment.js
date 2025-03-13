import React, {useEffect, useMemo, useState} from "react";
import {useAppointments} from "./AppointmentsContext";

function SelectAppointment({ doctorsMap, mfMap, setAPID, setSelectedMFID, setSelectedDoctorId, setSelectedDate }) {
    const { futureAppointments } = useAppointments();
    const [selectedMFID, setLocalSelectedMFID] = useState("");
    const [selectedDoctorId, setLocalSelectedDoctorId] = useState("");
    const [selectedDate, setLocalSelectedDate] = useState("");

    // Filtered Medical Fields based on futureAppointments
    const availableMFs = useMemo(() => {
        let filteredMFs = Object.entries(mfMap).filter(([mfid]) =>
            futureAppointments.some(app => app.mfid === Number(mfid)));
        if (selectedDoctorId) {
            filteredMFs = filteredMFs.filter(([mfid]) =>
                futureAppointments.some(app => app.mfid === Number(mfid) && String(app.did) === selectedDoctorId));
        }
        if (selectedDate) {
            filteredMFs = filteredMFs.filter(([mfid]) =>
                futureAppointments.some(app => app.mfid === Number(mfid) && app.date === selectedDate));
        }
        return filteredMFs.map(([mfid, speciality]) => ({ mfid, speciality }));
    }, [selectedDoctorId, selectedDate, futureAppointments, mfMap]);

    // Filtered Doctors based on selected Medical Field or Date
    const availableDoctors = useMemo(() => {
        let filteredDoctors = Object.entries(doctorsMap).filter(([did]) =>
            futureAppointments.some(app => app.did === Number(did)));
        if (selectedMFID) {
            filteredDoctors = filteredDoctors.filter(([did, doctor]) =>
                doctor.mfids.includes(Number(selectedMFID)) && futureAppointments.some(app => app.did === Number(did) && app.mfid === Number(selectedMFID)));
        }
        if (selectedDate) {
            filteredDoctors = filteredDoctors.filter(([did]) =>
                futureAppointments.some(app => app.did === Number(did) && app.date === selectedDate));
        }
        return filteredDoctors.map(([did, doctor]) => ({ did, name: doctor.name }));
    }, [selectedMFID, selectedDate, futureAppointments, doctorsMap]);

    // Filtered Dates based on selected Doctor or Medical Field
    const availableDates = useMemo(() => {
        let filteredDates = futureAppointments;
        if (selectedDoctorId) {
            filteredDates = filteredDates.filter(app => String(app.did) === selectedDoctorId);
        }
        if (selectedMFID) {
            filteredDates = filteredDates.filter(app => String(app.mfid) === selectedMFID);
        }
        const uniqueDates = [];
        const dateSet = new Set();

        filteredDates.forEach(app => {
            const date = app.date;
            if (!dateSet.has(date)) {
                dateSet.add(date);
                uniqueDates.push({ date, apid: app.apid });
            }
        });
        return uniqueDates;
    }, [selectedDoctorId, selectedMFID, futureAppointments]);

    // Update apid when all fields are selected
    useEffect(() => {
        if (selectedMFID && selectedDoctorId && selectedDate) {
            const matchingAppointment = futureAppointments.find(
                app => String(app.mfid) === selectedMFID && String(app.did) === selectedDoctorId && (app.date) === selectedDate
            );
            if (matchingAppointment) {
                setAPID(matchingAppointment.apid);
            }
        }
        setSelectedDoctorId(selectedDoctorId);
        setSelectedDate(selectedDate);
        setSelectedMFID(selectedMFID);
    }, [selectedMFID, selectedDoctorId, selectedDate, futureAppointments, setAPID, setSelectedDoctorId, setSelectedDate, setSelectedMFID]);

    return (
        <div>
            {/* Medical Field selection */}
            <div className="input-group mb-3">
                <select className="form-select" onChange={(e) => setLocalSelectedMFID(e.target.value)} value={selectedMFID}>
                    <option value="">Medical Field</option>
                    {availableMFs.sort((a, b) => a.speciality.localeCompare(b.speciality))
                        .map(({ mfid, speciality }) => (
                            <option key={mfid} value={mfid}>{speciality}</option>
                        ))}
                </select>
            </div>

            {/* Doctor selection */}
            <div className="input-group mb-3">
                <select className="form-select" onChange={(e) => setLocalSelectedDoctorId(e.target.value)} value={selectedDoctorId}>
                    <option value="">Doctor</option>
                    {availableDoctors.sort((a, b) => a.name.localeCompare(b.name))
                        .map(({ did, name }) => (
                            <option key={did} value={did}>{name}</option>
                        ))}
                </select>
            </div>

            {/* Date selection */}
            <div className="input-group mb-3">
                <select className="form-select" onChange={(e) => setLocalSelectedDate(e.target.value)} value={selectedDate}>
                    <option value="">Date</option>
                    {availableDates.sort((a, b) => new Date(a.date) - new Date(b.date)).map(({ date }) => {
                        const d = new Date(date);
                        const formattedDate = `${d.getDate().toString().padStart(2, '0')}/${
                            (d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()} ${
                            d.getHours().toString().padStart(2, '0')}:${
                            d.getMinutes().toString().padStart(2, '0')}`;

                        return ( <option key={date} value={date}>{formattedDate}</option> );
                    })}
                </select>
            </div>
        </div>
    );
}

export default SelectAppointment;