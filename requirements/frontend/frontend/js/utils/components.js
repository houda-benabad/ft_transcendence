import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.167.0/three.module.js'
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.js'
import { COLORS, DIMENSION, POSITION, BACKGROUND, TEXTURE, MULTIPLAYERPOSITION } from "../constants/components.js"
import { MODE } from '../constants/engine.js'
import { PLAYERS } from '../constants/logic.js'


export default class Components {

    constructor( engine , mode ,options=null ) {
        this.engine = engine
        this.mode = mode
        this.options = options ? options : { texture : TEXTURE, background : TEXTURE }
        this.objects = this.createObjects( this.mode )
        this.bodies = this.createBodies( this.mode )
    }

    setup(  ){
        this.addObjectsToScene(  )
        this.addBodiesToWorld(  )
        this.createBackgroundSphere( this.options.background )
    }

    addObjectsToScene(  ){
        this.objects = this.mode == MODE.MULTIPLAYER ? this.createMultiModeObjects(  ) :  this.createObjects(  )
        Object.values( this.objects ).forEach( object => {
            if ( object instanceof THREE.Mesh )
                this.engine.scene.add( object )
        } )
    }

    addBodiesToWorld(  ){
        this.bodies = this.mode == MODE.MULTIPLAYER ? this.createMultiModeBodies(  ) :  this.createBodies(  )
        Object.values( this.bodies ).forEach( object => {
            if ( object instanceof CANNON.Body )
                this.engine.world.addBody( object )
        } )
    }

    // OBJECTS

    createBanner( position ){
        console.log( Object.values( DIMENSION.BANNER ) )
        let banner = new THREE.Mesh( 
            new THREE.BoxGeometry( .2,2,6), 
            // new THREE.BoxGeometry( ...Object.values( DIMENSION.BANNER ) ), 
            new THREE.MeshLambertMaterial() )
        banner.visible = false
        banner.position.set( ...position )
        return banner
    }

    createPlane(  ){
        let plane = new THREE.Mesh(
            new THREE.BoxGeometry( 
                this.mode == MODE.MULTIPLAYER ? DIMENSION.PLANE.x+1 : DIMENSION.PLANE.x, 
                DIMENSION.PLANE.y,
                this.mode == MODE.MULTIPLAYER ? DIMENSION.PLANE.z+1 : DIMENSION.PLANE.z, 

            ), 
            new THREE.MeshLambertMaterial( { color: COLORS.PLANE } ) ) 

        plane.position.set( ...Object.values( POSITION.PLANE ) )
        return plane
    }

    createBall(  ){
        let ball = new THREE.Mesh( 
            new THREE.SphereGeometry( ...Object.values( DIMENSION.BALL ) ), 
            new THREE.MeshLambertMaterial( { color: COLORS[this.options.texture] } ) )
        ball.position.set( ...Object.values( POSITION.BALL ) )
        return ball
    }

    createPlayer( position, color ){
        let player = new THREE.Mesh( 
            new THREE.BoxGeometry( ...Object.values( DIMENSION.PLAYER ) ), 
            new THREE.MeshLambertMaterial( { color:  color } ) )
        player.position.set( ...position )
        return player
    }

    createMultiModeObjects(  ){
        let ball = this.createBall(  )
        let plane = this.createPlane(  )
        const players = {};
        let color;
        for ( let i =0;i < PLAYERS.length;i++ ){
            if ( i < 2)
                color = COLORS.PLAYER1
            else
                color = COLORS.PLAYER2
            players[`player${i + 1}`] = this.createPlayer( Object.values(MULTIPLAYERPOSITION[PLAYERS[i]]), color)
        }

        return {ball, plane, ...players}
    }

    createObjects(  ){
        let banner1 = this.createBanner( Object.values(POSITION.BANNER1) )
        let banner2 = this.createBanner( Object.values(POSITION.BANNER2) )
        let ball = this.createBall(  )
        let plane = this.createPlane(  )
        let player1 = this.createPlayer( 
            Object.values( POSITION.PLAYER1 ), 
            COLORS.PLAYER1
         )
        let player2 = this.createPlayer( 
            Object.values( POSITION.PLAYER2 ), 
            COLORS.PLAYER2
         )

        return {ball, plane, player1, player2, banner1, banner2}
    }

    // BODIES

    createBannerBody( position ){
        const Shape = new CANNON.Box( 
            new CANNON.Vec3( 
                DIMENSION.BANNER.x / 2,
                DIMENSION.BANNER.y / 2,
                DIMENSION.BANNER.z / 2,
             )
         )
        const banner = new CANNON.Body( {
            type: CANNON.Body.STATIC,
            position: new CANNON.Vec3( ...position ),
        } );
        banner.addShape( Shape )
        banner.fixedRotation = true;

        return banner
    }

    createPlaneBody(  ){
        const ground = new CANNON.Body( {
            shape: new CANNON.Plane(  ),
            type: CANNON.Body.STATIC,
            position: new CANNON.Vec3( 0, DIMENSION.PLANE.y/2, 0 ),
        } );
        ground.quaternion.setFromEuler( -Math.PI / 2, 0, 0 ); 
        return ground
    }

    createBallBody(  ){
        let ball = new CANNON.Body( {
            shape: new CANNON.Sphere( DIMENSION.BALL.x ),
            mass: 1,
            position: new CANNON.Vec3( ...Object.values( POSITION.BALL ) ),
          } );
        return ball
    }

    createPlayerBody( position ){
        const Shape = new CANNON.Box( 
            new CANNON.Vec3( 
                DIMENSION.PLAYER.x / 2,
                DIMENSION.PLAYER.y / 2,
                DIMENSION.PLAYER.z / 2,
             )
         )

        const Body = new CANNON.Body( {
          mass: 11000,
          position: new CANNON.Vec3( ...position ),
        } );
        Body.addShape( Shape );
        Body.fixedRotation = true;
        return Body

    }

    // MULTIPLAYER BODIES
    createMultiModeBodies(  ){
        let ball = this.createBallBody(  )
        let plane = this.createPlaneBody( )
        const playerKeys = ['PLAYER1', 'PLAYER2', 'PLAYER3', 'PLAYER4']
        const players = {};

        for ( let i =0;i < playerKeys.length;i++ ){
            players[`player${i + 1}`] = this.createPlayerBody( Object.values(MULTIPLAYERPOSITION[playerKeys[i]]) )
        }

        return {ball, plane, ...players}
    }

    // REMOTE BODIES
    createBodies(  ){
        let ball = this.createBallBody(  )
        let plane = this.createPlaneBody(  )
        let banner1 = this.createBannerBody( 
            Object.values( POSITION.BANNER1 ), 
         )
         let banner2 = this.createBannerBody( 
            Object.values( POSITION.BANNER2 ), 
         )
        let player1 = this.createPlayerBody( 
            Object.values( POSITION.PLAYER1 ), 
         )
        let player2 = this.createPlayerBody( 
            Object.values( POSITION.PLAYER2 ), 
         )
        // return {ball, plane, player1, player2}
        return {ball, plane, player1, player2, banner1, banner2}
    }


    createBackgroundSphere(background) {
        const geometry = new THREE.SphereGeometry(...Object.values(BACKGROUND.DIMENSION));
        geometry.scale(...Object.values(BACKGROUND.SCALE));
    
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(
            `../../assets/background/${background}.png`,
            (texture) => {
                texture.colorSpace = THREE.SRGBColorSpace;
                texture.minFilter = THREE.LinearFilter;
                texture.magFilter = THREE.LinearFilter;
                texture.anisotropy = Math.min(16, this.engine.renderer.capabilities.getMaxAnisotropy()); // Higher anisotropy for better sharpness
    
                const material = new THREE.MeshBasicMaterial({ map: texture });
                const sphere = new THREE.Mesh(geometry, material);
                this.engine.scene.add(sphere);
            },
            undefined,
            (error) => {
                console.error("An error occurred while loading the texture:", error);
            }
        );
    }
    

}