class appCanva{
    constructor( players ){
        let canva = document.getElementById("app");
        canva.innerHTML = ' '
        this.elements = document.createElement('div')
        this.elements.id = 'game-elements'
        canva.append(this.elements)
        
        this.initElemnts( players )
    }
    initElemnts( players ){
        this.waiting = this._createElement('div', 'waiting-holder', `
            <div class="waiting-pop glass">
				<h1>Waiting for other player...</h1>
				<div id="loader"></div>
				<button id="cancel-btn">Cancel</button>
			</div>
	    `)
        this.score = this._createElement( 'div', 'score',  `
            <div class="user glass">
                <h3 id="user2">${players[0]}</h3>
            </div>
            <div class="score-num glass">
                <h1 id="score">0 : 0</h1>
            </div>
            <div class="user glass">
                <h3 id="user1">${players[1]}</h3>
            </div>
	    `)
        this.time = this._createElement( 'div','time glass',  `<h1 id="time">0</h1>`)
        this.endGame = this._createElement( 'div', 'endGame-pop glass' )
        this.elementsId = null
    }
    setup( element, data ){
        switch (element) {
            case 'score':
                if ( data.author == data.ids.p1)
                    data.name.p1 = 'me'
                else
                    data.name.p2 = 'me'
                this.score.innerHTML = `<div class="user glass">
                        <h3 id="user${data.ids.p2}">${data.name.p2}</h3>
                    </div>
                    <div class="score-num glass">
                        <h1 id="score">0 : 0</h1>
                    </div>
                    <div class="user glass">
                        <h3 id="user${data.ids.p1}">${data.name.p1}</h3>
                    </div>
                `
                break;
            default:
                break;
        }
    }
    _createElement( tag,  className, html=" " ){
        let element = document.createElement(tag)
        element.className = className
        element.innerHTML = html
        return element
    }
    add(element){
        switch (element) {
            case 'waiting':
                this.elements.appendChild(this.waiting)
                break;
            case 'score':
                this.elements.appendChild(this.score)
                break;
            case 'time':
                this.elements.appendChild(this.time)
                break;
            case 'endGame':
                this.endGame.innerHTML = `<h3>YOU <span id="status">You ${data}</span>!</h3>`
                this.elements.appendChild(this.endGame)
                break;
            default:
                break;
        }
    }
    remove(element){
        switch (element) {
            case 'waiting':
                this.waiting.style.display = 'none'
                break;
        }
    }
    update(element, data){
        if ( !this.elementsId )
            this.elementsId = {
                p1: document.getElementById('user1'),
                p2: document.getElementById('user2'),
                score: document.getElementById( 'score' ),
                time: document.getElementById( 'time' )
            }
        switch (element) {
            case 'score':
                this.elementsId.score.innerHTML = `${data.score.p2} : ${data.score.p1}`
                break;
            case 'time':
                this.elementsId.time.innerHTML = data
                break;
            default:
                break;
        }
    }
    
}

export default appCanva