import * as React from "react";

export class UIExport extends React.Component<{onExportTop: Function, onExportBottom: Function, onUpload: Function}> {


    constructor(props) {
        super(props);
    }

    render() {
        return (<div className="border">
            <h5>Download the 3D models</h5>
            <button className="btn btn-outline-primary btn-sm" onClick={(event) => {this.props.onExportTop()}}>Download top model</button>
            <button className="btn btn-outline-primary btn-sm" onClick={(event) => {this.props.onExportBottom()}}>Download bottom model</button>
        </div>);
    }


}
