import {useLocation, useNavigate} from 'react-router-dom';
import CancelAppointment from "./cancel";
import BookNewAppointment from "./book";
import RescheduleAppointment from "./reschedule";

function Appointment({token}) {
    const location = useLocation();
    const { action, doctorsMap, mfMap, pid } = location.state || {};
    const navigate = useNavigate()

    return (
        <div>
            <button onClick={() => navigate(`/dashboard`, { state: {pid}})} className="linkBtn">X</button>
                {action === 'cancel' && <CancelAppointment token={token} doctorsMap={doctorsMap} mfMap={mfMap}/>}
                {action === 'book' && <BookNewAppointment token={token} doctorsMap={doctorsMap} mfMap={mfMap} pid={pid} />}
                {action === 'reschedule' && <RescheduleAppointment token={token} doctorsMap={doctorsMap} mfMap={mfMap} pid={pid}/>}
        </div>
    );
}

export default Appointment;