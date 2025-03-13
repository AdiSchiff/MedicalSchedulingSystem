import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import React, {useState} from "react";
import Login from "./Login/login"
import Dashboard from "./Dashboard/dashboard"
import Appointment from "./Appointment/appointment"
import {AppointmentsProvider} from "./Appointment/AppointmentsContext";

function App() {
  const [token, setToken] = useState(null);
  const [phone, setPhone] = useState(null);
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Login setToken={setToken} setPhone={setPhone} />} />
            <Route path="/*" element={token ? (
                    <AppointmentsProvider>
                        <Routes>
                            <Route path="dashboard" element={<Dashboard token={token} phone={phone} />} />
                            <Route path="appointment" element={<Appointment token={token} />} />
                        </Routes>
                    </AppointmentsProvider>
                ) : (
                    <Navigate to="/" />
                )}
            />
        </Routes>
    </BrowserRouter>
  );
}

export default App;