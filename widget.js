/* global requirejs cprequire cpdefine chilipeppr THREE ClipperLib */
// Defining the globals above helps Cloud9 not show warnings for those variables

// ChiliPeppr Widget/Element Javascript

requirejs.config({
    /*
    Dependencies can be defined here. ChiliPeppr uses require.js so
    please refer to http://requirejs.org/docs/api.html for info.
    
    Most widgets will not need to define Javascript dependencies.
    
    Make sure all URLs are https and http accessible. Try to use URLs
    that start with // rather than http:// or https:// so they simply
    use whatever method the main page uses.
    
    Also, please make sure you are not loading dependencies from different
    URLs that other widgets may already load like jquery, bootstrap,
    three.js, etc.
    
    You may slingshot content through ChiliPeppr's proxy URL if you desire
    to enable SSL for non-SSL URL's. ChiliPeppr's SSL URL is
    https://i2dcui.appspot.com which is the SSL equivalent for
    http://chilipeppr.com
    */
    paths: {
        // Example of how to define the key (you make up the key) and the URL
        // Make sure you DO NOT put the .js at the end of the URL
        // SmoothieCharts: '//smoothiecharts.org/smoothie',
        Snap: '//i2dcui.appspot.com/slingshot?url=http://snapsvg.io/assets/js/snap.svg-min.js',
        //Snap: '//i2dcui.appspot.com/slingshot?url=https://raw.githubusercontent.com/adobe-webplatform/Snap.svg/master/src/svg.js'
        ThreeProjector: '//i2dcui.appspot.com/geturl?url=http://threejs.org/examples/js/renderers/Projector.js',
        Clipper: '//i2dcui.appspot.com/js/clipper/clipper_unminified'
    },
    shim: {
        // See require.js docs for how to define dependencies that
        // should be loaded before your script/widget.
    }
});

cprequire_test(["inline:com-zipwhip-widget-svg2gcode"], function(myWidget) {

    // Test this element. This code is auto-removed by the chilipeppr.load()
    // when using this widget in production. So use the cpquire_test to do things
    // you only want to have happen during testing, like loading other widgets or
    // doing unit tests. Don't remove end_test at the end or auto-remove will fail.

    // Please note that if you are working on multiple widgets at the same time
    // you may need to use the ?forcerefresh=true technique in the URL of
    // your test widget to force the underlying chilipeppr.load() statements
    // to referesh the cache. For example, if you are working on an Add-On
    // widget to the Eagle BRD widget, but also working on the Eagle BRD widget
    // at the same time you will have to make ample use of this technique to
    // get changes to load correctly. If you keep wondering why you're not seeing
    // your changes, try ?forcerefresh=true as a get parameter in your URL.

    console.log("test running of " + myWidget.id);

    
    
    // load 3dviewer
    // have to tweak our own widget to get it above the 3dviewer
    $('#' + myWidget.id).css('position', 'relative');
    //$('#' + myWidget.id).css('background', 'none');
    $('#' + myWidget.id).css('width', '320px');
    $('body').prepend('<div id="3dviewer"></div>');
    chilipeppr.load(
      "#3dviewer",
      "http://raw.githubusercontent.com/chilipeppr/widget-3dviewer/master/auto-generated-widget.html",
      function() {
        cprequire(['inline:com-chilipeppr-widget-3dviewer'], function (threed) {
            threed.init({
                doMyOwnDragDrop: false
            });
            
            // hide toolbar for room
            $('#com-chilipeppr-widget-3dviewer .panel-heading').addClass("hidden");
            
            // only init eagle widget once 3d is loaded
            // init my widget
            // myWidget.init(function() {
            //     myWidget.activate();
            // });
            myWidget.init();
            myWidget.activate();
        });
    });

    // load flash message
    $('body').prepend('<div id="testDivForFlashMessageWidget"></div>');
    chilipeppr.load(
        "#testDivForFlashMessageWidget",
        "http://fiddle.jshell.net/chilipeppr/90698kax/show/light/",
        function() {
            console.log("mycallback got called after loading flash msg module");
            cprequire(["inline:com-chilipeppr-elem-flashmsg"], function(fm) {
                //console.log("inside require of " + fm.id);
                fm.init();
            });
        }
    );
    
    // load drag/drop widget that the workspace usually loads
    $('body').prepend('<div id="test-drag-drop"></div>');
    chilipeppr.load("#test-drag-drop", "http://fiddle.jshell.net/chilipeppr/Z9F6G/show/light/",

    function () {
        cprequire(
        ["inline:com-chilipeppr-elem-dragdrop"],

        function (dd) {
            dd.init();
            dd.bind("body", null);
        });
    });
    
    $('#' + myWidget.id).css('margin', '20px');
    $('title').html(myWidget.name);
    // $('#' + myWidget.id).css('background', 'none');

    // test activate/deactivate
    var testDeactivate = function() {
        setTimeout(myWidget.unactivate.bind(myWidget), 5000);
    }
    var testReactivate = function() {
        setTimeout(myWidget.activate.bind(myWidget), 7000);
    }
    //testDeactivate();
    // testReactivate();

} /*end_test*/ );

// This is the main definition of your widget. Give it a unique name.
cpdefine("inline:com-zipwhip-widget-svg2gcode", ["chilipeppr_ready", "Snap", "Clipper" ], function() {
    return {
        /**
         * The ID of the widget. You must define this and make it unique.
         */
        id: "com-zipwhip-widget-svg2gcode", // Make the id the same as the cpdefine id
        name: "Widget / svg2gcode", // The descriptive name of your widget.
        desc: "This widget lets you import an SVG file and generate Gcode from it.",
        url: "(auto fill by runme.js)",       // The final URL of the working widget as a single HTML file with CSS and Javascript inlined. You can let runme.js auto fill this if you are using Cloud9.
        fiddleurl: "(auto fill by runme.js)", // The edit URL. This can be auto-filled by runme.js in Cloud9 if you'd like, or just define it on your own to help people know where they can edit/fork your widget
        githuburl: "(auto fill by runme.js)", // The backing github repo
        testurl: "(auto fill by runme.js)",   // The standalone working widget so can view it working by itself
        /**
         * Define pubsub signals below. These are basically ChiliPeppr's event system.
         * ChiliPeppr uses amplify.js's pubsub system so please refer to docs at
         * http://amplifyjs.com/api/pubsub/
         */
        /**
         * Define the publish signals that this widget/element owns or defines so that
         * other widgets know how to subscribe to them and what they do.
         */
        publish: {
            // Define a key:value pair here as strings to document what signals you publish.
            //'/onExampleGenerate': 'Example: Publish this signal when we go to generate gcode.'
            'didDrop' : "We will publish this if we get an onDropped event and it is for an SVG file. This signal would likely be listened to by the workspace so it can actively show the widget to the user if they drop an SVG file into the workspace. The payload contains the file info like {name: \"myfile.svg\", lastModified: \"1/10/2017 12:12PM\"}",
        },
        /**
         * Define the subscribe signals that this widget/element owns or defines so that
         * other widgets know how to subscribe to them and what they do.
         */
        subscribe: {
            // Define a key:value pair here as strings to document what signals you subscribe to
            // so other widgets can publish to this widget to have it do something.
            // '/onExampleConsume': 'Example: This widget subscribe to this signal so other widgets can send to us and we'll do something with it.'
        },
        /**
         * Document the foreign publish signals, i.e. signals owned by other widgets
         * or elements, that this widget/element publishes to.
         */
        foreignPublish: {
            // Define a key:value pair here as strings to document what signals you publish to
            // that are owned by foreign/other widgets.
            // '/jsonSend': 'Example: We send Gcode to the serial port widget to do stuff with the CNC controller.'
            "/com-chilipeppr-widget-3dviewer/request3dObject" : "This gives us back the 3d object from the 3d viewer so we can add Three.js objects to it."
        },
        /**
         * Document the foreign subscribe signals, i.e. signals owned by other widgets
         * or elements, that this widget/element subscribes to.
         */
        foreignSubscribe: {
            // Define a key:value pair here as strings to document what signals you subscribe to
            // that are owned by foreign/other widgets.
            // '/com-chilipeppr-elem-dragdrop/ondropped': 'Example: We subscribe to this signal at a higher priority to intercept the signal. We do not let it propagate by returning false.'
            "/com-chilipeppr-widget-3dviewer/recv3dObject" : "By subscribing to this we get the callback when we /request3dObject and thus we can grab the reference to the 3d object from the 3d viewer and do things like addScene() to it with our Three.js objects.",
            '/com-chilipeppr-elem-dragdrop/ondropped': 'We subscribe to this signal at a higher priority to intercept the signal, double check if it is an SVG file and if so, we do not let it propagate by returning false. That way the 3D Viewer, Gcode widget, or other widgets will not get the SVG file drag/drop events because they will not know how to interpret the SVG file.'
        },
        /**
         * All widgets should have an init method. It should be run by the
         * instantiating code like a workspace or a different widget.
         */
        init: function(callback) {
            console.log("I am being initted. Thanks.");

            this.setupUiFromLocalStorage();

            
            //this.init3d();
            
            // May need to not subscribe during production. Not sure.
            this.setupDragDrop();
            
            this.btnSetup();
            this.forkSetup();

            if (callback) callback();
            
            // store original svg
            this.setupExampleSvg();

            console.log("I am done being initted.");
        },
        /**
         * Called by the workspace to activate this widget.
         */
        activate: function() {
            var that = this;
            // cprequire(['ThreeProjector'], function() {
                // console.log("ThreeProjector loaded");
                //setTimeout( that.init3d.bind(that), 500);
                that.init3d();
                /*
                that.init3d(function() {
                    //if (callback) callback();
                    console.log("inside activate got init3d done");
                    if (that.obj3d) {
                        that.onRender();
                        //this.obj3dmeta.widget.wakeAnimate();
                    } else {
                        console.log("being asked to activate svg2gcode but have no handle to 3d viewer");
                    }
                });
                */
            // });
            
        },
        /**
         * Called by the workspace to deactivate this widget.
         */
        unactivate: function() {
            this.sceneRemoveMySceneGroup();
            this.sceneDisposeMySceneGroup();
            // hide floaty menus
            this.hideFloatItems();
        },
        callbackForWorkspaceToShowUs: null,
        /**
         * The workspace should call this so we can ask it to show us. This is
         * needed so if a file is dragged in that is SVG we can say to the workspace
         * we'll handle it and that our widget should get shown.
         */
        setCallbackForWorkspaceToShowUs: function(callback) {
            this.callbackForWorkspaceToShowUs = callback;
        },
        /**
         * This is called by any method in this widget if it wants the parent workspace
         * to show us. This would typically be called from onDropped.
         */
        askWorkspaceToShowUs: function() {
            this.callbackForWorkspaceToShowUs();
        },
        /**
         * Try to get a reference to the 3D viewer.
         */
        init3d: function () {
            this.get3dObj();
            if (this.obj3d == null) {
                console.log("loading 3d scene failed, try again in 1 second");
                var attempts = 1;
                var that = this;
                setTimeout(function () {
                    that.get3dObj();
                    if (that.obj3d == null) {
                        attempts++;
                        setTimeout(function () {
                            that.get3dObj();
                            if (that.obj3d == null) {
                                console.log("giving up on trying to get 3d");
                            } else {
                                console.log("succeeded on getting 3d after attempts:", attempts);
                                that.onInit3dSuccess();
                            }
                        }, 5000);
                    } else {
                        console.log("succeeded on getting 3d after attempts:", attempts);
                        that.onInit3dSuccess();
                    }
                }, 1000);
            } else {
                this.onInit3dSuccess();
            }

        },
        originalSvg: null,
        setupExampleSvg: function() {
            // grab a copy of the original svg to make as the example file
            this.originalSvg = $('#' + this.id + ' .input-svg').val();
            var that = this;
            $('#' + this.id + ' .load-logo').click(function() {
                console.log("got click on load logo");
                $('#' + that.id + ' .input-svg').val(that.originalSvg).trigger('change');
                
            })
        },
        /**
         * Call this method from init to setup all the buttons when this widget
         * is first loaded. This basically attaches click events to your 
         * buttons. It also turns on all the bootstrap popovers by scanning
         * the entire DOM of the widget.
         */
        btnSetup: function() {

            // Chevron hide/show body
            var that = this;
            $('#' + this.id + ' .hidebody').click(function(evt) {
                console.log("hide/unhide body");
                if ($('#' + that.id + ' .panel-body').hasClass('hidden')) {
                    // it's hidden, unhide
                    that.showBody(evt);
                }
                else {
                    // hide
                    that.hideBody(evt);
                }
            });

            // Ask bootstrap to scan all the buttons in the widget to turn
            // on popover menus
            $('#' + this.id + ' .btn').popover({
                delay: 1000,
                animation: true,
                placement: "auto",
                trigger: "hover",
                container: 'body'
            });


            // render
            $('#' + this.id + ' .btn-render').click(this.onRender.bind(this));

            // on change which re-reads the svg file and creates the Three.js object
            $('#' + this.id + ' .input-svg').change(this.onChange.bind(this));
            $('#' + this.id + ' .svg2gcode-cuttype').change(this.onChange.bind(this));
            
            // input that just changes gcode, but doesn't have to re-render the svg from scratch
            $('#' + this.id + ' .svg2gcode-modetype').change(this.onModeTypeChange.bind(this));
            $('#' + this.id + ' .input-svalue').change(this.generateGcode.bind(this));
            $('#' + this.id + ' .input-clearance').change(this.generateGcode.bind(this));
            $('#' + this.id + ' .input-depthcut').change(this.generateGcode.bind(this));
            $('#' + this.id + ' .input-feedrateplunge').change(this.generateGcode.bind(this));
            $('#' + this.id + ' .input-feedrate').change(this.generateGcode.bind(this));
            $('#' + this.id + ' .input-inflate').change(this.onInflateChange.bind(this));
            
            $('#' + this.id + ' .btn-sendgcodetows').click(this.sendGcodeToWorkspace.bind(this));
            
            // debug arrow
            $('#' + this.id + ' .btn-arrow').click(this.drawDebugArrowHelperFor3DToScreenPosition.bind(this));
            $('#' + this.id + ' .btn-test').click(this.debugDrawTestObjects.bind(this));
            
            
        },
        debugDrawTestObjects: function() {
            this.clear3dViewer();
            this.sceneRemoveMySceneGroup();
            this.sceneDisposeMySceneGroup();
            
            var width = $( window ).width();
            var height = $( window ).height();
            $('.test-info').text("Canvas w: " + width + ", h: " + height);
        },
        isChanging: false,
        onChange: function() {
            if (this.isChanging) {
                console.warn("another change is in process");
                return;
            } else {
                this.isChanging = true;
                var that = this;
                try {
                    this.onRender();
                } catch(e) {
                    console.error("Error on rendering. e:", e);
                }
                that.isChanging = false;
                
            }
        },
        onModeTypeChange: function() {
            this.getSettings();
            if (this.options.mode == "laser") {
                 $('#' + this.id + ' .mode-laser').removeClass("hidden");
                 $('#' + this.id + ' .mode-mill').addClass("hidden");
            } else {
                 $('#' + this.id + ' .mode-laser').addClass("hidden");
                 $('#' + this.id + ' .mode-mill').removeClass("hidden");
            } 
            this.generateGcode();
        },
        onRender: function(callback) {
            
            // make sure we have all the 3d viewer pointers correctly received back
            // from 3d viewer. we may not have them based on loading order.
            if (this.obj3d && this.obj3dmeta && this.obj3dmeta.widget) {
                // we are good to go
            } else {
                // we do not have them
                // init3d will re-enter this method and then should not hit this else statement
                this.init3d();
                return;
            }
            
            this.clear3dViewer();
          
            // get the user settings from the UI
            this.getSettings();
            
            var that = this;
            
            // read in the svg text and draw it as three.js object in the 3d viewer
            this.drawSvg();
            // setTimeout(this.drawSvg.bind(this), 5000);
            //that.generateGcode();
            
            //this.extractSvgPathsFromSVGFile(this.options.svg);
            
            // actually render the text
            // this.drawText(function() {
                
            //     that.generateGcode();
                
            //     if (callback) callback();
            // });    
        },
        getSettings: function() {
            // get text
            this.options["svg"] = $('#' + this.id + ' .input-svg').val();
            this.options["pointsperpath"] = parseInt($('#' + this.id + ' .input-pointsperpath').val());
            
            this.options["holes"] = $('#' + this.id + ' .input-holes').is(":checked");
            this.options["cut"] = $('#' + this.id + ' input[name=com-chilipeppr-widget-svg2gcode-cut]:checked').val();
            this.options["dashPercent"] = $('#' + this.id + ' .input-dashPercent').val();
            this.options["mode"] = $('#' + this.id + ' input[name=com-chilipeppr-widget-svg2gcode-mode]:checked').val();
            this.options["laseron"] = $('#' + this.id + ' input[name=com-chilipeppr-widget-svg2gcode-laseron]:checked').val();
            this.options["lasersvalue"] = $('#' + this.id + ' .input-svalue').val();
            this.options["millclearanceheight"] = parseFloat($('#' + this.id + ' .input-clearance').val());
            this.options["milldepthcut"] = parseFloat($('#' + this.id + ' .input-depthcut').val());
            this.options["millfeedrateplunge"] = $('#' + this.id + ' .input-feedrateplunge').val();
            this.options["inflate"] = parseFloat($('#' + this.id + ' .input-inflate').val());
            this.options["feedrate"] = $('#' + this.id + ' .input-feedrate').val();
            //console.log("settings:", this.options);    
            
            this.saveOptionsLocalStorage();
        },
        /**
         * Called when user changes inflate value.
         */
        onInflateChange: function(evt) {
            console.log("onInflateChange. evt:");
            
            this.getSettings();
            
            if (this.inflateGrp) this.svgGroup.remove(this.inflateGrp);
            
            if (this.options.inflate != 0) {
                console.log("user wants to inflate. val:", this.options.inflate);
                
                // save the original path and make a new one so we can go back to the original
                if (!('svgGroupOriginal' in this)) {
                    console.log("creating original store");
                    // no original stored yet
                    this.svgParentGroupOriginal = this.svgParentGroup;
                    this.svgGroupOriginal = this.svgGroup;
                } else {
                    console.log("restoring original");
                    // restore original
                    this.svgParentGroup = this.svgParentGroupOriginal;
                    this.svgGroup = this.svgGroupOriginal;
                }

                var grp = this.svgGroup;
                
                var clipperPaths = [];
                
                var that = this;
                grp.traverse( function(child) {
                    
                    if (child.name == "inflatedGroup") {
                        console.log("this is the inflated path from a previous run. ignore.");
                        return;
                    }
                    else if (child.type == "Line") {
                        
                        // let's inflate the path for this line. it may not be closed
                        // so we need to check that.
                        
                        //var threeObj = that.inflateThreeJsLineShape(child, that.options.inflate);
                        var clipperPath = that.threeJsVectorArrayToClipperArray(child.geometry.vertices);
                        clipperPaths.push(clipperPath);
                        
                        // hide for now. we can unhide later if we reset.
                        //child.visible = false;
                        child.material.color = 0x000000;
                        child.material.transparent = true;
                        child.material.opacity = 0.2;
                        
                        // for now add to existing object
                        // eventually replace it
                        //grp.add(threeObj);
                    } 
                    else if (child.type == "Points") {
                        child.visible = false;
                    } 
                    else {
                        console.log("type of ", child.type, " being skipped");
                    }
                });
                
                console.log("clipperPaths:", clipperPaths);
                
                // simplify this set of paths which is a very powerful Clipper call that
                // figures out holes and path orientations
                var newClipperPaths = this.simplifyPolygons(clipperPaths);
                
                // get the inflated/deflated path
                var inflatedPaths = this.getInflatePath(newClipperPaths, this.options.inflate);
                
                // we now have a huge array of clipper paths
                console.log("newClipperPaths:", newClipperPaths);
                this.inflateGrp = this.drawClipperPaths(inflatedPaths, 0x0000ff, 0.99, 0.01, 0, true, false, "inflatedGroup");
                //threeObj.name = "inflatedGroup";
                
                //this.svgParentGroup.remove(this.svgGroup);
                //this.svgParentGroup.add(threeObj);
                this.svgGroup.add(this.inflateGrp);
                
                //grp.add(threeObj);
                
                this.wakeAnimate();
            }
        },
        simplifyPolygons: function(paths) {
            
            var scale = 10000;
            ClipperLib.JS.ScaleUpPaths(paths, scale);
            
            var newClipperPaths = ClipperLib.Clipper.SimplifyPolygons(paths, ClipperLib.PolyFillType.pftEvenOdd);
            
            // scale back down
            ClipperLib.JS.ScaleDownPaths(newClipperPaths, scale);
            ClipperLib.JS.ScaleDownPaths(paths, scale);
            return newClipperPaths;
            
                
        },
        drawClipperPaths: function (paths, color, opacity, z, zstep, isClosed, isAddDirHelper, name) {
            console.log("drawClipperPaths");
            var lineUnionMat = new THREE.LineBasicMaterial({
                color: color,
                transparent: true,
                opacity: opacity
            });

            if (z === undefined || z == null)
                z = 0;

            if (zstep === undefined || zstep == null)
                zstep = 0;

            if (isClosed === undefined || isClosed == null)
                isClosed = true;
            
            var group = new THREE.Object3D();
            if (name) group.name = name;

            for (var i = 0; i < paths.length; i++) {
                var lineUnionGeo = new THREE.Geometry();
                for (var j = 0; j < paths[i].length; j++) {
                    var actualZ = z;
                    if (zstep != 0) actualZ += zstep * j;
                    lineUnionGeo.vertices.push(new THREE.Vector3(paths[i][j].X, paths[i][j].Y, actualZ));
                    
                    // does user want arrow helper to show direction
                    if (isAddDirHelper) {
                        /*
                        var pt = { X: paths[i][j].X, Y: paths[i][j].Y, Z: actualZ };
                        var ptNext;
                        if (j + 1 >= paths[i].length)
                            ptNext = {X: paths[i][0].X, Y: paths[i][0].Y, Z: actualZ };
                        else
                            ptNext = {X: paths[i][j+1].X, Y: paths[i][j+1].Y, Z: actualZ };
                        // x2-x1,y2-y1
                        var dir = new THREE.Vector3( ptNext.X - pt.X, ptNext.Y - pt.Y, ptNext.Z - pt.Z );
                        var origin = new THREE.Vector3( pt.X, pt.Y, pt.Z );
                        var length = 0.1;
                        var hex = 0xff0000;
                        
                        var arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
                        group.add( arrowHelper );
                        */
                    }
                }
                // close it by connecting last point to 1st point
                if (isClosed) lineUnionGeo.vertices.push(new THREE.Vector3(paths[i][0].X, paths[i][0].Y, z));


                var lineUnion = new THREE.Line(lineUnionGeo, lineUnionMat);
                if (name) lineUnion.name = name;
                
                //lineUnion.position.set(0,-20,0);
                group.add(lineUnion);
            }
            //this.sceneAdd(group);
            return group;
        },
        /**
         * Pass in a THREE.Line that is closed, meaning it was from a real shape and the end point
         * equals the start point because Clipper requires that. Make sure the
         * holes have a userData value of threeLine.userData.isHole = true so we know to deflate those
         * instead of inflate. To inflate by 3mm
         * have delta = 3. You can also set delta to a negative number to deflate.
         * We will return a new THREE.Line object or if multiple paths end up getting created
         * we will return a new THREE.Group() containing THREE.Line objects.
         */
        inflateThreeJsLineShape: function(threeLine, delta) {
            // debugger;
            console.log("inflateThreeJsLineShape. threeLine:", threeLine, "delta:", delta);
            
            // convert Vector3 array to Clipper array
            var clipperPath = this.threeJsVectorArrayToClipperArray(threeLine.geometry.vertices);
            
            // double check there are points in array
            if (clipperPath.length == 0) {
                console.error("You did not pass in a THREE.Line that had any vertices. Huh?");
            }
            
            // double check that end point equals start point
            if (clipperPath[0].X != clipperPath[clipperPath.length-1].X &&
            clipperPath[0].Y != clipperPath[clipperPath.length-1].Y) {
                console.error("Your start and end points do not match, so this is not a closed path therefore you cannot inflate it. Please close the path first.");
            }

            // check winding order
            var orientation = ClipperLib.Clipper.Orientation(clipperPath);
            console.log("orientation:", orientation);
            
            // check if hole
            var isHole = false;
            if (threeLine.userData.isHole) {
                isHole = true;
                delta = -1 * delta;
            } else {
                // it's not a hole
                if (orientation == true) {
                    // the winding order is correct
                } else {
                    // reverse it for correct winding order
                    clipperPath.reverse();
                }
            }
            var orientation = ClipperLib.Clipper.Orientation(clipperPath);
            console.log("orientation:", orientation);
            
            // get inflate path. we will get back possibly multiple paths because an inflate
            // or deflate can create dangling holes, etc.
            var inflatedPaths = this.getInflatePath([clipperPath], delta);
            
            var retObj;
            
            if (inflatedPaths.length == 1) {
                
                // we only got one path back. cool.
                var newThreeLine = threeLine.clone();
                newThreeLine.geometry.vertices = this.clipperArrayToThreeJsVectorArray(inflatedPaths[0]);
                newThreeLine.geometry.verticesNeedUpdate = true;
                retObj = newThreeLine;
                
            } else {
                
                var newGroup = new THREE.Group();
                
                // loop thru returned paths
                for (var i in inflatedPaths) {
                    var inflatedPath = inflatedPaths[i];
                    
                    // convert back to THREE.Line
                    var newThreeLine = threeLine.clone();
                    newThreeLine.geometry.vertices = this.clipperArrayToThreeJsVectorArray(inflatedPath);
                    newGroup.add(newThreeLine);
                }
                
                retObj = newGroup;
            }
            
            return retObj;
            
        },
        /**
         * Pass in something like geometry.vertices which is an array of Vector3's and
         * this method will pass back an array with Clipper formatting of [{X:nnn, Y:nnn}].
         */
        threeJsVectorArrayToClipperArray: function(threeJsVectorArray) {
            var clipperArr = [];
              for (i = 0; i < threeJsVectorArray.length; i++) {
                var pt = threeJsVectorArray[i];
                clipperArr.push({X: pt.x, Y: pt.y});
            }
            return clipperArr;
        },
        /**
         * Pass in an array with Clipper formatting of [{X:nnn, Y:nnn}]. We will pass back
         * an array of Vector3's so you can set it to your geometry.vertices.
         */
        clipperArrayToThreeJsVectorArray: function(clipperArr) {
            var threeJsVectorArray = [];
            for (var i in clipperArr) {
                var pt = clipperArr[i];
                threeJsVectorArray.push(new THREE.Vector3(pt.X, pt.Y, 0));
            }
            return threeJsVectorArray;
        },
        /**
         * Pass in an array of an array of paths or holes. For example, pass in
         * paths = [[{X:0, Y:0}, {X:10:Y0}, {X:10, Y:10}, {X:0, Y:0}]. Your path must
         * be closed so the end point must equal the start point. To inflate by 3mm
         * have delta = 3. You can also set delta to a negative number to deflate. Make
         * sure the winding order is correct as well.
         */
        getInflatePath: function (paths, delta, joinType) {
            var scale = 10000;
            ClipperLib.JS.ScaleUpPaths(paths, scale);
            var miterLimit = 2;
            var arcTolerance = 10;
            joinType = joinType ? joinType : ClipperLib.JoinType.jtRound
            var co = new ClipperLib.ClipperOffset(miterLimit, arcTolerance);
            co.AddPaths(paths, joinType, ClipperLib.EndType.etClosedPolygon);
            //var delta = 0.0625; // 1/16 inch endmill
            var offsetted_paths = new ClipperLib.Paths();
            co.Execute(offsetted_paths, delta * scale);

            // scale back down
            ClipperLib.JS.ScaleDownPaths(offsetted_paths, scale);
            ClipperLib.JS.ScaleDownPaths(paths, scale);
            return offsetted_paths;

        },
        generateGcodeTimeoutPtr: null,
        isGcodeInRegeneratingState: false,
        /**
         * This method will trigger a process to generateGcode however, it
         * allows this to be called a bunch of times and it will always wait
         * to do the generate about 1 second later and de-dupe the multiple calls.
         */
         generateGcode: function() {
            // this may be an odd place to trigger gcode change, but this method
            // is called on all scaling changes, so do it here for now
            if (this.generateGcodeTimeoutPtr) {
                //console.log("clearing last setTimeout for generating gcode cuz don't need anymore");
                clearTimeout(this.generateGcodeTimeoutPtr);
            }
            if (!this.isGcodeInRegeneratingState) {
                $('#' + this.id + " .gcode").prop('disabled', true);
                $('#' + this.id + " .btn-sendgcodetows").prop('disabled', true);
                
                $('#' + this.id + " .regenerate").removeClass('hidden');
                $('#' + this.id + " .gcode-size-span").addClass('hidden');
                // set this to true so next time we are called fast we know we don't have
                // to set the UI elements again. they'll get set back and this flag after
                // the gcode is generated
                this.isGcodeInRegeneratingState = true;

            } else {
                // do nothing
                //console.log("already indicated in UI we have to regenerate");
            }
            this.generateGcodeTimeoutPtr = setTimeout(this.generateGcodeCallback.bind(this), 1000);
         },
        /**
         * Iterate over the text3d that was generated and create
         * Gcode to mill/cut the three.js object.
         */
        generateGcodeCallback: function() {
            
            // get settings
            this.getSettings();
            
            var g = "(Gcode generated by ChiliPeppr Svg2Gcode Widget)\n";
            //g += "(Text: " + this.mySceneGroup.userData.text  + ")\n";
            g += "G21 (mm)\n";
            
            // get the THREE.Group() that is the txt3d
            var grp = this.svgGroup;
            var txtGrp = this.svgGroup;

            var that = this;
            var isLaserOn = false;
            var isAtClearanceHeight = false;
            var isFeedrateSpecifiedAlready = false;
            txtGrp.traverse( function(child) {
                if (child.type == "Line") {
                    // let's create gcode for all points in line
                    for (i = 0; i < child.geometry.vertices.length; i++) {
                        var localPt = child.geometry.vertices[i];
                        var worldPt = grp.localToWorld(localPt.clone());
                        
                        if (i == 0) {
                            // first point in line where we start lasering/milling
                            // move to point
                            
                            // if milling, we need to move to clearance height
                            if (that.options.mode == "mill") {
                                if (!isAtClearanceHeight) {
                                    g += "G0 Z" + that.options.millclearanceheight + "\n";
                                }
                            }
                            
                            // move to start point
                            g += "G0 X" + worldPt.x.toFixed(3) + 
                                " Y" + worldPt.y.toFixed(3) + "\n";
                            
                            // if milling move back to depth cut
                            if (that.options.mode == "mill") {
                                var halfDistance = (that.options.millclearanceheight - that.options.milldepthcut) / 2;
                                g += "G0 Z" + (that.options.millclearanceheight - halfDistance).toFixed(3)
                                    + "\n";
                                g += "G1 F" + that.options.millfeedrateplunge + 
                                    " Z" + that.options.milldepthcut + "\n";
                                isAtClearanceHeight = false;
                            }
                            
                        }
                        else {
                            
                            // we are in a non-first line so this is normal moving
                            
                            // see if laser or milling
                            if (that.options.mode == "laser") {
                                
                                // if the laser is not on, we need to turn it on
                                if (!isLaserOn) {
                                    if (that.options.laseron == "M3") {
                                        g += "M3 S" + that.options.lasersvalue;
                                    } else {
                                        g += that.options.laseron;
                                    }
                                    g += " (laser on)\n";
                                    isLaserOn = true;
                                }
                            } else {
                                // this is milling. if we are not at depth cut
                                // we need to get there
                                
                                
                            }
                            
                            // do normal feedrate move
                            var feedrate;
                            if (isFeedrateSpecifiedAlready) {
                                feedrate = "";
                            } else {
                                feedrate = " F" + that.options.feedrate;
                                isFeedrateSpecifiedAlready = true;
                            }
                            g += "G1" + feedrate + 
                                " X" + worldPt.x.toFixed(3) + 
                                " Y" + worldPt.y.toFixed(3) + "\n";
                        }
                    }
                    
                    // make feedrate have to get specified again on next line
                    // if there is one
                    isFeedrateSpecifiedAlready = false;
                    
                    // see if laser or milling
                    if (that.options.mode == "laser") {
                        // turn off laser at end of line
                        isLaserOn = false;
                        if (that.options.laseron == "M3")
                            g += "M5 (laser off)\n";
                        else
                            g += "M9 (laser off)\n";
                    } else {
                        // milling. move back to clearance height
                        g += "G0 Z" + that.options.millclearanceheight + "\n";
                        isAtClearanceHeight = true;
                    }
                }
            });
            
            console.log("generated gcode. length:", g.length);
            //console.log("gcode:", g);
            $('#' + this.id + " .gcode").val(g).prop('disabled', false);
            $('#' + this.id + " .btn-sendgcodetows").prop('disabled', false);
            $('#' + this.id + " .regenerate").addClass('hidden');
            $('#' + this.id + " .gcode-size-span").removeClass('hidden');
            $('#' + this.id + " .gcode-size").text(parseInt(g.length / 1024) + "KB");

            this.isGcodeInRegeneratingState = false;

        },
        /**
         * Contains the SVG rendered Three.js group with everything in it including
         * the textbox handles and the marquee. So this is not the Three.js object
         * that only contains the SVG that was rendered. Use svgGroup for that which
         * is a child.
         */
        svgParentGroup: null,
        /**
         * Contains the actual rendered SVG file. This is where the action is.
         */
        svgGroup: null,
        /**
         * Contains the original path from SVG file. This is like layer 1 of the rendering.
         */
        svgPath: null,
        /**
         * Contains the inflated/deflated path. This is like layer 2 of the rendering. If no
         * inflate/deflate was asked for by user, this path is still generated but at 0 inflate.
         */
        svgInflatePath: null,
        /**
         * Contains the dashed/solid path which is generated from svgInflatePath. This is like
         * layer 3 of the rendering. Solid is the default, so if no inflate or dash then this path
         * is like a copy of the original svgPath.
         */
        svgSolidDashPath: null,
        /**
         * Contains the toolpath path if user is doing milling and wants to move the path to a
         * different Z layer. This is like layer 4 of the rendering.
         */
        svgToolPath: null,
        /**
         * Contains the particle we map the width textbox 3d to 2d screen projection.
         */
        widthParticle: null,
        /**
         * Contains the particle we map the height textbox 3d to 2d screen projection.
         */
        heightParticle: null,
        /**
         * Contains the particle we map the lower/left corner of marquee.
         */
        alignBoxParticle: null,
        drawSvg: function() {
            
            // see if file is valid
            if (this.options.svg.length == 0) return;
            
            var error = this.extractSvgPathsFromSVGFile(this.options.svg);
            if (error) {
                // do nothing
                console.warn("there was an error with svg file");
            } else {
                this.mySceneGroup = this.svgParentGroup;
                this.sceneReAddMySceneGroup();    
                
                // get the new 3d viewer object centered on camera
                chilipeppr.publish('/com-chilipeppr-widget-3dviewer/viewextents' );
    
                // make sure camera change triggers
                //setTimeout(this.onCameraChange.bind(this), 50);
                this.onCameraChange(); //.bind(this);
                
                this.generateGcode();
            }
        },
        extractSvgPathsFromSVGFile: function(file) {
            
            var fragment = Snap.parse(file);
            console.log("fragment:", fragment);

            // make sure we get 1 group. if not there's an error
            var g = fragment.select("g");
            console.log("g:", g);
            if (g == null) {
                
                // before we give up if there's not one group, check
                // if there are just paths inlined
                var pathSet = fragment.selectAll("path");
                if (pathSet == null) {

                    $('#' + this.id + " .error-parse").removeClass("hidden");
                    return true;
                    
                } else {
                    console.log("no groups, but we have some paths so proceed to code below.");
                }
                
            }
            $('#' + this.id + " .error-parse").addClass("hidden");
            
            var groups = fragment.selectAll("g");
            console.log("groups:", groups);
            
            if (groups.length > 1) {
                console.warn("too many groups in svg. need a flattened svg file.");
                $('#' + this.id + " .error-flattened").removeClass("hidden");
                return true;
            }
            $('#' + this.id + " .error-flattened").addClass("hidden");

            var svgGroup = new THREE.Group();
            svgGroup.name = "svgpath";
            
            var that = this;
            
            var opts = that.options;
            console.log("opts:", opts);
            
            var pathSet = fragment.selectAll("path");
            
            pathSet.forEach( function(path, i) {
                
                //if (i > 4) return;
                
                // handle transforms
                //var path = p1.transform(path.matrix);
    
                console.log("working on path:", path);
                console.log("len:", path.getTotalLength());
                // console.log("path.parent:", path.parent());
                
                // if the parent path is a clipPath, then toss it
                if (path.parent().type.match(/clippath/i)) {
                    console.warn("found a clippath. skipping. path:", path);
                    return;
                }
                
                // use Snap.svg to translate path to a global set of coordinates
                // so the xy values we get are in global values, not local
                console.log("path.transform:", path.transform());
                path = path.transform(path.transform().global);
                // see if there is a parent transform
                if (path.parent()) {
                    console.log("there is a parent. see if transform. path.parent().transform()", path.parent().transform());
                    //path = path.transform(path.parent().transform().global);
                }
                //path = path.parent().path();
                //console.log("svg path:", path, "len:", path.getTotalLength());
                
                /* This was an area where we used snap.svg to render using
                spaced points, but it did not create good resolution. So
                using alternate approach that is more direct. */
                /*
                var len = path.getTotalLength();
                var lenPerPt = len / that.options.pointsperpath;
                console.log("len:", len, "lenPerPt:", lenPerPt, "pointsperpath:", that.options.pointsperpath);
                
                var spacedPoints = new THREE.Geometry();
                
                for (var i = 0; i < that.options.pointsperpath; i++ ) {
                    var pt = path.getPointAtLength(lenPerPt * i);
                    //console.log("pt:", pt);
                    spacedPoints.vertices.push(new THREE.Vector3(pt.x, pt.y, 0));
                }
                
                var material = new THREE.LineBasicMaterial({
                    	color: 0x0000ff
                    });
    
                
                var particles = new THREE.Points( spacedPoints, new THREE.PointsMaterial( { color: 0xff0000, size: 1 } ) );
    		    particles.position.z = 1;
    		    //svgGroup.add(particles);
    		    
                // solid line
    			var line = new THREE.Line( spacedPoints, material );
    			line.position.x = 0.5;
    			//svgGroup.add( line );    
                */
                
                var material = new THREE.LineBasicMaterial({
                    	color: 0x0000ff
                    });
                
                
                // use transformSVGPath
                console.log("working on path:", path);
                //debugger;
                var paths = that.transformSVGPath(path.realPath);
                // var paths = that.transformSVGPath(path.attr('d'));
                for (var pathindex in paths) {
                    
                    var shape = paths[pathindex];
                    
                    shape.autoClose = true;
                    console.log("shape:", shape);
                    
                    if (opts.cut == "dashed") {
    				    
    				    // figure out how many points to generate
    				    var ptCnt = shape.getLength() / (opts.dashPercent / 10);
    				    //console.log("ptCnt:", ptCnt);
    				    shape.autoClose = false;
    				    var spacedPoints = shape.createSpacedPointsGeometry( ptCnt );
    				    console.log("spacedPoints", spacedPoints);
    				    
    				    // we need to generate a ton of lines
    				    // rather than one ongoing line
    				    var isFirst = true;
    				    var mypointsGeo = new THREE.Geometry();
    				        
    				    for (var iv in spacedPoints.vertices) {
    				        var pt = spacedPoints.vertices[iv];
    				        //console.log("pt:", pt, "isFirst:", isFirst, "mypointsGeo:", mypointsGeo);
    				        
    				        if (isFirst) {
    				            // first point, start the line
    				            mypointsGeo = new THREE.Geometry(); // reset array to empty
    				            mypointsGeo.vertices[0] = pt;
        				        isFirst = false;
    				        } else {
    				            // is second point, finish the line
    				            mypointsGeo.vertices[1] = pt;
    				            var line = new THREE.Line( mypointsGeo, material );
    				            svgGroup.add( line );
    				            isFirst = true;
    				        }
    				        //console.log("working on point:", pt);
    				    }
    				    //charGroup.add( line );
    				    
    				    var particles = new THREE.Points( spacedPoints, new THREE.PointsMaterial( { color: 0xff0000, size: opts.size / 10 } ) );
    				    particles.position.z = 1;
    				    //charGroup.add(particles);
    				    
    				} else {
        				// solid line
	                    var geometry = new THREE.ShapeGeometry( shape );
                        var lineSvg = new THREE.Line( geometry, material );
            			svgGroup.add(lineSvg);
            			
            			var particles = new THREE.Points( geometry, new THREE.PointsMaterial( { 
            			    color: 0xff0000, 
            			    size: 1,
            			    opacity: 0.5,
            			    transparent: true
            			} ) );
            		    //particles.position.z = 1;
            		    svgGroup.add(particles);
    				}
                    

                }
                
            });
            
            // since svg has top left as 0,0 we need to flip
            // the whole thing on the x axis to get 0,0
            // on the lower left like gcode uses
            svgGroup.scale.y = -1;

            // shift whole thing so it sits at 0,0
            
            var bbox = new THREE.Box3().setFromObject(svgGroup);
    				
            console.log("bbox for shift:", bbox);
			svgGroup.position.x += -1 * bbox.min.x;
			svgGroup.position.y += -1 * bbox.min.y;
			//textGroup.position.z = 0;

            // now that we have an svg that we have flipped and shifted to a zero position
            // create a parent group so we can attach some point positions for width/height
            // handles for the floating textboxes and a marquee
            var svgParentGroup = new THREE.Group();
            svgParentGroup.name = "SvgParentGroup";
            svgParentGroup.add(svgGroup);

            // Add marquee bounding box
            var bbox = new THREE.BoundingBoxHelper( svgParentGroup, 0xff0000 );
            bbox.update();
            var boxHelper = new THREE.BoxHelper( bbox );
            boxHelper.position.z = 0.05;
            boxHelper.material = dashMat;
            
            var dashMat = new THREE.LineDashedMaterial( { 
                color: 0x666666, 
                dashSize: 1, 
                gapSize: 1, 
                linewidth: 2 } )
		    var geometry  = new THREE.Geometry().fromBufferGeometry( boxHelper.geometry );
            geometry.computeLineDistances();
            //var object = new THREE.LineSegments(geometry , new THREE.LineDashedMaterial( { color: 0xffaa00, dashSize: 3, gapSize: 1, linewidth: 2 } ) );
            var object = new THREE.Line( geometry, dashMat );
            object.position.z = 0.05;
            svgParentGroup.add(object);
            console.log("boxHelper:", boxHelper);
            //boxHelper.geometry.computeLineDistances();
            //svgGroup.add( boxHelper );
            
            // create width / height textbox 3d objects so we can
            // project 3d coords to 2d screen coords
            console.log("bbox to figure out height/width locations:", bbox.box);
            
            var widthPt = new THREE.Vector3(bbox.box.max.x / 2, bbox.box.min.y, 0);
            var widthGeo = new THREE.Geometry();
            //widthGeo.vertices.push(widthPt);
            widthGeo.vertices.push(new THREE.Vector3(0,0,0));
            var widthParticle = new THREE.Points( widthGeo, new THREE.PointsMaterial( { color: 0x0000ff, size: 5 } ) );
            widthParticle.position.x = widthPt.x;
            widthParticle.position.y = widthPt.y;
            svgParentGroup.add(widthParticle);
		    
            var heightPt = new THREE.Vector3(bbox.box.min.x, bbox.box.max.y / 2, 0);
            var heightGeo = new THREE.Geometry();
            heightGeo.vertices.push(new THREE.Vector3(0,0,0));
            var heightParticle = new THREE.Points( heightGeo, new THREE.PointsMaterial( { color: 0x00ff00, size: 5 } ) );
		    heightParticle.position.x = heightPt.x;
		    heightParticle.position.y = heightPt.y;
		    svgParentGroup.add(heightParticle);

            var alignBoxPt = new THREE.Vector3(bbox.box.min.x, bbox.box.min.y, 0);
            var alignBoxGeo = new THREE.Geometry();
            alignBoxGeo.vertices.push(new THREE.Vector3(0,0,0));
            var alignBoxParticle = new THREE.Points( alignBoxGeo, new THREE.PointsMaterial( { color: 0xffff00, size: 5 } ) );
		    alignBoxParticle.position.x = alignBoxPt.x;
		    alignBoxParticle.position.y = alignBoxPt.y;
		    svgParentGroup.add(alignBoxParticle);
		    
		    this.widthParticle = widthParticle;
		    this.heightParticle = heightParticle;
		    this.alignBoxParticle = alignBoxParticle;
		    
            this.svgParentGroup = svgParentGroup;
            this.svgGroup = svgGroup;
            
		    // now create our floating menus
		    this.createFloatItems();
		    
		    return false;

        },
        isFloatItemsSetup: false,
        /**
         * Contains the originally sized bounding box for the SVG
         * right after it is imported. This is used to calculate scale
         * as the user enters a new width/height value.
         */
        originalBbox: null,
        /**
         * Create a width and height size change textbox that floats over
         * the bounding box of the SVG to let user adjust width and height
         * of the imported vector image.
         */
        createFloatItems: function() {
            console.log("createFloatItems. this.obj3dmeta:", this.obj3dmeta); 
            
            // move width/height textboxes to top of DOM
            // because their absolute positioning requires that
            if (this.isFloatItemsSetup == false) {
                
                // we need to attach to the controls onchange event so
                // if the user moves the 3d viewer around we re-render where
                // we place the textboxes
                this.obj3dmeta.widget.controls.addEventListener(
                    'change', this.onCameraChange.bind(this)
                );
                
                $('.test-info').text("did detach");
                // move them and
                // setup the onchange events
                $('#' + this.id + "-widthbox")
                    .detach().appendTo( "body" )
                    .change(this.onWidthChange.bind(this))
                    .removeClass("hidden");
                $('#' + this.id + "-heightbox")
                    .detach().appendTo( "body" )
                    .change(this.onHeightChange.bind(this))
                    .removeClass("hidden");
                    // TODO add onchange
                $('#' + this.id + "-alignbox")
                    .detach().appendTo( "body" )
                    .removeClass("hidden");
                this.isFloatItemsSetup = true;
                
                // if window resizes, reset the camera and textboxes
                $(window).resize(this.onCameraChange.bind(this));
                
                // setup aspect locked button 
                $('#' + this.id + "-widthbox .btn-aspect").click(this.onAspectLockedBtnClick.bind(this));
                $('#' + this.id + "-heightbox .btn-aspect").click(this.onAspectLockedBtnClick.bind(this));

                // setup align buttons
                $('#' + this.id + "-alignbox button").click(this.onAlignButtonClicked.bind(this));
                
                // setup xy value changes
                $('#' + this.id + "-alignbox .input-x").on("change", this.onXYChange.bind(this));
                $('#' + this.id + "-alignbox .input-y").on("change", this.onXYChange.bind(this));
            
            } else {
                console.warn("divs already positioned");
                this.showFloatItems();
            }
            
            // setup width and height values in the textboxes
            var bbox = new THREE.Box3().setFromObject(this.svgParentGroup);
            console.log("creating textboxes. bbox:", bbox);
            bbox["width"] = bbox.max.x - bbox.min.x;
            bbox["height"] = bbox.max.y - bbox.min.y;
            this.originalBbox = bbox;
            $('#' + this.id + "-widthbox .input-widthbox").val(bbox.width.toFixed(3));
            $('#' + this.id + "-heightbox .input-heightbox").val(bbox.height.toFixed(3));
            $('#' + this.id + "-alignbox .input-x").val("0");
            $('#' + this.id + "-alignbox .input-y").val("0");
            
            // we now need to reposition our textboxes as if the camera was moved
            //setTimeout(this.onCameraChange.bind(this), 50);
            this.onCameraChange(); //.bind(this);
            
        },
        showFloatItems: function() {
            $('#' + this.id + "-widthbox").removeClass("hidden");
            $('#' + this.id + "-heightbox").removeClass("hidden");
            $('#' + this.id + "-alignbox").removeClass("hidden");
        },
        hideFloatItems: function() {
            $('#' + this.id + "-widthbox").addClass("hidden");
            $('#' + this.id + "-heightbox").addClass("hidden");
            $('#' + this.id + "-alignbox").addClass("hidden");
        },
        onAlignButtonClicked: function(evt) {
            var tEl = $(evt.currentTarget);
            console.log("align btn clicked. evt:", evt, tEl);
            
            var bbox = new THREE.Box3().setFromObject(this.svgGroup);
            console.log("bbox:", bbox);
            
            if (tEl.hasClass("btn-vert-left")) {
                // align vertical left of center
                console.log("vert align left");
                this.svgParentGroup.position.x = -1 * (bbox.max.x - bbox.min.x);
            }
            else if (tEl.hasClass("btn-vert-center")) {
                console.log("vert align center");
                this.svgParentGroup.position.x = -1 * (bbox.max.x - bbox.min.x) / 2;
            }
            else if (tEl.hasClass("btn-vert-right")) {
                console.log("vert align right");
                this.svgParentGroup.position.x = 0; //(bbox.max.x - bbox.min.x) / 2;
            }
            else if (tEl.hasClass("btn-horiz-top")) {
                console.log("horiz align top");
                this.svgParentGroup.position.y = 0;
            }
            else if (tEl.hasClass("btn-horiz-middle")) {
                console.log("horiz align middle");
                this.svgParentGroup.position.y = -1 * (bbox.max.y - bbox.min.y) / 2;
            }
            else if (tEl.hasClass("btn-horiz-bottom")) {
                console.log("horiz align bottom");
                this.svgParentGroup.position.y = -1 * (bbox.max.y - bbox.min.y); 
            }
    
            $('#' + this.id + "-alignbox .input-x").val(this.svgParentGroup.position.x);
            $('#' + this.id + "-alignbox .input-y").val(this.svgParentGroup.position.y);
    
            //chilipeppr.publish('/com-chilipeppr-widget-3dviewer/viewextents' );
            this.obj3dmeta.widget.wakeAnimate();
            this.onCameraChange(); //.bind(this);
            this.generateGcode();
        },
        isAspectLocked: true,
        onAspectLockedBtnClick: function(evt) {
            console.log("aspect btn clicked");
            console.log("svg:", $('.' + this.id + "-textbox .svg-unlocked"));
            if (this.isAspectLocked) {
                // $('.' + this.id + "-textbox .aspect-txt").text("Aspect Unlocked");
                $('.' + this.id + "-textbox .svg-unlocked").each(function() { this.classList.remove("hidden");});
                $('.' + this.id + "-textbox .glyphicon-lock").addClass("hidden");
                
                this.isAspectLocked = false;
            } else {
                // $('.' + this.id + "-textbox .aspect-txt").text("Aspect Locked");
                $('.' + this.id + "-textbox .svg-unlocked").each(function() { this.classList.add("hidden");});
                $('.' + this.id + "-textbox .glyphicon-lock").removeClass("hidden");
                this.isAspectLocked = true;
            }
        },
        //widthHeightChangeTimeoutPtr: null,
        onWidthChange: function(evt) {
            console.log("onWidthChange. evt:", evt);
            // get new width
            var w = $('#' + this.id + "-widthbox .input-widthbox").val();
            // set scale
            var wScale = w / this.originalBbox.width;
            this.svgParentGroup.scale.x = wScale;
            this.svgParentGroup.scale.y = wScale;
            
            // calc new height since we have aspect ratio locked
            var h = this.originalBbox.height * wScale;
            $('#' + this.id + "-heightbox .input-heightbox").val(h.toFixed(3));
            
            // wake the 3d viewer just in case
            this.obj3dmeta.widget.wakeAnimate();

            // since the three.js objects were resized here
            // we need to reposition everything in the viewer
            // if (this.widthHeightChangeTimeoutPtr) {
                //console.log("cleared last timeout cuz don't need");
                // clearTimeout(this.widthHeightChangeTimeoutPtr);
            // }
            //this.widthHeightChangeTimeoutPtr = setTimeout(this.onCameraChange.bind(this), 100);
            this.onCameraChange(); //.bind(this);
            this.generateGcode();

        },
        onHeightChange: function(evt) {
            console.log("onHeightChange. evt:", evt);
            
            // get new height
            var h = $('#' + this.id + "-heightbox .input-heightbox").val();
            // set scale
            var hScale = h / this.originalBbox.height;
            this.svgParentGroup.scale.x = hScale;
            this.svgParentGroup.scale.y = hScale;
            
            // calc new width since we have aspect ratio locked
            var w = this.originalBbox.width * hScale;
            $('#' + this.id + "-widthbox .input-widthbox").val(w.toFixed(3));
            
            // wake the 3d viewer just in case
            this.obj3dmeta.widget.wakeAnimate();

            this.onCameraChange(); //.bind(this);
            this.generateGcode();
        },
        onXYChange: function(evt) {
            console.log("onXYChange. evt:", evt);
            
            this.svgParentGroup.position.x = $('#' + this.id + "-alignbox .input-x").val();
            this.svgParentGroup.position.y = $('#' + this.id + "-alignbox .input-y").val();
            
            // wake the 3d viewer just in case
            this.obj3dmeta.widget.wakeAnimate();

            this.onCameraChange(); //.bind(this);
            this.generateGcode();
        },
        cameraChangeTimeoutPtr: null,
        isCameraChangeTimeoutExist: false,
        /**
         * Call this method when the camera changes, or the user changed settings,
         * or you want to re-generate the Gcode. This method is smart that where it
         * allows you to call it very quickly over and over, like on mousedrag, but
         * it only updates every 100ms and cancels further calls in between updates.
         * The last call always executes though so you have a perfectly updated
         * 3D view.
         */
        onCameraChange: function() {
            if (this.isCameraChangeTimeoutExist) { //this.cameraChangeTimeoutPtr) {
                //console.log("clearing last setTimeout for cameraChangeTimeoutPtr cuz don't need anymore");
                clearTimeout(this.cameraChangeTimeoutPtr);
                //this.isCameraChangeTimeoutExist = false;
            }
            this.isCameraChangeTimeoutExist = true;
            this.cameraChangeTimeoutPtr = setTimeout(this.onCameraChangeCallback.bind(this), 30);
        },
        /**
         * The method that gets called 50ms later after onCameraChange() is called.
         */
        onCameraChangeCallback: function(evt) {
            
            // let other calls now come in since i'm executing
            this.isCameraChangeTimeoutExist = false;
            
            //console.log("got onCameraChange callback. evt:", evt);
            
            // position the textboxes
            // console.log("this.widthParticle:", this.widthParticle);
            var ptWidth = this.toScreenPosition(
                // this.svgParentGroup.localToWorld(
                    this.widthParticle //this.widthParticle.geometry.vertices[0].clone()
                // )
            );
            var ptHeight = this.toScreenPosition(
                // this.svgParentGroup.localToWorld(
                    this.heightParticle //.geometry.vertices[0].clone()
                // )
            );
            var ptAlignBox = this.toScreenPosition(
                // this.svgParentGroup.localToWorld(
                    this.alignBoxParticle //.geometry.vertices[0].clone()
                // )
            );
            // console.log("ptWidth:", ptWidth, "ptHeight:", ptHeight);
            $('#' + this.id + "-widthbox")
                .css('left', ptWidth.x + "px")
                .css('top', ptWidth.y + "px");
            $('#' + this.id + "-heightbox")
                .css('left', ptHeight.x + "px")
                .css('top', ptHeight.y + "px");
            $('#' + this.id + "-alignbox")
                .css('left', ptAlignBox.x + "px")
                .css('top', ptAlignBox.y + "px");
                
            //this.generateGcode();
        },
        drawDebugArrowHelperFor3DToScreenPosition: function() {
            var ptWidth = this.toScreenPosition(
                this.svgParentGroup.localToWorld(
                    this.widthParticle //.geometry.vertices[0].clone()
                )
            );
            
            var dir = this.vectorScreen; //ptWidth; //new THREE.Vector3( 1, 0, 0 );
            var origin = this.widthParticle.geometry.vertices[0].clone(); //new THREE.Vector3( 0, 0, 0 );
            var length = 10;
            var hex = 0xff0000;
            console.log("dir:", dir, "origin:", origin);
            
            var arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
            this.svgParentGroup.add( arrowHelper );
            var arrowHelper2 = new THREE.ArrowHelper( origin, dir, length, 0x0000ff );
            this.svgParentGroup.add( arrowHelper2 );
            
            console.log("obj3d", this.obj3dmeta, this.obj3d);
        },
        vectorScreen: null,
        toScreenPosition: function(object) {
            
            this.obj3dmeta.scene.updateMatrixWorld();
            var vector = new THREE.Vector3();
            vector.setFromMatrixPosition( object.matrixWorld );
            //var pt = this.svgParentGroup.localToWorld(object.position.clone());
            //var vector = pt.clone(); //new THREE.Vector3();
            var canvas = this.obj3dmeta.widget.renderer.domElement;
            
            // figure out width that is hi-dpi resolution independent
            var canvasWidth = canvas.width;
            if ($(canvas).css('width')) {
                // console.log("is a css width:", $(canvas).css('width'));
                canvasWidth = parseInt($(canvas).css('width'));
            }
            // canvasWidth = $( window ).width();
            
            var canvasHeight = canvas.height;
            if ($(canvas).css('height')) {
                // console.log("is a css height:", $(canvas).css('height'));
                canvasHeight = parseInt($(canvas).css('height'));
            }
            // canvasHeight = $( window ).height();
            
            // var width = $( window ).width();
            // var height = $( window ).height();
            var widthHalf = canvasWidth / 2, heightHalf = canvasHeight / 2;
            
            //console.log("canvasWidth:", canvasWidth, "canvasHeight:", canvasHeight);
            // vector.z = 1;
            //vector.set( 1, 2, 3 );
            
            // map to normalized device coordinate (NDC) space
            vector.project( this.obj3dmeta.camera );
            //console.log("vector after project:", vector);
            
            // create a copy of the vector that points to the screen coords for debug
            // so we can draw an arrowHelper to point at the xy that we want
            this.vectorScreen = vector.clone();
            
            // map to 2D screen space
            // the origin of the 3d viewere is 0,0 at the center of the screen
            // so we have to shift to the top/left to make it map for CSS positioning
            // vector.x = Math.round( (   vector.x + 1 ) * canvasWidth  / 2 ); // / 2,
            // vector.y = Math.round( ( - vector.y + 1 ) * canvasHeight / 2 ); // / 2;
            vector.x = ( vector.x * widthHalf ) + widthHalf;
            vector.y = - ( vector.y * heightHalf ) + heightHalf;  
            //vector.z = 1;
            return vector;
        },
        // this was from mr. doob and is a tad bit different from above
        toScreenPositionMrDoob: function(object) {
            
            console.log("toScreenPosition. object:", object);
            
            var width = $( window ).width();
            var height = $( window ).height();
            var widthHalf = width / 2, heightHalf = height / 2;
            
            var vector = new THREE.Vector3();
            var projector = new THREE.Projector();
            object.matrixWorldNeedsUpdate = true;
            projector.projectVector( vector.setFromMatrixPosition( object.matrixWorld ), this.obj3dmeta.camera );
            
            // create a copy of the vector that points to the screen coords for debug
            // so we can draw an arrowHelper to point at the xy that we want
            this.vectorScreen = vector.clone();
            
            vector.x = ( vector.x * widthHalf ) + widthHalf;
            vector.y = - ( vector.y * heightHalf ) + heightHalf;  
            
            return vector;
        },
        /**
         * Create a Three.js Mesh from a Three.js shape.
         */
        createShape: function( shape, color, x, y, z, rx, ry, rz, s ) {
          // flat shape
        
          var geometry = new THREE.ShapeGeometry( shape );
          var material = new THREE.MeshBasicMaterial({
            color: color, 
            side: THREE.DoubleSide, 
            overdraw: true
          });
          
          var mesh = new THREE.Mesh( geometry, material );
          mesh.position.set( x, y, z );
          mesh.rotation.set( rx, ry, rz );
          mesh.scale.set( s, s, s );
        
          return mesh;
        },
        /**
         * Turn an SVG Path into Three.js paths
         */
        transformSVGPath: function(pathStr) {
        
            // cleanup
            pathStr = pathStr.replace(/[\r\n]/g, " ");
            pathStr = pathStr.replace(/\s+/g, " ");
            
            // clean up scientific notation
            //pathStr = pathStr.replace(/\b([+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?)\b/ig, parseFloat(RegExp.$1).toFixed(4));
            if (pathStr.match(/\b([+\-\d]+e[+\-\d]+)\b/i)) {
                console.warn("found scientific notation. $1", RegExp.$1);
                pathStr = pathStr.replace(/\b([+\-\d]+e[+\-\d]+)\b/ig, parseFloat(RegExp.$1).toFixed(4));
            }
            console.log("pathStr:", pathStr);
            
        
          const DIGIT_0 = 48, DIGIT_9 = 57, COMMA = 44, SPACE = 32, PERIOD = 46,
              MINUS = 45;
        
          var DEGS_TO_RADS = Math.PI / 180;
          
          var path = new THREE.Shape();
          
          // this is an array that if there is only one shape, meaning
          // the path only has one m, then we will leave this as null
          // however, if there are multiple moveto's in a path, we will
          // actually create a new path for each one and return an array
          // instead
          var paths = [];
          
          var idx = 1, len = pathStr.length, activeCmd,
              x = 0, y = 0, nx = 0, ny = 0, firstX = null, firstY = null,
              x1 = 0, x2 = 0, y1 = 0, y2 = 0,
              rx = 0, ry = 0, xar = 0, laf = 0, sf = 0, cx, cy;
          
          function eatNum() {
            var sidx, c, isFloat = false, s;
            // eat delims
            while (idx < len) {
              c = pathStr.charCodeAt(idx);
              if (c !== COMMA && c !== SPACE)
                break;
              idx++;
            }
            if (c === MINUS)
              sidx = idx++;
            else
              sidx = idx;
            // eat number
            while (idx < len) {
              c = pathStr.charCodeAt(idx);
              if (DIGIT_0 <= c && c <= DIGIT_9) {
                idx++;
                continue;
              }
              else if (c === PERIOD) {
                idx++;
                isFloat = true;
                continue;
              }
              
              s = pathStr.substring(sidx, idx);
              return isFloat ? parseFloat(s) : parseInt(s);
            }
            
            s = pathStr.substring(sidx);
            return isFloat ? parseFloat(s) : parseInt(s);
          }
          
          function nextIsNum() {
            var c;
            // do permanently eat any delims...
            while (idx < len) {
              c = pathStr.charCodeAt(idx);
              if (c !== COMMA && c !== SPACE)
                break;
              idx++;
            }
            c = pathStr.charCodeAt(idx);
            return (c === MINUS || (DIGIT_0 <= c && c <= DIGIT_9));
          }
          
          // keep track if we have already gotten an M (moveto)
          var isAlreadyHadMoveTo = false;
          
          var canRepeat;
          activeCmd = pathStr[0];
          while (idx <= len) {
            canRepeat = true;
            console.log("swich on activeCmd:", activeCmd);
            
            switch (activeCmd) {
                // moveto commands, become lineto's if repeated
              case ' ':
                  console.warn("got space as activeCmd. skipping.");
                  break;
              case 'M':
                x = eatNum();
                y = eatNum();
                if (isAlreadyHadMoveTo) {
                    console.warn("we had a moveto already. so creating new path.")
                    paths.push(path);
                    path = new THREE.Shape();
                    firstX = x;
                    firstY = y;
                }
                isAlreadyHadMoveTo = true; // track that we've had a moveto so next time in we create new path
                path.moveTo(x, y);
                activeCmd = 'L';  // do lineTo's after this moveTo
                break;
              case 'm':
                x += eatNum();
                y += eatNum();
                if (isAlreadyHadMoveTo) {
                    console.warn("we had a moveto already. so creating new path.")
                    paths.push(path);
                    path = new THREE.Shape();
                    firstX = x;
                    firstY = y;
                }
                isAlreadyHadMoveTo = true; // track that we've had a moveto so next time in we create new path
                path.moveTo(x, y);
                activeCmd = 'l'; // do lineTo's after this moveTo
                break;
              case 'Z':
              case 'z':
                canRepeat = false;
                if (x !== firstX || y !== firstY)
                  path.lineTo(firstX, firstY);
                break;
                // - lines!
              case 'L':
              case 'H':
              case 'V':
                nx = (activeCmd === 'V') ? x : eatNum();
                ny = (activeCmd === 'H') ? y : eatNum();
                path.lineTo(nx, ny);
                x = nx;
                y = ny;
                break;
              case 'l':
              case 'h':
              case 'v':
                nx = (activeCmd === 'v') ? x : (x + eatNum());
                ny = (activeCmd === 'h') ? y : (y + eatNum());
                path.lineTo(nx, ny);
                x = nx;
                y = ny;
                break;
                // - cubic bezier
              case 'C':
                x1 = eatNum(); y1 = eatNum();
              case 'S':
                if (activeCmd === 'S') {
                  x1 = 2 * x - x2; y1 = 2 * y - y2;
                }
                x2 = eatNum();
                y2 = eatNum();
                nx = eatNum();
                ny = eatNum();
                path.bezierCurveTo(x1, y1, x2, y2, nx, ny);
                x = nx; y = ny;
                break;
              case 'c':
                x1 = x + eatNum();
                y1 = y + eatNum();
              case 's':
                if (activeCmd === 's') {
                  x1 = 2 * x - x2;
                  y1 = 2 * y - y2;
                }
                x2 = x + eatNum();
                y2 = y + eatNum();
                nx = x + eatNum();
                ny = y + eatNum();
                path.bezierCurveTo(x1, y1, x2, y2, nx, ny);
                x = nx; y = ny;
                break;
                // - quadratic bezier
              case 'Q':
                x1 = eatNum(); y1 = eatNum();
              case 'T':
                if (activeCmd === 'T') {
                  x1 = 2 * x - x1;
                  y1 = 2 * y - y1;
                }
                nx = eatNum();
                ny = eatNum();
                path.quadraticCurveTo(x1, y1, nx, ny);
                x = nx;
                y = ny;
                break;
              case 'q':
                x1 = x + eatNum();
                y1 = y + eatNum();
              case 't':
                if (activeCmd === 't') {
                  x1 = 2 * x - x1;
                  y1 = 2 * y - y1;
                }
                nx = x + eatNum();
                ny = y + eatNum();
                path.quadraticCurveTo(x1, y1, nx, ny);
                x = nx; y = ny;
                break;
                // - elliptical arc
              case 'a':
                  // TODO make relative?
                  nx = x + eatNum();
                  ny = y + eatNum();
              case 'A':
                rx = eatNum();
                ry = eatNum();
                xar = eatNum() * DEGS_TO_RADS;
                laf = eatNum();
                sf = eatNum();
                if (activeCmd == 'A') nx = eatNum();
                if (activeCmd == 'A') ny = eatNum();
                if (rx !== ry) {
                  console.warn("Forcing elliptical arc to be a circular one :(",
                               rx, ry);
                }
                // SVG implementation notes does all the math for us! woo!
                // http://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
                // step1, using x1 as x1'
                x1 = Math.cos(xar) * (x - nx) / 2 + Math.sin(xar) * (y - ny) / 2;
                y1 = -Math.sin(xar) * (x - nx) / 2 + Math.cos(xar) * (y - ny) / 2;
                // step 2, using x2 as cx'
                var norm = Math.sqrt(
                  (rx*rx * ry*ry - rx*rx * y1*y1 - ry*ry * x1*x1) /
                  (rx*rx * y1*y1 + ry*ry * x1*x1));
                if (laf === sf)
                  norm = -norm;
                x2 = norm * rx * y1 / ry;
                y2 = norm * -ry * x1 / rx;
                // step 3
                cx = Math.cos(xar) * x2 - Math.sin(xar) * y2 + (x + nx) / 2;
                cy = Math.sin(xar) * x2 + Math.cos(xar) * y2 + (y + ny) / 2;
                
                var u = new THREE.Vector2(1, 0),
                    v = new THREE.Vector2((x1 - x2) / rx,
                                          (y1 - y2) / ry);
                var startAng = Math.acos(u.dot(v) / u.length() / v.length());
                if (u.x * v.y - u.y * v.x < 0)
                  startAng = -startAng;
                
                // we can reuse 'v' from start angle as our 'u' for delta angle
                u.x = (-x1 - x2) / rx;
                u.y = (-y1 - y2) / ry;
                
                var deltaAng = Math.acos(v.dot(u) / v.length() / u.length());
                // This normalization ends up making our curves fail to triangulate...
                if (v.x * u.y - v.y * u.x < 0)
                  deltaAng = -deltaAng;
                if (!sf && deltaAng > 0)
                  deltaAng -= Math.PI * 2;
                if (sf && deltaAng < 0)
                  deltaAng += Math.PI * 2;
                
                path.absarc(cx, cy, rx, startAng, startAng + deltaAng, sf);
                x = nx;
                y = ny;
                break;
              default:
                throw new Error("weird path command: \"" + activeCmd + "\"");
            }
            if (firstX === null) {
              firstX = x;
              firstY = y;
            }
            // just reissue the command
            if (canRepeat && nextIsNum()) {
                console.log('we are repeating');
              continue;
            }
            activeCmd = pathStr[idx++];
          }
          
          // see if we need to return array of paths, or just a path
          //if (paths.length > 0) {
              // we have multiple paths we are returning
              paths.push(path);
              return paths;
          //} else {
            //return path;
          //}
        },
        sendGcodeToWorkspace: function() {
            
            // check file name
            if (!this.fileInfo || ! 'name' in this.fileInfo || ! this.fileInfo.name.length > 0) {
                this.fileInfo = {name: "pasted"};
            }
            
            var info = {
                name: "SVG File: " + this.fileInfo.name.replace(/.svg$/i, ""), 
                lastModified: new Date()
            };
            // grab gcode from textarea
            var gcodetxt = $('#' + this.id + ' .gcode').val();
            
            if (gcodetxt.length < 10) {
                chilipeppr.publish("/com-chilipeppr-elem-flashmsg/flashmsg", "Error Sending Gcode", "It looks like you don't have any Gcode to send to the workspace. Huh?", 5 * 1000);
                return;
            }
            
            // send event off as if the file was drag/dropped
            chilipeppr.publish("/com-chilipeppr-elem-dragdrop/ondropped", gcodetxt, info);
            
            // or use alternate pubsub
            // "/com-chilipeppr-elem-dragdrop/loadGcode"

        },
        /**
         * Setup the drap/drop pubsub subscriptions.
         */
        setupDragDrop: function () {
            // subscribe to events
            chilipeppr.subscribe("/com-chilipeppr-elem-dragdrop/ondragover", this, this.onDragOver);
            chilipeppr.subscribe("/com-chilipeppr-elem-dragdrop/ondragleave", this, this.onDragLeave);
            // /com-chilipeppr-elem-dragdrop/ondropped
            chilipeppr.subscribe("/com-chilipeppr-elem-dragdrop/ondropped", this, this.onDropped, 9); // default is 10, we do 9 to be higher priority
        },
        /**
         * Contains the file info for the dropped file.
         */
        fileInfo: null,
        /**
         * File drag/drop method that gets triggered after user drops file onto browser.
         */
        onDropped: function (data, info) {
            console.log("svg2gcode onDropped. len of file:", data.length, "info:", info, "this:", this);
            
            if (info && 'name' in info && info.name.match(/.svg$/i)) {
                // this looks like an SVG file
                chilipeppr.publish('/com-chilipeppr-elem-flashmsg/flashmsg', "Loaded SVG File", "Looks like you dragged in an SVG file. It is now loaded into the textbox in the SVG2Gcode widget and rendered in the 3D Viewer.", 5 * 1000, false);
                this.fileInfo = info;
                // publish to any listeners that we had a drop. this signal would mostly
                // be subscribed to by the workspace so it knows to show this widget to the user.
                chilipeppr.publish('/' + this.id + '/didDrop', this.fileInfo);
                $('#' + this.id + ' .input-svg').val(data);
                this.onRender();
                
                // We must return false so the pubsub stops transmitting to other dragdrop listeners
                // including the default listener which is the gcode widget. This obviously won't load
                // as Gcode.
                return false;
            } else {
                console.log("we do not have an SVG file. sad.");
            }
        
        },
        onDragOver: function () {
            console.log("onDragOver");
            $('#' + this.id).addClass("panel-primary");
        },
        onDragLeave: function () {
            console.log("onDragLeave");
            $('#' + this.id).removeClass("panel-primary");
        },

        /**
         * After init3d is called, it attempts multiple times to get ahold of the 3D Viewer
         * and when it does it calls this method.
         */
        onInit3dSuccess: function () {
            console.log("onInit3dSuccess. That means we finally got an object back.");
            //this.clear3dViewer();
            
            
            // open the last file
            var that = this;
            //setTimeout(function () {
                //that.open();
            //}, 1000);
            //this.drawtexterator();
            //this.drawText();
            setTimeout(function() {
                //that.clear3dViewer();
                //chilipeppr.publish('/com-chilipeppr-widget-3dviewer/setunits', "mm");
                that.onRender();
            }, 150);
            //this.onRender();
        },
        obj3d: null, // gets the 3dviewer obj stored in here on callback
        obj3dmeta: null, // gets metadata for 3dviewer
        userCallbackForGet3dObj: null,
        get3dObj: function (callback) {
            this.userCallbackForGet3dObj = callback;
            chilipeppr.subscribe("/com-chilipeppr-widget-3dviewer/recv3dObject", this, this.get3dObjCallback);
            chilipeppr.publish("/com-chilipeppr-widget-3dviewer/request3dObject", "");
            chilipeppr.unsubscribe("/com-chilipeppr-widget-3dviewer/recv3dObject", this.get3dObjCallback);
        },
        get3dObjCallback: function (data, meta) {
            console.log("got 3d obj:", data, meta);
            this.obj3d = data;
            this.obj3dmeta = meta;
            if (this.userCallbackForGet3dObj) {
                //setTimeout(this.userCallbackForGet3dObj.bind(this), 200);
                //console.log("going to call callback after getting back the new 3dobj. this.userCallbackForGet3dObj:", this.userCallbackForGet3dObj);
                this.userCallbackForGet3dObj();
                this.userCallbackForGet3dObj = null;
            }
        },
        wakeAnimate: function() {
            // this wakes up the 3d viewer to start rendering again. remeber this takes cpu cycles
            // so the 3d viewer goes to sleep after 3 seconds
            chilipeppr.publish("/com-chilipeppr-widget-3dviewer/wakeanimate");
        },
        is3dViewerReady: false,
        clear3dViewer: function () {
            console.log("clearing 3d viewer");
            
            // remove text3d from the 3d viewer
            this.sceneRemoveMySceneGroup();
            
            // need this to force garbage collection cuz three.js
            // hangs onto geometry
            this.sceneDisposeMySceneGroup();
            chilipeppr.publish('/com-chilipeppr-widget-3dviewer/setunits', "mm");
            
            chilipeppr.publish("/com-chilipeppr-widget-3dviewer/sceneclear");
            
            //if (this.obj3d) this.obj3d.children = [];            
            /*
            this.obj3d.children.forEach(function(obj3d) {
                chilipeppr.publish("/com-chilipeppr-widget-3dviewer/sceneremove", obj3d);
            });
            */
            
            // i am forcing the redraw of the grid/etc cuz if units change then
            // this stuff needs redrawn. if i had a gcode file loaded in the 3d viewer
            // it would render everything for inch size, but then when the svg was
            // loaded in mm mode everything would be crazy small so this solved it.
            this.obj3dmeta.widget.drawAxesToolAndExtents();
            
            this.is3dViewerReady = true;
            
            // this should reset the 3d viewer to resize to high dpi displays
            $(window).trigger("resize");
        },
        mySceneGroup: null,
        sceneReAddMySceneGroup: function() {
            console.log("sceneReAddMySceneGroup. obj3d:", this.obj3d, "obj3dmeta:", this.obj3dmeta);
            if (this.obj3d && this.mySceneGroup) {
                this.obj3d.add(this.mySceneGroup);
                //this.obj3d.parent().add(this.mySceneGroup);
                //this.obj3dmeta.scene.add(this.mySceneGroup);
            }
            this.obj3dmeta.widget.wakeAnimate();
        },
        sceneRemoveMySceneGroup: function() {
            if (this.obj3d && this.mySceneGroup) {
                this.obj3d.remove(this.mySceneGroup);
                //this.obj3d.parent().remove(this.mySceneGroup);
                //this.obj3dmeta.scene.remove(this.mySceneGroup);
            }
            this.obj3dmeta.widget.wakeAnimate();
        },
        sceneDisposeMySceneGroup: function() {
            if (this.mySceneGroup) {
                this.mySceneGroup.traverse( function ( child ) {
                    if (child.geometry !== undefined) {
                        child.geometry.dispose();
                        child.material.dispose();
                    }
                } );    
            }
        },
        /**
         * User options are available in this property for reference by your
         * methods. If any change is made on these options, please call
         * saveOptionsLocalStorage()
         */
        options: null,
        /**
         * Call this method on init to setup the UI by reading the user's
         * stored settings from localStorage and then adjust the UI to reflect
         * what the user wants.
         */
        setupUiFromLocalStorage: function() {

            // Read vals from localStorage. Make sure to use a unique
            // key specific to this widget so as not to overwrite other
            // widgets' options. By using this.id as the prefix of the
            // key we're safe that this will be unique.

            // Feel free to add your own keys inside the options 
            // object for your own items

            var options = localStorage.getItem(this.id + '-options');

            if (options) {
                options = $.parseJSON(options);
                console.log("just evaled options: ", options);
            }
            else {
                options = {
                    showBody: true,
                    tabShowing: 1,
                    customParam1: null,
                    customParam2: 1.0
                };
            }

            this.options = options;
            console.log("options:", options);

            // show/hide body
            if (options.showBody) {
                this.showBody();
            }
            else {
                this.hideBody();
            }

        },
        /**
         * When a user changes a value that is stored as an option setting, you
         * should call this method immediately so that on next load the value
         * is correctly set.
         */
        saveOptionsLocalStorage: function() {
            // You can add your own values to this.options to store them
            // along with some of the normal stuff like showBody
            var options = this.options;

            var optionsStr = JSON.stringify(options);
            //console.log("saving options:", options, "json.stringify:", optionsStr);
            // store settings to localStorage
            localStorage.setItem(this.id + '-options', optionsStr);
        },
        /**
         * Show the body of the panel.
         * @param {jquery_event} evt - If you pass the event parameter in, we 
         * know it was clicked by the user and thus we store it for the next 
         * load so we can reset the user's preference. If you don't pass this 
         * value in we don't store the preference because it was likely code 
         * that sent in the param.
         */
        showBody: function(evt) {
            $('#' + this.id + ' .panel-body').removeClass('hidden');
            $('#' + this.id + ' .panel-footer').removeClass('hidden');
            $('#' + this.id + ' .hidebody span').addClass('glyphicon-chevron-up');
            $('#' + this.id + ' .hidebody span').removeClass('glyphicon-chevron-down');
            if (!(evt == null)) {
                this.options.showBody = true;
                this.saveOptionsLocalStorage();
            }
            $(window).trigger("resize");
            
        },
        /**
         * Hide the body of the panel.
         * @param {jquery_event} evt - If you pass the event parameter in, we 
         * know it was clicked by the user and thus we store it for the next 
         * load so we can reset the user's preference. If you don't pass this 
         * value in we don't store the preference because it was likely code 
         * that sent in the param.
         */
        hideBody: function(evt) {
            $('#' + this.id + ' .panel-body').addClass('hidden');
            $('#' + this.id + ' .panel-footer').addClass('hidden');
            $('#' + this.id + ' .hidebody span').removeClass('glyphicon-chevron-up');
            $('#' + this.id + ' .hidebody span').addClass('glyphicon-chevron-down');
            if (!(evt == null)) {
                this.options.showBody = false;
                this.saveOptionsLocalStorage();
            }
            $(window).trigger("resize");
        },
        /**
         * This method loads the pubsubviewer widget which attaches to our 
         * upper right corner triangle menu and generates 3 menu items like
         * Pubsub Viewer, View Standalone, and Fork Widget. It also enables
         * the modal dialog that shows the documentation for this widget.
         * 
         * By using chilipeppr.load() we can ensure that the pubsubviewer widget
         * is only loaded and inlined once into the final ChiliPeppr workspace.
         * We are given back a reference to the instantiated singleton so its
         * not instantiated more than once. Then we call it's attachTo method
         * which creates the full pulldown menu for us and attaches the click
         * events.
         */
        forkSetup: function() {
            var topCssSelector = '#' + this.id;

            $(topCssSelector + ' .panel-title').popover({
                title: this.name,
                content: this.desc,
                html: true,
                delay: 1000,
                animation: true,
                trigger: 'hover',
                placement: 'auto'
            });

            var that = this;
            chilipeppr.load("http://fiddle.jshell.net/chilipeppr/zMbL9/show/light/", function() {
                require(['inline:com-chilipeppr-elem-pubsubviewer'], function(pubsubviewer) {
                    pubsubviewer.attachTo($(topCssSelector + ' .panel-heading .dropdown-menu'), that);
                });
            });

        },

    }
});
