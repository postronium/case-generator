//let Renderer = require('./ts/case-render.ts');
const ThreeBSP = require('./lib/three-js-csg.js')(THREE);


//react imports
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";

//redux
import store from "./redux/store/index";
import { addPCB } from "./redux/actions/index";

//react components import
import UICustomiser from "./ui/UICustomiser";
import { UIExport } from "./ui/UIExport";
import UICheckbox from './ui/UICheckbox';
import UIPreview from './ui/UIPreview'

//export
const exportSTL = require('threejs-export-stl');
import { saveAs } from 'file-saver';
import ComponentModel from "./model/ComponentModel";
import UIInfo from "./ui/UIInfo";
import PCBGenerator from "./model/PCBGenerator";
import AdvCaseGenerator from "./generator/AdvCaseGenerator";


//declaration of missing types
declare var THREE: any;
declare var Object3D: any;
declare var Stripe: any;
declare var initialModel: any;
declare var policy: string;

var generatorTop: AdvCaseGenerator;
var generatorBottom: AdvCaseGenerator;


interface Window {
    innerWidth: number;
    innerHeight: number;
}
declare var window: Window;
Promise.all([
    ComponentModel.loadComponents(), PCBGenerator.loadModels()
]).then(() => {
    console.log("All connectors loaded");

    ReactDOM.render(
        <Provider store={store}>
            <div className="row" id="root">
                <div id="parameters" className="col-sm-3">
                    <div className="scroll">
                        <p>
                            <h2>Case Configurator</h2>
                            This is a simple tool that allows you to combine multiple pcb to generate an enclosure for your project.
                            The enclosure can be downloaded to be printed with a 3D printer.
                            Keep in mind that this is a prototype and that the 3D model may not be compatible with every slicer.
                        </p>
                        <UICustomiser />
                        <UIExport onExportTop={() => {onExportTop()}} onExportBottom={() => {onExportBottom()}} onUpload={() => {}}/>
                    </div>
                </div>

                <UIPreview update={onModelUpdate}/>
            </div>
        </Provider>
        ,
        document.getElementById('root')
    );
});

function onModelUpdate(top, bottom) {
    generatorTop = top;
    generatorBottom = bottom;
}

function upload(bottomBlob, topBlob, modelData, complexity) {

    if (complexity == 0) {
        alert("You cannot download an empty model! Add a model by selecting one in the list, and click 'Add'.");
        return;
    }

    var formData = new FormData();

    formData.append("complexity", ""+complexity);
    formData.append("model_data", JSON.stringify(modelData));

    if (topBlob == undefined) formData.append("topAndBottom", "false");
    else                      formData.append("topAndBottom", "true");

    //prepare blob parameter
    formData.append("model_btm", bottomBlob, "model-bottom.stl");
    if (topBlob != undefined)
        formData.append("model_top", topBlob, "model-top.stl");

    var xhr = new XMLHttpRequest();

    xhr.open('POST', 'http://[your_hostname]/upload/index.php', true);

    xhr.send(formData);
}

let onExportTop = function() {
    const mesh = generatorTop.getFullMesh();
    const buffer = exportSTL.fromMesh(mesh);
    const blob = new Blob([buffer], { type: exportSTL.mimeType });

    //http://sketchytech.blogspot.com/2014/03/beyond-post-and-get-working-with-blob.html
    saveAs(blob, 'pcb-case-top.stl');

    //upload(bottomBlob, topBlob, json, nPCBs);
}

let onExportBottom = function() {
    let bottomMesh = generatorBottom.getFullMesh();
    let topMesh = generatorTop.getFullMesh();
    const bottomBlob = new Blob([exportSTL.fromMesh(bottomMesh)], { type: exportSTL.mimeType });
    const topBlob = new Blob([exportSTL.fromMesh(topMesh)], { type: exportSTL.mimeType });

    saveAs(bottomBlob, 'pcb-case-bottom.stl');

    //upload(bottomBlob, topBlob, json, nPCBs);
}
