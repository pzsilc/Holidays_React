import React, { useState, useEffect } from 'react';
import { getEmployees, getHolidaysByEmployeeId, getStatuses } from '../../../requests';

const OneEmployee = props => {

    const [employee, setEmployee] = useState(null);
    const [events, setEvents] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async() => {
            const id = props.match.params.id;
            let emp = await getEmployees(id);
            let ev = await getHolidaysByEmployeeId(id, true);
            let st = await getStatuses();
            setEmployee(emp.data);
            setEvents(ev.data);
            setStatuses(st.data);
            setLoading(false);
        })()
    }, []);

    const findStatusById = id => statuses.find(s => s.id == id);

    return(
        <div className="p-5">
            {loading && <div className="text-center">
                    <i className="fa fa-circle-notch fa-spin"></i>
                </div>
            }
            {!loading &&
                <div className="container">
                    <a href="/dashboard"><i className="fa fa-arrow-left h2 text-muted"></i></a>
                    <div className="row mt-5">
                        <div className="col-12 col-md-6">
                            <h2 className="mb-5">Profil pracownika</h2>
                            <p>Imię i nazwisko: <b>{employee.first_name} {employee.last_name}</b></p>
                            <p>Email: <b>{employee.email}</b></p>
                            <p>Ilość urlopów: <b>{events.length}</b></p>
                        </div>
                        <div className="col-12 col-md-6 border-left">
                            <h3 className="mb-3">Urlopy</h3>
                            {events.map((e, key) => 
                                <div key={key} className={`border p-3 d-flex justify-content-between ${findStatusById(e.status_id).id == 2 ? 'bg-success' : (findStatusById(e.status_id).id == 3 ? 'bg-danger' : '')}`}>
                                    <div>
                                        <i className="fa fa-calendar mr-2"></i>
                                        {e.from_date}
                                        <i className="fa fa-arrow-right mx-2"></i>
                                        {e.to_date}
                                    </div>
                                    <div>
                                        {findStatusById(e.status_id).name}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default OneEmployee;