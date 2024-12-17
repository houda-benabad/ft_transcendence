class appCanva{
    constructor(){
        let canva = document.getElementById("app");
        canva.innerHTML = ' '
        this.elements = document.createElement('div')
        this.elements.id = 'game-elements'
        canva.append(this.elements)
        console.log( 'canva for the moment : ', canva.innerHTML)
        this.waiting = document.createElement('div')
        this.waiting.className = 'waiting-holder'
        this.waiting.innerHTML = `
			<div class="waiting-pop glass">
				<h1>Waiting for other player...</h1>
				<div id="loader"></div>
				<button id="cancel-btn">Cancel</button>
			</div>
	    `
        this.score = document.createElement('div')
        this.score.className = 'score'
        this.score.innerHTML = `
            <div class="user glass">
                <h3 id="user1">user1</h3>
            </div>
            <div class="score-num glass">
                <h1 id="score">0 : 0</h1>
            </div>
            <div class="user glass">
                <h3 id="user2">user2</h3>
            </div>
	`

        this.time = document.createElement('div')
        this.time.className = 'time glass'
        this.time.innerHTML = `<h1 id="time">00:00</h1>`

        this.endGame = document.createElement('div')
        this.endGame.className = 'endGame-pop glass'
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
        switch (element) {
            case 'score':
                if (data.name) {

                    document.getElementById('user1').innerHTML = data.p1.name
                    document.getElementById('user2').innerHTML = data.p2.name
                }
                document.getElementById('score').innerHTML = `${data.p1} : ${data.p2}`
                break;
            case 'time':
                // console.log(data)
                document.getElementById('time').innerHTML = data
                break;
            default:
                break;
        }
    }
}

export default appCanva