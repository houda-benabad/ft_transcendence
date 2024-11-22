// import {gameOptions} from './game.js'

export function customizeFrom(gameSocket) {
    let form = document.createElement("form")
    form.setAttribute('id', 'custom-form')
    form.innerHTML = `
	<div id="gameOut">
	<p class="label">choose game Out</p>
	<div>
	<input type="radio" name="gameout" value="time" checked>
	<label for="time">time</label>
	</div>
	<div>
	<input type="radio" name="gameout" value="score">
	<label for="local">score</label>
	</div>
	</div>
	
	<div>
	<label for="counts" class="label">select count</label>
	<select name="counts">
	<option>10 </option>
	<option>15</option>
	<option>20</option>
	<option>25</option>
	<option>30</option>
	</select>
	
	<button id="play" type="submit">PLAY</button>
	`

    form.addEventListener('submit', (e) => {
        e.preventDefault()
        let data = new FormData(form);
        let gameOptions = Object.fromEntries(data)
            // history.pushState(null, null, '/ws/game')
        gameSocket.send(JSON.stringify({
            'type': 'gameSettings',
            'data': gameOptions
        }))
        form.remove()
    })

    return form
}

export function endgame(state, by) {
    let pop = document.createElement('div')
    pop.setAttribute('id', 'popup')

    let real_state = ""
    if (state == "W")
        real_state = "WON"
    else
        real_state = "LOST"
    pop.innerHTML = `
			<h4>YOU ${real_state}</h4>
			<p>by ${by}</p>
			<button id="back">BACK HOME</button>
		`
    return pop
}

export function discard(state, by) {
    let pop = document.createElement('div')
    pop.setAttribute('id', 'popup')

    let real_state = ""
    if (state == "W")
        real_state = "WON"
    else
        real_state = "LOST"
    pop.innerHTML = `
			<h4>YOU ${real_state}</h4>
			<p>by ${by}</p>
			<button id="back">BACK HOME</button>
		`
    return pop
}

export function match_making() {
    let pop = document.createElement('div')
    pop.setAttribute('id', 'match_popup')

    pop.innerHTML = `
		<div>
			<div class="">
				<p>waiting for others</p>
			</div>
			<ul id="user_list">

			</ul>
		</div>
		`
    return pop
}

export function score(firstScore, secondScore, thirdScore, fourthScore) {
    let score = document.createElement('div')
    score.setAttribute('id', 'scorePanel')
    score.innerHTML = `
		<h1>SCORE</h1>
		<p> ${firstScore}</p>
		<p> ${secondScore}</p>
		<p> ${thirdScore}</p>
		<p> ${fourthScore}</p>
	`
    return score
}


export function time(elapsedTime) {
    let time = document.createElement('div')
    time.setAttribute('id', 'timePanel')
    time.innerHTML = `
		<h1>TIME</h1>
		<p> ${elapsedTime} second</p>
	`
    return time
}

export function updateTime(html, elapsedTime) {
    html.innerHTML = `
		<h1>TIME</h1>
		<p> ${elapsedTime} second</p>
	`
        // return time
}


export function updateScore(html, firstScore, secondScore, thirdScore, fourthScore) {
    html.innerHTML = `
		<h1>SCORE</h1>
		<p style="color: #ff99ff"> ${firstScore}</p>
		<p style="color: #ffff88"> ${secondScore}</p>
		<p style="color: #22ffff"> ${thirdScore}</p>
		<p style="color: #ff9900"> ${fourthScore}</p>
	`
}

export function update_match_making(usernames) {
    document.getElementById('user_list').innerHTML = ''
    for (let i = 0; i < usernames.length; i++) {
        let node = document.createElement("li");
        let textnode = document.createTextNode(usernames[i]);
        node.appendChild(textnode);
        document.getElementById('user_list').appendChild(node)
    }

}