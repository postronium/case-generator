export interface Position {x: number, y: number, z: number}

export interface Connector {name: string, typename: string, side: number, pos: Position, outset: number, en: number};

export interface PCB {
    name: string,
    cat: string,
    slimFitZup: number[],
    screwHeadDiameter: number,
    dimX: number, dimY: number, dimZup: number, dimZdown: number,
    screwPositions: Array<Array<number>>,
    connectors: Connector[],
    minZlevel: number
}

export interface ConnectorModel {
    name: string,
    file3DModel: string,
    topConnector: boolean,
    startX: number,
    startY: number,
    zOffset: number,
    dimX: number,
    dimY: number,
    dimZ: number
}
