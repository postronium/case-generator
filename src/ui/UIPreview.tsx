import * as React from 'react';
import { connect } from "react-redux";
import CaseOptions from '../case-options/CaseOptions';
import PCBModelCluster from '../model/PCBModelCluster';
import * as CaseModel from '../model/CaseModels';
import AdvCaseGenerator from '../generator/AdvCaseGenerator';

declare var THREE: any;

let mapStateToProps = state => {
    const shieldCont = [];
    for (let i = 0; i < state.containers.length; i++) {
        const cont = state.containers[i];
        for (let j = 0; j < cont.shields.length; j++) {
            let s = Object.assign({}, cont.shields[j]);
            shieldCont.push(s);
        }
    }
    return {
        containers: state.containers,
        shieldContainers: shieldCont,
        config: state.config,
        ui: state.ui
    };
};

class UIPreview extends React.Component<{containers: Array<any>, shieldContainers: Array<any>, config: any,
        ui: any, update: Function}, {}>{
    private mount: any;
    private scene: any;
    private camera: any;
    private renderer: any;
    private frameId: any;
    private controls: any;

    private caseOptions = new CaseOptions();

    private generatorTop: AdvCaseGenerator;
    private generatorBottom: AdvCaseGenerator;

    componentDidMount(){
        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;

        this.setupScene();

        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 3000);
        this.camera.position.z = 4;
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(width, height);
        this.mount.appendChild(this.renderer.domElement);

        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        this.controls.dampingFactor = 0.25;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 100;
        this.controls.maxDistance = 10000;
        this.controls.maxPolarAngle = Math.PI;
        this.controls.rotateSpeed = 0.2;

        this.start();
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x7070FF);
        this.scene.fog = new THREE.FogExp2(0xcccccc, 0.0002);
        this.scene.add(new THREE.AmbientLight(0x707070));
        let light = new THREE.PointLight(0xffffff, 1, 1000000);
        light.position.set(500, 500, 1000);
        this.scene.add(light);
    }

    componentWillUnmount(){
        this.stop();
        this.mount.removeChild(this.renderer.domElement);
    }

    start = () => {
        this.animate();
    }

    stop = () => {
        cancelAnimationFrame(this.frameId);
    }

    animate = () => {
        this.frameId = requestAnimationFrame(this.animate);
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    render(){
        this.updateModel();
        return(
            <div
                id="preview"
                className="col-sm-9"
                ref={(mount) => {this.mount = mount}}
            />);
    }

    updateModel() {
        var cluster = PCBModelCluster.fromJson({
                containers: this.props.containers, shieldContainers: this.props.shieldContainers, ui: this.props.ui});

        let caseModel = new CaseModel.JSON(this.props.config);

        if (cluster != null) {
            let length = caseModel.getOutterCaseLength(cluster);
            let width = caseModel.getOutterCaseWidth(cluster);

            this.controls.target.x = length/2;
            this.controls.target.y = width/2;
        }

        this.setupScene();

        if (cluster == null)
            return;

        this.generatorTop = new AdvCaseGenerator(caseModel, cluster, this.caseOptions.getActivatedOptions(), true);
        this.generatorBottom = new AdvCaseGenerator(caseModel, cluster, this.caseOptions.getActivatedOptions(), false);

        let pcbGenerators = cluster.getContainers().map(cont => cont.pcbGenerator);

        pcbGenerators.forEach((gen) => {
            gen.addToScene(this.scene);
        });

        this.generatorBottom.addToScene(this.scene);

        if (this.props.config.generateTop) {
            this.generatorTop.addToScene(this.scene);
        }

        this.props.update(this.generatorTop, this.generatorBottom);
    }
}

export default connect(mapStateToProps)(UIPreview);
