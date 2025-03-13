import React from "react";

function AppointmentsList({ appointments, doctorsMap, mfMap }) {

    function formattedDate(d) {
        return `${d.getDate().toString().padStart(2, '0')}/${
            (d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()} ${
            d.getHours().toString().padStart(2, '0')}:${
            d.getMinutes().toString().padStart(2, '0')}`;
    }

    return (
        <div>
            <ul>
                {appointments.length > 0 ? (
                    appointments.sort((a, b) => new Date(a.date) - new Date(b.date)).map((appointment) => {
                        const doctor = doctorsMap[appointment.did];
                        return (
                            <li key={appointment.apid}>
                                {formattedDate(new Date(appointment.date))} - Doctor: {doctor ? doctor.name : "Unknown"} (MF: {mfMap[appointment.mfid]})
                            </li>
                        )
                    })
                ) : (
                    <p>No appointments available</p>
                )}
            </ul>
        </div>
    );
}

export default AppointmentsList;