import React from 'react';

const Form = props => {
    return (
        <React.Fragment>
            <label 
                htmlFor="kindInput" 
                className="text-dark mt-2" 
                style={{ fontSize: '15px', background: 'transparent', width: '120px' }}
            >
                Typ urlopu
            </label>
            <select 
                name="kindId" 
                onClick={props.onChange} 
                id="kindInput" 
                className="form-control mb-2"
            >
                <option value="">Wybierz...</option>
                {props.kinds.map((kind, key) => 
                    <option 
                        key={key} 
                        value={kind.id}
                    >
                        {kind.name}
                    </option>
                )}
            </select>
            {props.kindId == 6 && 
                <input 
                    type="text" 
                    placeholder="Podaj powód" 
                    className="form-control mb-2" 
                    name="purpose" 
                    required
                />
            }
            {props.kindId == 7 && 
                <React.Fragment>
                    <select 
                        name="option_nb" 
                        className="form-control mb-2" 
                        name="optionNb" 
                        onChange={props.onChange} 
                        required
                    >
                        <option 
                            value="1"
                        >
                            2 dni
                        </option>
                        <option 
                            value="2"
                        >
                            na godziny
                        </option>
                    </select>
                    {(props.optionNb == 1 && props.datesToMark.length > 2) &&
                        <div 
                            className="btn btn-danger mb-2"
                        >
                            Możesz wybrać maksymalnie 2 dni dla tego rodzaju urlopu
                        </div>
                    }
                    {props.optionNb == 2 &&
                        <React.Fragment>
                            <div 
                                className="d-flex justify-content-between"
                            >
                                <input 
                                    name="fromHours" 
                                    type="number" 
                                    min="0" 
                                    max="24" 
                                    className="form-control m-1" 
                                    placeholder="Od godziny" 
                                    onChange={props.onChange}
                                />
                                <input 
                                    name="toHours" 
                                    type="number" 
                                    min="0" 
                                    max="24" 
                                    className="form-control m-1" 
                                    placeholder="Do godziny" 
                                    onChange={props.onChange}
                                />
                            </div>
                            {((props.fromHours && props.toHours) && props.fromHours >= props.toHours) &&
                                <div 
                                    className="btn btn-danger mb-2"
                                >
                                    Godzina zakończenia musi być większa od godziny rozpoczęcia
                                </div>
                            }
                            {(props.from && props.to && props.from.getTime() != props.to.getTime()) &&
                                <div 
                                    className="btn btn-danger mb-2"
                                >
                                    Należy zaznaczyć tylko 1 dzień
                                </div>                               
                            }
                        </React.Fragment>
                    }
                </React.Fragment>
            }
            <textarea 
                className="form-control" 
                id="additionalInfo" 
                placeholder="Dodatkowe informacje (opcjonalne)" 
                name="additionalInfo"
            ></textarea>
        </React.Fragment>
    )
}

export default Form;