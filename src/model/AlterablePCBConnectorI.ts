import PCBConnectorI from './PCBConnectorI';

export default interface AlterablePCBConnectorI extends PCBConnectorI {
    setName(name: string);

    setPositionX(x: number);

    setPositionY(y: number);

    setPositionZ(y: number);

    setSideConnector(isSide: boolean);

    setSide(side: number);

    setOutset(outset: number);

    setIsHoleOpen(isOpen: boolean);

    setOrientation(orientation: number);
}
