import Engine from "./engine.js"
import Components from "./components.js"
import visualsManager from "./managers/visualManage.js"


export default class Logic {

	constructor(mode, options) {
		this.engine = new Engine( mode )
		this.mode = mode
		this.components = new Components(this.engine, this.mode, options)
		this.visual = new visualsManager(this.components, this.mode)
		
	}

	setup(){
		this.engine.setup( )
		this.components.setup( )
	}

	update(){
		this.visual.updatePosition()
	}

}