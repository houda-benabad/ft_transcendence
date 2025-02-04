export default class stateManager{
	constructor( options ){
		this.options = options
		this.startTime = 0
		this.timeElapsed = 0
		this.startTime = new Date(  )
	}

	setup(  ){
		this.startTime = new Date(  )
	}

	reachedMaxTime( score ){
		if ( this.options.mode == 'time' ){
			let now  = new Date(  )
			this.timeElapsed  = Math.round( ( now - this.startTime ) / 1000 ) - 3
			return ( 
				this.timeElapsed >= this.options.range && 
				score.p1!= score.p2 )
		}
	}

	reachedMaxScore( score ){
		return ( 
			score.p1 == this.options.range || 
			score.p2 == this.options.range )
	}

	isGameover( score ){
		return this.reachedMaxTime( score ) || this.reachedMaxScore( score )
	}
}