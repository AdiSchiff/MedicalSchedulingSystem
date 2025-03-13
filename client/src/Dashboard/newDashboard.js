import React from "react";

function NewDashboard({ username, setIsNew }) {

    return (
        <div>
            {/*<button className="linkBtn" onClick={() => setIsNew(false)}>X</button>*/}
            <h2>Dear {username} welcome to Sheba's medical scheduling system!</h2>
            <p>Your health is our priority. Easily book, manage, and track your medical appointments with just a few clicks.</p>
            <div>
                <h4>Get Started:</h4>
                <ul className="list-unstyled text-start d-inline-block">
                    <li>🔹 <strong>Book Your First Appointment</strong> – Click the "Book new appointment" button, choose a
                        medical field, select a doctor, and pick a convenient time.
                    </li>
                    <li>🔹 <strong>Explore Our Services</strong> – View your upcoming appointments, access your
                        appointment history, learn about our doctors, and more.
                    </li>
                    <li>🔹 <strong>Manage Your Appointments</strong> – Easily reschedule or cancel appointments whenever
                        needed, book new appointments, all in one place.
                    </li>
                </ul>

                <p className="mt-3">Click below to manage your appointments and take control of your healthcare
                    today!</p>
                <button className="btn btn-primary" onClick={() => setIsNew(false)}>Lets start</button>
            </div>
        </div>
    );
}

export default NewDashboard;