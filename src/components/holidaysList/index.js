import React from 'react';
import { getPDF } from '../../requests';

const HolidaysList = ({ title, events, options={} }) => {

    const print = e => {
        const { event_id } = e.target.dataset;
        getPDF(event_id)
        .then(res => {
            if(res){
                const linkSource = `data:application/pdf;base64,${res.data}`;
                const downloadLink = document.createElement("a");
                const fileName = "wniosek.pdf";
                downloadLink.href = linkSource;
                downloadLink.download = fileName;
                downloadLink.click();
            }
        })
    }

    return (
        <React.Fragment>
            <h3 className="mb-5">
                {title}
            </h3>
            {events.map((e, key) => 
                <div 
                    key={key} 
                    className={`border rounded-0 p-3 mt-1 bg-${e.status ? e.status.id == 1 ? '' : e.status.id == 2 ? 'success' : 'danger' : ''}`}
                >
                    <div className="d-flex justify-content-between">
                        <p>
                            <i className='fa fa-calendar mr-2'></i>
                            <span>{e.from_date}<i className="mx-2 fa fa-arrow-right"></i>{e.to_date}</span>
                        </p>
                        <div>
                            {(e.kind.id != 2 && e.status.id == 2) &&
                                <button 
                                    className="btn btn-info rounded-0 mr-1" 
                                    data-event_id={e.id} 
                                    onClick={print}
                                >
                                    <i className="fa fa-print"></i>
                                </button>
                            }
                            {(options.forAdmin && e.kind.id == 2) &&
                                <button 
                                    className="btn btn-danger rounded-0" 
                                    data-event_id={e.id} 
                                    onClick={options.deleteFunction}
                                >
                                    <i className="fa fa-trash"></i>
                                </button>
                            }
                            {(options.forOwner && e.status && e.status.id == 1) &&
                                <button 
                                    className="btn btn-danger rounded-0" 
                                    data-event_id={e.id} 
                                    onClick={options.deleteFunction}
                                >
                                    <i className="fa fa-trash"></i>
                                </button>
                            }
                            {options.forManager &&
                                <React.Fragment>
                                    <button 
                                        type="button" 
                                        data-action="accept"
                                        data-event_id={e.id}
                                        onClick={options.acceptOrRejectFunction} 
                                        className="btn btn-success rounded-0 mr-1"
                                    >
                                        <i 
                                            className="fa fa-check"
                                        ></i>
                                    </button>
                                    <button 
                                        type="button" 
                                        data-action="reject"
                                        data-event_id={e.id}
                                        onClick={options.acceptOrRejectFunction} 
                                        className="btn btn-danger rounded-0"
                                    >
                                        <i 
                                            className="fa fa-times"
                                        ></i>
                                    </button>
                                </React.Fragment>
                            }
                        </div>
                    </div>
                    {options.displayEmployee &&
                        <small><b>{e.employee.first_name} {e.employee.last_name}</b><br/></small>
                    }
                    <small>Rodzaj: <b>{e.full_kind_name}</b></small>
                    <br/>
                    {e.kind_id != 2 &&
                        <small>Status: <b>{e.status.name}</b></small>
                    }
                    <br/>
                    <small className="text-muted">{e.additional_info}</small>
                </div>
            )}
            {!events.length &&
                <div className="text-muted text-center">
                    Brak dni wolnych
                </div>
            }
        </React.Fragment>
    )
}

export default HolidaysList;