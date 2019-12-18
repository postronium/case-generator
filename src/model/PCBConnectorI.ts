import Vector from '../utils/Vector';

export default interface PCBConnectorI {

    getOffsetConnector(offset: Vector) : PCBConnectorI

    getName();

    getPositionX();

    getPositionY();

    getPositionZ();

    isSideConnector();

    getSide();

    getOutset();

    isHoleOpen();

    getOrientation();

    getModel();

    getSideBoxes();

    getTopBoxes();

    getBottomBoxes();

    getBoxPosZ();

    getMinZ();

    getMaxZ();

    getDontSplit();

}
