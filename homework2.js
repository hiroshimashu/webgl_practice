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
    let axesHelper;
    let particle;
    let point;

    const RENDERER_PARAM = {
        clearColor: 0x333333
    };

    const MATERIAL_PARAM_POINT = {
        color: 0x3399ff,
        size: 0.1,
        sizeAttenuation: true
    };


    window.addEventListener('load', () => {
        canvasHeight = document.innerHeight;
        canvasWidth = document.innerWidth;
        targetDOM = document.getElementById('webgl');
        console.log(targetDOM);

        scene = new THREE.Scene();
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
        geometry = new THREE.Geometry();

        point = new THREE.Vector3(0, 0, 0);
        geometry.vertices.push(point);

        particle = new THREE.Points(geometry, materialPoint);
        scene.add(particle);

        // helper
        axesHelper = new THREE.AxesHelper(5.0);
        scene.add(axesHelper);

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