import React, { useRef } from 'react';
import { postHolidays } from '../../../../requests';


const AddSicknessForm = ({ user, update }) => {

    const modalBtn = useRef();
    const fromInput = useRef()
    const toInput = useRef();

    const submit = async(e) => {
        e.preventDefault();
        const { from, to } = e.target;
        await postHolidays(new Date(from.value), new Date(to.value), user, "", 2);
        fromInput.current.value = "";
        toInput.current.value = "";
        modalBtn.current.click();
        update();
    }

    return(
        <React.Fragment>
            <button type="button" ref={modalBtn} className="btn btn-primary" data-toggle="modal" data-target="#add-sickness">
                Dodaj chorobowe
            </button>
            <div className="modal fade" id="add-sickness" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <form className="modal-content" onSubmit={submit}>
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Dodaj chorobowe</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <label htmlFor="from_input">Od dnia</label>
                            <input ref={fromInput} type="date" id="from_input" name="from" className="form-control"/>
                            <br/>
                            <label htmlFor="to_input">Do dnia</label>
                            <input ref={toInput} type="date" id="to_input" name="to" className="form-control"/>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Anuluj</button>
                            <button type="submit" className="btn btn-primary">Dodaj</button>
                        </div>
                    </form>
                </div>
            </div>
        </React.Fragment>
    )
}

export default AddSicknessForm;