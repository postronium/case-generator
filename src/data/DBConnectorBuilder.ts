import ConnectorBuilder from './ConnectorBuilder';
import { ConnectorModel } from '../model/ConnectorModels';


export default class DBConnectorBuilder extends ConnectorBuilder  {

    constructor(dbHost: string, dbUser: string, dbPass: string) {
        super();
    }

    public loadConnectors() {

    }

    public getConnector(name: string) : ConnectorModel{
        return null;
    }

    public getConnectors() : ConnectorModel[]{
        return [];
    }

}
