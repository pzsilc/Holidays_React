import React, { useState, useEffect } from 'react';
import { getEmployees } from '../../../requests';


const Home = () => {

    const [employees, setEmployees] = useState([]);
    const [keywords, setKeywords] = useState("");
    useEffect(() => (async () => setEmployees((await getEmployees(null, keywords)).data))());

    const onChangeKeywords = e => setKeywords(e.target.value);

    return(
        <div className="container">
            <div className="d-flex justify-content-between">
                <h1 className="mb-5">Lista pracowników</h1>
                <div className="col-auto">
                    <label className="sr-only" htmlFor="inlineFormInputGroup">Wyszukaj</label>
                    <div className="input-group mb-2">
                        <div className="input-group-prepend">
                            <div className="input-group-text"><i className="fa fa-search"></i></div>
                        </div>
                        <input type="text" value={keywords} onChange={onChangeKeywords} className="form-control" id="inlineFormInputGroup" placeholder="Username"/>
                    </div>
                </div>
            </div>
            <div className="row">
                {Array.isArray(employees) && 
                    <React.Fragment>
                        {employees.map((emp, key) =>
                            <a href={`/holidays/dashboard/employees/${emp.id}`} className="dashboard-a" key={key} className="col-12 col-sm-6 border">
                                {emp.first_name} {emp.last_name}
                            </a>
                        )}
                    </React.Fragment>
                }
                {!employees.length &&
                    <div className="text-center mx-auto mt-5 pt-5  text-muted">Brak wyników</div>
                }
            </div>
        </div>
    )
}


export default Home;