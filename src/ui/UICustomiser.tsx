//let Renderer = require('./ts/case-render.ts');
//react imports
import * as React from "react";
import { connect } from "react-redux";

//react components import
import UIAddModel from "./UIAddModel";
import UICollapseRoot from "./UICollapse/UICollapseRoot";
import UIModelList from "./UIModelList";
import UIViewSettings from "./UIViewSettings";

const mapStateToProps = state => {
    return {
        generatable: state.containers
    };
}

class UICustomiser extends React.Component {

    private static COLORS = {
        red: 0xFF0000,
        green: 0x00FF00,
        blue: 0x0000FF,

        lime: 0x60FF60,
        lightBlue: 0x8080FF,
        pink: 0xFFA0A0,

        black: 0x000000,
        white: 0xFFFFFF,
    };

    private static PCB_COLORS = [
        UICustomiser.COLORS.red,
        UICustomiser.COLORS.green,
        UICustomiser.COLORS.blue
    ];
    //same color than PCB_COLORS but for html and in string
    private static UI_COLORS = [
        "#FFA0A0",
        "#A0FFA0",
        "#A0A0FF"
    ];
    public render() {
        return (
            <div id="main-container">
                <UIAddModel />
                <UICollapseRoot id="0">
                    <UIModelList/>
                </UICollapseRoot>
                <UIViewSettings/>
            </div>);
    }
}

export default connect(mapStateToProps)(UICustomiser);
