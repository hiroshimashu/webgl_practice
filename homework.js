(() => {
    //variables
    let canvasWidth = null;
    let canvasHeight = null;
    let targetDOM = null;
    let isDown = false;
    let run = true;

    //three
    let scene;
    let camera;
    let controls;
    let renderer;
    let geometry;
    let material;
    let mesh = [];
    let directionalLight;
    let ambientLight;
    let axisHelper;

    //constants
    const RENDERER_PARAM = {
        clearColor:0xFFFFFF
    };
    const MATERIAL_PARAM = {
        color: 0xff9933,
        specular: 0xffffff
    }
    const DIRECTIONAL_LIGHT_PARAM = {
        color: 0xffffff,
        intensity: 1.0,
        x: 1.0,
        y: 1.0,
        z: 1.0
    };
    const AMBIENT_LIGHT_PARAM = {
        color: 0xffffff,
        intensity: 0.2
    };


    // 初期化

    window.addEventListener('load', () => {
        canvasWidth  = window.innerWidth;
        canvasHeight = window.innerHeight;
        targetDOM    = document.getElementById('webgl');

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(60, canvasWidth / canvasHeight, 0.1, 50.0);
        camera.position.x = 0;
        camera.position.y = 3.0;
        camera.position.z = 40.0;
        camera.lookAt(new THREE.Vector3(0.0, 0.0, 0.0));

        //renderer
        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(new THREE.Color(RENDERER_PARAM.clearColor));
        renderer.setSize(canvasWidth, canvasHeight);
        targetDOM.appendChild(renderer.domElement);
        controls = new THREE.OrbitControls(camera, renderer.domElement);

        //material and geometry
        material = new THREE.MeshPhongMaterial(MATERIAL_PARAM);

        //cube
        geometry = new THREE.CubeGeometry(3,3,3);



        //mesh
        for (var l = 0; l < 10; l++) {
            let y = -15 + 3 * l;
            for(var i = 0; i < 10; i++) {
                console.log('in loop!')
                let newMesh = new THREE.Mesh(geometry, material);
                newMesh.position.x = -12 + i*3;
                newMesh.position.y = y;
                mesh.push(newMesh);
            }
        }

        console.log(mesh);

        mesh.forEach((element) => {
            scene.add(element);
        })


        //lights
        directionalLight = new THREE.DirectionalLight(
            DIRECTIONAL_LIGHT_PARAM.color,
            DIRECTIONAL_LIGHT_PARAM.intensity
        );
        directionalLight.position.x = DIRECTIONAL_LIGHT_PARAM.x;
        directionalLight.position.y = DIRECTIONAL_LIGHT_PARAM.y;
        directionalLight.position.z = DIRECTIONAL_LIGHT_PARAM.z;
        scene.add(directionalLight);

        ambientLight = new THREE.AmbientLight(
            AMBIENT_LIGHT_PARAM.color,
            AMBIENT_LIGHT_PARAM.intensity
        );
        scene.add(ambientLight);


        //helper
        axisHelper =  new THREE.AxesHelper(5.0);
        scene.add(axisHelper);

        //events
        window.addEventListener('mousedown', () => {
            isDown = true;
        }, false);
        window.addEventListener('mouseup', () => {
            isDown = false;
        }, false);
        window.addEventListener('resize', () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        }, false);

        //rendering
        render()
    }, false);

    //レンダリング処理
    function render() {
        if(run) { requestAnimationFrame(render);}

        if(isDown === true) {
            mesh.forEach(element => {
                element.rotation.y += 0.02;
                element.rotation.z += 0.02;
            })
        }
        renderer.render(scene, camera);
    }
})();