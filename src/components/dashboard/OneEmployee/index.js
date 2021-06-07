import React, { useState, useEffect } from 'react';
import { unstable_renderSubtreeIntoContainer } from 'react-dom';
import { getEmployees, getHolidaysByEmployeeId, getStatuses } from '../../../requests';
import AddSicknessForm from './AddSicknessForm';

const OneEmployee = props => {

    const [employee, setEmployee] = useState(null);
    const [events, setEvents] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => update(), []);

    const getColor = event => {
        if(event.kind.id == 1){
            switch(event.status.id){
                case '1': return "";
                case '2': return "bg-success";
                case '3': return "bg-danger";
            }
        } else return "";
    }

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

    return(
        <div className="p-5">
            {loading && <div className="text-center">
                    <i className="fa fa-circle-notch fa-spin h1"></i>
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
                                <div key={key} className={`border p-3 d-flex justify-content-between ${getColor(e)}`}>
                                    <div>
                                        <i className="fa fa-calendar mr-2"></i>
                                        {e.from_date}
                                        <i className="fa fa-arrow-right mx-2"></i>
                                        {e.to_date}
                                        <span className="ml-2 pl-2 border-left">{e.kind.name}</span>
                                    </div>
                                    <div>
                                        {(e.kind.id == 1 ? e.status.name : "")}
                                    </div>
                                </div>
                            )}
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