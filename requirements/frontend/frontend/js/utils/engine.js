// import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.167.0/three.module.js'
// import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.js'
// import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js'
import { CAMERA, WORLD, LIGHT } from "../constants/engine.js";
import { MODE } from '../constants/engine.js';

export default class Engine {

	constructor( mode ) {
		this.mode = mode
		this.camera = new THREE.PerspectiveCamera( 
			CAMERA.FIELDOFWIEW, 
			CAMERA.ASPECTRATIO, 
			CAMERA.NEAR, 
			CAMERA.FAR );

		this.renderer = new THREE.WebGLRenderer( { antialias: true } );
		this.scene = new THREE.Scene(  );
		this.world = new CANNON.World(  );
		if ( this.mode == MODE.REMOTE || this.mode == MODE.MULTIPLAYER )
			this.socket = this.setupSocket(  )
	}

	onWindowResize(  ) {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix(  );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        
    }

	setup(  ){
		this.setupCamera(  )
		this.setupRenderer(  )
		this.setupLight(  )
		this.setupWorld(  )
		this.setupResizeEvent(  )
	}

	setupSocket(  ) {
		let url = `ws://${window.location.host}/ws/${this.mode}/`
		return new WebSocket( url )
	}

	setupCamera(  ){
        this.camera.position.set( ...Object.values( CAMERA.INITIALPOSITION ) )
		new OrbitControls( this.camera, this.renderer.domElement )
	}

	setupLight(  ){
		const light = new THREE.DirectionalLight( LIGHT.COLOR, LIGHT.INTENSITY );
        light.castShadow = true
        light.position.set( ...Object.values( LIGHT.POSITION ) )
		this.scene.add( light )
	}

	setupRenderer(  ){
		this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.shadowMap.enabled = true;
        document.querySelector( '#app' ).appendChild( this.renderer.domElement )
	}

	setupWorld(  ){
		this.world.gravity.set( 0, WORLD.GRAVITY, 0 );
        this.world.broadphase = new CANNON.NaiveBroadphase(  );
        this.world.solver.iterations = WORLD.ITERATION;
	}

	setupResizeEvent(  ){
        window.addEventListener( 'resize', this.onWindowResize.bind( this ), false );
	}

	cleanScene(  ){
		this.scene.traverse( ( object ) => {
            if ( object.geometry ) {
                object.geometry.dispose(  );
            }
            if ( object.material ) {
                if ( Array.isArray( object.material ) ) {
                    object.material.forEach( material => material.dispose(  ) );
                } else {
                    object.material.dispose(  );
                }
            }
        } );
    
        while( this.scene.children.length > 0 ) {
            this.scene.remove( this.scene.children[0] );
        }
	}

	cleanWorld(  ){
		while( this.world.bodies.length > 0 ) {
            this.world.removeBody( this.world.bodies[0] );
        }
	}

	cleanRenderer(  ){
		this.renderer.dispose(  );
        this.renderer.domElement.remove(  );
	}

	clean(  ){
		this.cleanScene(  )
		this.cleanWorld(  )
		this.cleanRenderer(  )
		eventListeners.off(document, 'keydown')
		eventListeners.off(document, 'keyup')
	}

}