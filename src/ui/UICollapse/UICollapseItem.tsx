import * as React from "react";

export default class UICollapseItem extends React.Component<{title: string, itemId: string, rootId: string, style: any}>{

    render() {
        return (<div className="card" style={this.props.style}>
            <div className="card-header" id={"heading"+this.props.itemId}>
                <h5 className="mb-0">
                    <button className="btn btn-link" data-toggle="collapse" aria-expanded="true"
                            data-target={"#collapse"+this.props.itemId} aria-controls={"collapse"+this.props.itemId}>
                        {this.props.title}
                    </button>
                </h5>
            </div>

            <div id={"collapse"+this.props.itemId} className="collapse show"
                    aria-labelledby={"heading"+this.props.itemId} data-parent={"#accordion"+this.props.rootId}>
                <div className="card-body">
                    {this.props.children}
                </div>
            </div>
        </div>);
    }

}
