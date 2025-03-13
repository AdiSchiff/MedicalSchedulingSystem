import React, {useEffect, useMemo, useState} from "react";
import {useAppointments} from "./AppointmentsContext";

function ChooseForAppointment({ reset, showMedicalField, doctorsMap, mfMap, setSelectedMFID, selectedMFID, setSelectedDoctorId, selectedDoctorId, setSelectedDate, selectedDate }) {
    const { bookedAppointments } = useAppointments();
    const [selectedDay, setSelectedDay] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const TimeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

    useEffect(() => {
        // Reset the time selection when the selected day changes
        setSelectedTime("");
    }, [selectedDay]);

    const bookedByDateDidMfid = useMemo(() => {
        return bookedAppointments.reduce((acc, appointment) => {
            const datePart = appointment.date.split("T")[0];
            const timePart = new Date(appointment.date).toISOString().split("T")[1].slice(0, 5);
            const key = `${datePart}*${appointment.mfid}*${appointment.did}`;
            acc[key] = (acc[key] || []).concat(timePart);
            return acc;
        }, {});
    }, [bookedAppointments]);

    const doctorsWithMFID = useMemo(() => {
        return Object.entries(doctorsMap)
            .filter(([did, doctor]) => doctor.mfids.includes(Number(selectedMFID)))
            .map(([did]) => Number(did));
    }, [doctorsMap, selectedMFID]);

    // Filtered Medical Fields based on futureAppointments
    const availableMFs = useMemo(() => {
        let filteredMFs = Object.entries(mfMap);
        if (selectedDoctorId) {
            const doctorMFIDs = doctorsMap[selectedDoctorId]?.mfids || [];
            filteredMFs = filteredMFs.filter(([mfid]) => doctorMFIDs.includes(Number(mfid)));
        }

        // Function to check if all doctors for a mfid are fully booked on a selectedDay
        const isFullyBookedByDay = (mfid) => {
            const doctorsMFID = Object.entries(doctorsMap)
                .filter(([did, doctor]) => doctor.mfids.includes(Number(mfid)))
                .map(([did]) => did);

            if (doctorsMFID.length === 0) return false; // If no doctors, don't filter out the MFID

            return doctorsMFID.every(did =>
                bookedByDateDidMfid[`${selectedDay}*${mfid}*${did}`]?.length >= TimeSlots.length
            );
        };

        if (selectedDay) {
            // Remove mfids where all associated doctors are fully booked on selectedDay
            filteredMFs = filteredMFs.filter(([mfid]) => !isFullyBookedByDay(mfid));
        }

        // Function to check if all doctors for a mfid are fully booked on a selectedDate
        const isFullyBookedByDate = (mfid) => {
            const doctorsMFID = Object.entries(doctorsMap)
                .filter(([did, doctor]) => doctor.mfids.includes(Number(mfid)))
                .map(([did]) => did);

            if (doctorsMFID.length === 0) return false; // If no doctors, don't filter out the MFID

            return doctorsMFID.every(did =>
                bookedAppointments.some(app => app.date === selectedDate && app.did === Number(did))
            );
        };

        if (selectedDate) {
            // Remove mfids where all associated doctors are fully booked on selectedDate
            filteredMFs = filteredMFs.filter(([mfid]) => !isFullyBookedByDate(mfid));
        }

        return filteredMFs.map(([mfid, speciality]) => ({ mfid, speciality }));
    }, [mfMap, selectedDoctorId, selectedDay, selectedDate, doctorsMap, bookedByDateDidMfid, bookedAppointments]);

    // Filtered Doctors based on selected Medical Field
    const availableDoctors = useMemo(() => {
        let filteredDoctors = Object.entries(doctorsMap);
        if (selectedMFID) {
            filteredDoctors = filteredDoctors.filter(([did, doctor]) =>
                doctor.mfids.includes(Number(selectedMFID)));
        }

        if (selectedDate) {
            filteredDoctors = filteredDoctors.filter(([did]) =>
                !bookedAppointments.some(app => app.date === selectedDate && app.did === Number(did))
            );
        }

        if (selectedDay) {
            filteredDoctors = filteredDoctors.filter(([did]) => {
                const doctorAppointments = bookedAppointments.filter(
                    app => app.date.split("T")[0] === selectedDay && app.did === Number(did)
                );
                return doctorAppointments.length < TimeSlots.length;
            });
        }

        return filteredDoctors.map(([did, doctor]) => ({ did, name: doctor.name }));
    }, [doctorsMap, selectedMFID, selectedDate, selectedDay, bookedAppointments]);

    const availableDays = useMemo(() => {
        const today = new Date();
        const oneYearLater = new Date();
        oneYearLater.setFullYear(today.getFullYear() + 1);

        const allDates = [];
        let currentDate = new Date(today);

        while (currentDate <= oneYearLater) {
            const clonedDate = new Date(currentDate);
            const formattedDate = clonedDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
            allDates.push(formattedDate);
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return allDates.filter(date => {
            if (selectedDoctorId) {
                // Construct the key correctly based on available data
                const doctorBookingKey = Object.keys(bookedByDateDidMfid).find(key => {
                    const [bookedDate, , did] = key.split("*"); // Ignore mfid if not selected
                    return bookedDate === date && did === selectedDoctorId;
                });

                // If the doctor has a booking and reached the limit, exclude this date
                if (doctorBookingKey && bookedByDateDidMfid[doctorBookingKey].length >= TimeSlots.length) {
                    return false;
                }
            }

            if (selectedMFID) {
                // If all doctors with this MFID are fully booked on this date, exclude it
                return !doctorsWithMFID.every(did =>
                    bookedByDateDidMfid[`${date}*${selectedMFID}*${did}`] &&
                    bookedByDateDidMfid[`${date}*${selectedMFID}*${did}`].length >= TimeSlots.length
                );
            }
            return true;
        });

    }, [selectedDoctorId, selectedMFID, bookedByDateDidMfid, doctorsWithMFID]);


    const availableTimeSlots = useMemo(() => {
        const getLocalTime = (date) => new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
        let bookedSlots = [];

        if (selectedDoctorId) {
            bookedSlots = bookedAppointments.filter(app => app.date.split("T")[0] === selectedDay && app.did === Number(selectedDoctorId))
                .map(app => getLocalTime(app.date));
        }

        if (selectedMFID) {
            const mfidBookedSlots = bookedAppointments.filter(app => app.date.split("T")[0] === selectedDay && doctorsWithMFID.includes(app.did))
                .map(app => getLocalTime(app.date));
            // Now keep only the slots that appear as many times as there are doctors in doctorsWithMFID
            const requiredBookedSlots = mfidBookedSlots.filter(slot => {
                return mfidBookedSlots.filter(s => s === slot).length === doctorsWithMFID.length;
            });
            bookedSlots = [...new Set([...bookedSlots, ...requiredBookedSlots])];
        }

        // Get current time if selected day is today
        const now = new Date();
        const currentTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
        const today = new Date().toISOString().split("T")[0];


        return TimeSlots.filter(slot => !bookedSlots.includes(slot)&&
            (selectedDay !== today || slot >= currentTime));
    }, [selectedDoctorId, selectedMFID, bookedAppointments, selectedDay, doctorsWithMFID]);

    // Update date when day and time fields are selected
    useEffect(() => {
        if (selectedTime && selectedDay) {
            const combinedDate = new Date(`${selectedDay}T${selectedTime}`);
            setSelectedDate(combinedDate.toISOString());
        } else {
            setSelectedDate("")
        }
    }, [selectedTime, selectedDay, setSelectedDate]);

    // Reset the selection fields when the action happened
    useEffect(() => {
        setSelectedTime("")
        setSelectedDate("")
        setSelectedMFID("")
        setSelectedDay("")
        setSelectedDoctorId("")
    }, [reset, setSelectedDate, setSelectedDoctorId, setSelectedMFID]);

    return (
        <div>
            {showMedicalField && (
                <div className="input-group mb-3">
                    <select className="form-select" onChange={(e) => setSelectedMFID(e.target.value)} value={selectedMFID}>
                        <option value="">Medical Field</option>
                        {availableMFs
                            .sort((a, b) => a.speciality.localeCompare(b.speciality))
                            .map(({ mfid, speciality }) => (
                                <option key={mfid} value={mfid}>{speciality}</option>
                            ))}
                    </select>
                </div>
            )}
            {/* Doctor selection */}
            <div className="input-group mb-3">
                <select className="form-select" onChange={(e) => setSelectedDoctorId(e.target.value)} value={selectedDoctorId}>
                    <option value="">Doctor</option>
                    {availableDoctors.sort((a, b) => a.name.localeCompare(b.name))
                        .map(({ did, name }) => (
                            <option key={did} value={did}>{name}</option>
                        ))}
                </select>
            </div>

            {/* Day Selection */}
            <div className="input-group mb-3">
                <select className="form-select" onChange={(e) => setSelectedDay(e.target.value)} value={selectedDay}>
                    <option value="">Date</option>
                    {availableDays.map((date) => {
                        const d = new Date(date);
                        const formattedDate = `${d.getDate().toString().padStart(2, '0')}/${
                            (d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;

                        return <option key={date} value={date}>{formattedDate}</option>;
                    })}
                </select>
            </div>

            {/* Time selection */}
            <div className="input-group mb-3">
                <select className="form-select" onChange={(e) => setSelectedTime(e.target.value)} disabled={!selectedDay} value={selectedTime}>
                    <option value="">Time</option>
                    {availableTimeSlots.map((timeSlot) => {
                        return (
                            <option key={timeSlot} value={timeSlot}>{timeSlot}</option>
                        );
                    })}
                </select>
            </div>
        </div>
    );
}

export default ChooseForAppointment;