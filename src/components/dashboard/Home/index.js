import React, { Component } from 'react';
import { getEmployees } from '../../../requests';

export default class Home extends Component{
    
    state = {
        employees: []
    }

    componentDidMount = async () => {
        let emps = await getEmployees();
        this.setState({ employees: emps.data });
    }

    render = () => {
        return(
            <div className="container">
                <h1 className="mb-5">Lista pracowników</h1>
                <div className="row">
                    {this.state.employees.map((emp, key) =>
                        <a href={`/dashboard/employees/${emp.id}`} className="dashboard-a" key={key} className="col-12 col-sm-6 border">
                            {emp.first_name} {emp.last_name}
                        </a>
                    )}
                </div>
            </div>
        )
    }
}