export default abstract class RPIBuilder {

    public abstract loadRPI();

    public abstract getRPIByName(name: string);

    public abstract getAllRPIs();
}
