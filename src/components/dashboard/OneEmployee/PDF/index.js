import React, { useState } from 'react';
import { getPDF } from '../../../../requests';


const PDF = props => {

    const [file, setFile] = useState("");

    const onClick = e => {
        getPDF(props.event.id)
        .then(res => {
            if(res){
                const linkSource = `data:application/pdf;base64,${res.data}`;
                const downloadLink = document.createElement("a");
                const fileName = "abc.pdf";
                downloadLink.href = linkSource;
                downloadLink.download = fileName;
                downloadLink.click();
            }
        })
    }

    return (
        <div>
            <button
                onClick={onClick}
                className="btn btn-info"
            >
                <i className="fa fa-print"></i>
            </button>
        </div>
    )
}

export default PDF;