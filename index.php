<?php
$conf = parse_ini_file("config.ini", true);
?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
        <title>Raspberry PI case generator</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">

        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <style>
            html, body {
                height: 100%;
                margin: 0px;
                padding: 0px;
                overflow: hidden;
            }

            #root {
                height: 100%;
            }

            #preview {
                margin: 0px;
                padding: 0px;
            }

            #parameters {
                height: 100%;
                background-color: #FFF;
            }

            .scroll {
                overflow-y: scroll;
                height: 100%;
                margin-bottom: 50px;
            }

            .row {
                margin-left: 0px;
                margin-right: 0px;
            }

            input[type="number"] {
                width: 90px;
            }

            .custom_pcb {
                padding: 3px;
                border: solid;
                border-width: 3px;
            }

            .card-header {
                padding: 0.25rem 1rem;
            }

            .case-option-param {
                background-color: #FFF;
            }

            .indent {
                margin-left: 30px;
            }

            .border {
                padding: 5px;
                border-radius: 4px;
                margin-top: 5px;
                border-width: thick;
            }

            .item-separation {
                margin-top: 12px;
                margin-bottom: 12px;
            }

            .short {
                width: 150px;
                display: inline-block;
            }

            /* Bootstrap modifications */
            .custom-control {
                margin-top: 4px;
                margin-bottom: 4px;
            }

            .input-group {
                width: 90%;
                margin-top: 4px;
                margin-bottom: 4px;
            }

            .btn-primary {
                margin: 20px;
            }

            .btn-outline-primary {
                margin: 5px;
            }
        </style>
    </head>
    <body>
        <script src="./src/lib/three.js"></script>
        <script src="./src/lib/csg.js"></script>
        <script src="./src/lib/orbitControls.js"></script>
        <script src="./src/lib/CanvasRenderer.js"></script>
        <script src="./src/lib/Projector.js"></script>
        <script src="./src/lib/STLLoader.js"></script>
        <script src="./src/lib/SAT.min.js"></script>
        <script src="./src/lib/SimplifyModifier.js"></script>

        <script>
            var initialModelId = '<?php echo isset($_GET["modeldata"]) == false ? '' : htmlentities($_GET["modeldata"]) ?>';
            var initialModel = '{"containers": []}';
            if (initialModelId != '') {
                var xobj = new XMLHttpRequest();
                //xobj.overrideMimeType("application/json");
                xobj.open('GET', '<?php echo $conf['general']['json_models'] ?>' + initialModelId + '.json', false);
                xobj.send(null);
                if (xobj.readyState == 4 && xobj.status == 200) {
                    initialModel = xobj.responseText;
                }
            }
        </script>

        <div class="row" id="root"></div>

        <div id="dsgvo" style="padding: 20px; z-index: 100; position: absolute; left: 50%; top: 50%; margin-top: -100px; margin-left: -150px; width: 300px; height: 200px; background: white; border: 1px solid black">
            <p>
                Please read the <a href="./dsgvo.html">privacy policy</a> and accept to use the advanced functionalities of this website.
            </p>
            <br>
            <div style="float: right;">
                <button style="margin: 5px;" class="btn btn-outline-success btn-sm" onClick="accptionPolicy()">Accept</button>
                <button style="margin: 5px;" class="btn btn-outline-danger btn-sm"  onClick="declinePolicy()">Decline</button>
            </div>
        </div>

        <script src="./dsgvo.js"></script>

        <script src="./dist/bundle.js"></script>

        <div style="z-index: 100; position: absolute; color: black; bottom: 0px; left: 0px; right: 0px; width: 100%; font-size: 10px; height: 15px; background: white;" ><a href="./dsgvo.html">privacy policy</a></div>

        <script src="https://code.jquery.com/jquery-3.1.1.slim.min.js" integrity="sha384-A7FZj7v+d/sdmMqp/nOQwliLvUsJfDHW+k9Omg/a/EheAdgtzNs3hpfag6Ed950n" crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js" integrity="sha384-DztdAPBWPRXSA/3eYEEUWrWCy7G5KFbe8fFjk5JAIxUYHKkDx6Qin1DkWx51bBrb" crossorigin="anonymous"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js" integrity="sha384-vBWWzlZJ8ea9aCX4pEW3rVHjgjt7zpkNpZk+02D9phzyeVkE+jo0ieGizqPLForn" crossorigin="anonymous"></script>

    </body>
</html>
