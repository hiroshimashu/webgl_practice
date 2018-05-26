(() => {
    // variables
    let canvasWidth  = null;
    let canvasHeight = null;
    let targetDOM    = null;
    let now = new Date();
    let hour_vector;
    let minute_vector;
    let sec_vector;
    // hourは0 ~ 11までの値
    let hour = now.getHours() % 12;
    let minute = now.getMinutes();
    let second = now.getSeconds();
    let run = true;
    let minute_by_sec = 0;
    let hour_by_sec = 0;
    // three objects
    let scene;
    let camera;
    let controls;
    let renderer;
    let geometry;
    let materialPoint;
    let materialLine;
    let materialCircle;
    let sec_group;
    let minutes_group;
    let hour_group;
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
        color: 0x3399ff,
        linewidth: 15
    }

    const MATERIAL_CIRCLE_PARAM = {
        color: 0xffff00
    }

    window.addEventListener('load', () => {
        canvasHeight = document.innerHeight;
        canvasWidth = document.innerWidth;
        targetDOM = document.getElementById('webgl');

        scene = new THREE.Scene();
        sec_group = new THREE.Group();
        minutes_group = new THREE.Group();
        hour_group = new THREE.Group();
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
        geometry = new THREE.CircleGeometry(4, 12);
        circle = new THREE.Mesh( geometry, materialCircle );
        scene.add(circle);



        // axes1(hour)
        geometry = new THREE.Geometry();
        hour_vector = calculateDateVector(hour);
        geometry.vertices.push(
            new THREE.Vector3( 0, 0, 1 ),
            hour_vector
        )
        line = new THREE.Line( geometry, materialLine );
        hour_group.add( line );


        // axes2(minutes)
        geometry = new THREE.Geometry();
        minute_vector = calculateDateVector(minute);
        geometry.vertices.push(
            new THREE.Vector3( 0, 0, 1 ),
            minute_vector
        )
        line = new THREE.Line( geometry, materialLine );
        minutes_group.add( line );

        //axes3(second)
        geometry = new THREE.Geometry();
        sec_vector = calculateDateVector(second);
        geometry.vertices.push(
            new THREE.Vector3( 0, 0, 1 ),
            sec_vector
        )
        line = new THREE.Line( geometry, materialLine );
        sec_group.add( line );

        scene.add( hour_group );
        scene.add( minutes_group );
        scene.add( sec_group);
        // helper
        //axesHelper = new THREE.AxesHelper(5.0);
        //scene.add(axesHelper);

        window.addEventListener('resize', () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        }, false);

        render();
    }, false);

    function render() {
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }

    function rotate_sec() {
        an_minute_has_passed();
        an_hour_has_passed();
        sec_group.rotation.z -= Math.PI / 30;
        minute_by_sec += 1;
        hour_by_sec += 1;
    }

    function rotate_minutes() {
        minutes_group.rotation.z -= Math.PI / 30;
    }

    function rotate_hour() {
        hour_group.rotation.z -= Math.PI / 30;
    }

    function an_minute_has_passed() {
        if (minute_by_sec === 60) {
            rotate_minutes();
            minute_by_sec = 0;
        } else {
            return;
        }
    }

    function an_hour_has_passed() {
        if (hour_by_sec === 3600) {
            rotate_hour();
            hour_by_sec = 0;
        } else {
            return;
        }
    }


    // 時計は反時計回りであることに注意
    function calculateDateVector(args) {
        let angle;
        if (args === hour) {
            angle = Math.PI / 6 * hour;
            return new THREE.Vector3(Math.sin(angle), Math.cos(angle), 1);
        } else if (args ===  minute) {
            angle = Math.PI / 30 * minute;
            return new THREE.Vector3( 3 * Math.sin(angle), 3 * Math.cos(angle), 1);
        } else {
            angle = Math.PI / 30 * second;
            return new THREE.Vector3(Math.sin(angle), Math.cos(angle), 1);
        }
    }

    window.setInterval(rotate_sec, 1000);

})();