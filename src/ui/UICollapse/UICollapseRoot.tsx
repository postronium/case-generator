import * as React from "react";


export default class UICollapseRoot extends React.Component<{id: string}>{

    render() {
        return (<div id={"accordion"+this.props.id}>
            {this.props.children}
        </div>);
    }

}
