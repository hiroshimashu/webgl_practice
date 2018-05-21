(() => {
    // variables
    let canvasWidth  = null;
    let canvasHeight = null;
    let targetDOM    = null;
    let run = true;
    // three objects
    let scene;
    let camera;
    let controls;
    let renderer;
    let geometry;
    let materialPoint;
    let materialLine;
    let materialCircle;
    //let axesHelper;
    let group;
    let particle;
    let point;
    let line;
    let circle;



    const RENDERER_PARAM = {
        clearColor: 0x333333
    };

    const MATERIAL_PARAM_POINT = {
        color: 0x3399ff,
        size: 0.7,
        sizeAttenuation: true
    };

    const MATERIAL_LINE_PARAM = {
        color: 0x3399ff
    }

    const MATERIAL_CIRCLE_PARAM = {
        color: 0xffff00
    }

    window.addEventListener('load', () => {
        canvasHeight = document.innerHeight;
        canvasWidth = document.innerWidth;
        targetDOM = document.getElementById('webgl');

        scene = new THREE.Scene();
        group = new THREE.Group();
        camera = new THREE.PerspectiveCamera(60, canvasWidth / canvasHeight, 0.1, 50.0);
        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 10.0;
        camera.lookAt(new THREE.Vector3(0.0, 0.0, 0.0));

        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(new THREE.Color(RENDERER_PARAM.clearColor));
        renderer.setSize(canvasWidth, canvasHeight);
        targetDOM.appendChild(renderer.domElement);
        controls = new THREE.OrbitControls(camera, renderer.domElement);

        materialPoint = new THREE.PointsMaterial(MATERIAL_PARAM_POINT);
        materialLine = new THREE.LineBasicMaterial(MATERIAL_LINE_PARAM);
        materialCircle = new THREE.MeshBasicMaterial(MATERIAL_CIRCLE_PARAM);


        // particle
        geometry = new THREE.Geometry();
        point = new THREE.Vector3(0, 0, 1);
        geometry.vertices.push(point);
        particle = new THREE.Points(geometry, materialPoint);
        scene.add(particle);

        // circle
        geometry = new THREE.CircleGeometry(3, 12);
        circle = new THREE.Mesh( geometry, materialCircle );
        scene.add(circle);



        // axes1
        geometry = new THREE.Geometry();
        geometry.vertices.push(
            new THREE.Vector3( 0, 0, 1 ),
            new THREE.Vector3( 0, 5, 1 )
        )
        line = new THREE.Line( geometry, materialLine );
        group.add( line );


        // axes2
        geometry = new THREE.Geometry();
        geometry.vertices.push(
            new THREE.Vector3( 0, 0, 1 ),
            new THREE.Vector3( 3, 0, 1 )
        )
        line = new THREE.Line( geometry, materialLine );
        group.add( line );

        scene.add( group );
        // helper
        //axesHelper = new THREE.AxesHelper(5.0);
        //scene.add(axesHelper);

        window.addEventListener('resize', () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        }, false);

        render()
    }, false);

    function render() {
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }

})();