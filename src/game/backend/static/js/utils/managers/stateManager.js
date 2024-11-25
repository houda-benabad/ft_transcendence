export default class stateManager{
	constructor(options){
		this.options = options
		this.startTime = new Date()
		this.timeElapsed = 0
	}

	setup(){
		this.startTime = new Date()
	}
	
	reachedMaxTime(data){
		if (this.options.mode == 'time'){
			let now  = new Date()
			this.timeElapsed  = Math.round( (now - this.startTime) / 1000)
			return (
				this.timeElapsed >= this.options.range && 
				data.p1.score!= data.p2.score)
		}
	}

	reachedMaxScore(data){
		return (
			data.p1.score == this.options.range || 
			data.p2.score == this.options.range)
	}

	isGameover(data){
		return this.reachedMaxTime(data) || this.reachedMaxScore(data)
	}
}