import * as React from 'react';
import Area2D from '../utils/Area2D';

/**
 *
 */
class Position2D extends React.Component<{validArea: Area2D, id: number, onUpdate: Function, initialPos: {x: number, y: number, z: number}}, {pos: {x: number, y: number, z: number}}> {

    private static DISPLAY_SCALE_FACTOR: number = 1/10;
    private static STEP_SIZE: number = 0.1;

    constructor(props) {
        super(props);
        this.state = {pos: Object.assign({}, this.props.initialPos)};
    }

    private getDisplayValureX() {
        return this.state.pos.x * Position2D.DISPLAY_SCALE_FACTOR;
    }

    private getDisplayValureY() {
        return this.state.pos.y * Position2D.DISPLAY_SCALE_FACTOR;
    }

    private getModelValue(value: string) {
        return parseFloat(value)/Position2D.DISPLAY_SCALE_FACTOR;
    }

    private updateValue(value: string, axis: string) {
        const position = this.state.pos;
        switch (axis) {
            case 'x':
                position.x = this.getModelValue(value);
                break;
            case 'y':
                position.y = this.getModelValue(value);
                break;
        }
        if (this.props.validArea.isInside(position.x, position.y)) {
            this.setState({pos: position});
            this.props.onUpdate(position, this.props.id);
        }
    }

    render() {
        const validDisplayArea = this.props.validArea.getScale(Position2D.DISPLAY_SCALE_FACTOR);
        const position = this.state.pos;
        return (<div className="input-group input-group-sm">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="position-2d-prefixX">X</span>
                    </div>
                    <input
                        type="number"
                        max={validDisplayArea.getMaxX()}
                        min={validDisplayArea.getMinX()}
                        value={this.getDisplayValureX()}
                        onChange={(event) => this.updateValue(event.target.value, 'x')}
                        className="form-control"
                        step={Position2D.STEP_SIZE}
                        aria-describedby="position-2d-prefixX" />

                    <div className="input-group-prepend">
                        <span className="input-group-text" id="position-2d-prefixY">Y</span>
                    </div>
                    <input
                        type="number"
                        max={validDisplayArea.getMaxY()}
                        min={validDisplayArea.getMinY()}
                        value={this.getDisplayValureY()}
                        onChange={(event) => this.updateValue(event.target.value, 'y')}
                        className="form-control"
                        step={Position2D.STEP_SIZE}
                        aria-describedby="position-2d-prefixY" />
            </div>);
    }
}

export default Position2D;
