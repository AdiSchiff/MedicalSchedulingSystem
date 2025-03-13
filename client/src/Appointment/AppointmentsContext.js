import { createContext, useContext, useState } from "react";

// Create context
const AppointmentsContext = createContext(null);

// Context provider component
export const AppointmentsProvider = ({ children }) => {
    const [futureAppointments, setFutureAppointments] = useState([]);
    const [bookedAppointments, setBookedAppointments] = useState([]);

    return (
        <AppointmentsContext.Provider value={{ futureAppointments, setFutureAppointments, bookedAppointments, setBookedAppointments }}>
            {children}
        </AppointmentsContext.Provider>
    );
};

// Custom hook for easy access
export const useAppointments = () => {
    return useContext(AppointmentsContext);
};
