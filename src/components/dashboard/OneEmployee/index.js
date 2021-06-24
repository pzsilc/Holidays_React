import React, { useState, useEffect } from 'react';
import { getEmployees, getHolidaysByEmployeeId, getStatuses, deleteHolidays } from '../../../requests';
import AddSicknessForm from './AddSicknessForm';
import HolidaysList from '../../holidaysList';
import './style.scss';
const URL = 'http://localhost/holidays';

const OneEmployee = props => {

    const [employee, setEmployee] = useState(null);
    const [events, setEvents] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => update(), []);

    const update = async() => {
        const id = props.match.params.id;
        let emp = await getEmployees(id);
        let ev = await getHolidaysByEmployeeId(id, true);
        let st = await getStatuses();
        console.log(ev);
        setEmployee(emp.data);
        setEvents(ev.data);
        setStatuses(st.data);
        setLoading(false);
    }

    const _delete = async(e) => {
        const { event_id } = e.target.dataset;
        await deleteHolidays(event_id);
        update();
    }

    return(
        <div className="p-5">
            {loading && <div className="text-center">
                    <i className="fa fa-circle-notch fa-spin h1"></i>
                </div>
            }
            {!loading &&
                <div className="container">
                    <a href="/holidays/dashboard"><i className="fa fa-arrow-left h2 text-muted"></i></a>
                    <div className="row mt-5">
                        <div className="col-12 col-md-6">
                            <h2 className="mb-5">Profil pracownika</h2>
                            <p>Imię i nazwisko: <b>{employee.first_name} {employee.last_name}</b></p>
                            <p>Email: <b>{employee.email}</b></p>
                            <p>Ilość urlopów: <b>{events.length}</b></p>
                        </div>
                        <div className="col-12 col-md-6 border-left">
                            <h3 className="mb-3">Urlopy</h3>
                            <HolidaysList
                                title="Dni wolne"
                                events={events}
                                options={{
                                    forAdmin: true,
                                    deleteFunction: _delete
                                }}
                            />
                        </div>
                    </div>
                    <AddSicknessForm
                        user={employee}
                        update={update}
                    />
                </div>
            }
        </div>
    )
}

export default OneEmployee;