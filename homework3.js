(() => {
    // variables
    let canvasWidth = null;
    let canvasHeight = null;
    let targetDOM = null;
    let run = true;
    let startTime = 0.0;
    let nowTime = 0.0;
    // three objects
    let scene;
    let camera;
    let controls;
    let renderer;
    let directionalLight;
    let ambientLight;
    let axesHelper;
    let geometry;
    let earthSphere;   // 地球のメッシュ
    let earthTexture;  // 地球用のテクスチャ
    let earthMaterial; // 地球用のマテリアル
    let moonSphere;    // 月のメッシュ
    let moonTexture;   // 月のテクスチャ
    let moonMaterial;  // 月のマテリアル
    let starSphere;    // 星のメッシュ @@@
    let starMaterial;  // 星のマテリアル @@@
    let starRad;
    let starGroup;
    // constant variables
    const RENDERER_PARAM = {
        clearColor: 0xaaaaaa
    };
    const MATERIAL_PARAM = {
        color: 0xffffff
    };
    const MATERIAL_STAR_PARAM = { // 星用マテリアル設定 @@@
        color: 0xff9900
    };
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

    // entry point
    window.addEventListener('load', () => {
        // canvas
        canvasWidth  = window.innerWidth;
        canvasHeight = window.innerHeight;
        targetDOM    = document.getElementById('webgl');

        // events
        window.addEventListener('keydown', (eve) => {
            run = eve.key !== 'Escape';
        }, false);
        window.addEventListener('resize', () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        }, false);
        window.addEventListener('mousemove', (eve) => {
            if(moonSphere == null){return;}
            let w = window.innerWidth;
            let h = window.innerHeight;
            let x = eve.clientX - w / 2.0;
            let y = eve.clientY - h / 2.0;
            let nVector = normalize2D([x, y]);
            moonSphere.position.set(
                nVector[0] * 2.75,
                0.0,
                nVector[1] * 2.75
            );
        }, false);

        // texture load
        let earthLoader = new THREE.TextureLoader();
        let moonLoader = new THREE.TextureLoader();
        earthTexture = earthLoader.load('earth.jpg', () => {
            moonTexture = moonLoader.load('moon.jpg', init);
        });
    }, false);

    function init(){
        // scene and camera
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(60, canvasWidth / canvasHeight, 0.1, 50.0);
        camera.position.x = 0.0;
        camera.position.y = 3.0;
        camera.position.z = 10.0;
        camera.lookAt(new THREE.Vector3(0.0, 0.0, 0.0));

        // renderer
        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(new THREE.Color(RENDERER_PARAM.clearColor));
        renderer.setSize(canvasWidth, canvasHeight);
        targetDOM.appendChild(renderer.domElement);
        controls = new THREE.OrbitControls(camera, renderer.domElement);

        // material
        earthMaterial = new THREE.MeshLambertMaterial(MATERIAL_PARAM);
        earthMaterial.map = earthTexture;
        moonMaterial = new THREE.MeshLambertMaterial(MATERIAL_PARAM);
        moonMaterial.map = moonTexture;
        starMaterial = new THREE.MeshLambertMaterial(MATERIAL_STAR_PARAM); // 星用マテリアル @@@

        // geometry
        geometry = new THREE.SphereGeometry(1.0, 64, 64);
        earthSphere = new THREE.Mesh(geometry, earthMaterial);
        scene.add(earthSphere);
        moonSphere = new THREE.Mesh(geometry, moonMaterial);
        scene.add(moonSphere);
        starSphere = new THREE.Mesh(geometry, starMaterial);
        scene.add(starSphere);

        // move mesh
        moonSphere.scale.set(0.36, 0.36, 0.36);
        moonSphere.position.set(2.75, 0.0, 0.0);
        moonSphere.rotation.y = Math.PI;// 面をあらかじめ地球に向きにする
        moonGroup = new THREE.Group();
        moonGroup.add(moonSphere); // 月をグループに入れて固定する @@

        starSphere.scale.set(0.1, 0.1, 0.1);    // 星の大きさ @@@
        starSphere.position.set(3.5, 0, 0); // 星の初期位置 @@@
        moonGroup.add(starSphere);

        scene.add(moonGroup);

        // lights
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

        // helper
        axesHelper = new THREE.AxesHelper(5.0);
        scene.add(axesHelper);

        // begin
        startTime = Date.now();

        // rendering
        render();
    }

    // rendering
    function render(){
        if(run){requestAnimationFrame(render);}
        nowTime = (Date.now() - startTime) / 1000.0;

        // 地球は一定速で回転し続ける
        earthSphere.rotation.y += 0.01;

        // 時間の経過からラジアンを求める
        let rad = nowTime % (Math.PI * 2.0);
        // 角速度
        starRad = nowTime % (Math.PI * 2.0) * 2;
        // 月の座標
        moonSphere.position.set(2.75 * Math.cos(rad), 0, -2.75 * Math.sin(rad));
        // 惑星の座標
        let moonX = moonSphere.position.x;
        let moonZ = moonSphere.position.z;
        starSphere.position.set(moonX + 0.75 * Math.cos(starRad), 0, moonZ - 0.75 * Math.sin(starRad));

        renderer.render(scene, camera);
    }


    /**
     * 二次元ベクトルを正規化する
     * @param {Array} vec - 正規化したい二次元ベクトル
     * @return {Array} 正規化した二次元ベクトル
     */
    function normalize2D(vec){
        let length = calcLength2D(vec);
        if(length === 0.0){return vec;}
        return [vec[0] / length, vec[1] / length];
    }

    /**
     * 二次元ベクトルの長さを計算する
     * @param {Array} vec - 長さを知りたい二次元ベクトル
     * @return {float} ベクトルの長さ
     */
    function calcLength2D(vec){
        return Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1]);
    }

    /**
     * 三次元ベクトルを正規化する
     * @param {Array} vec - 正規化したい三次元ベクトル
     * @return {Array} 正規化した三次元ベクトル
     */
    function normalize3D(vec){
        let length = calcLength3D(vec);
        if(length === 0.0){return vec;}
        return [vec[0] / length, vec[1] / length, vec[2] / length];
    }

    /**
     * 三次元ベクトルの長さを計算する
     * @param {Array} vec - 長さを知りたい三次元ベクトル
     * @return {float} ベクトルの長さ
     */
    function calcLength3D(vec){
        return Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2]);
    }



})();