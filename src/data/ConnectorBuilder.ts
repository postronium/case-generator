import { ConnectorModel } from '../model/ConnectorModels';

export default abstract class ConnectorBuilder {

    public abstract loadConnectors();

    public abstract async getConnector(name: string);

    public abstract async getConnectors();

}
