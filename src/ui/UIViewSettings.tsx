import * as React from 'react';
import { connect } from 'react-redux';
import UICheckbox from './UICheckbox';
import { onToggleTopDisplay } from '../redux/actions';


const mapStateToProps = (state: any) => {
    return {
        checked: state.config.displayTop
    };
};

const mapDispatchToProps = (dispatch: Function) => {
    return {
        onChange: (param: any) => {dispatch(onToggleTopDisplay(param))}
    };
};

const UIViewSettings = props => {
    return (
        <div className="border">
            <h5>View settings</h5>
            <UICheckbox index={-1} name={"Display top part of case"} checked={props.checked}
                onChange={props.onChange}/>
        </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(UIViewSettings);
