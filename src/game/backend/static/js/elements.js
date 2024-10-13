// import {gameOptions} from './game.js'

import { startGame } from "./game.js"

export function score(firstScore, secondScore) {
    let score = document.createElement('div')
    score.setAttribute('id', 'players')
    score.innerHTML = `
        <div class="holder">
            <div class="player-info left">
                <img class="profile-img" src="./tennis.png">
                <p>user1</p>
            </div>
            <div class="score left">
                <h1>0</h1>
            </div>
            <div class=" middle">
                <h3>:</h3>
            </div>
            <div class="score right">
                <h1>0</h1>
            </div>
            <div class="player-info right glass">
                <img class="profile-img" src="./basket.png">
                <p>user2</p>
            </div>

        </div>
	`
    return score
}

export function updateScore(gameObjects, data, mode) {
    const imageSrc = "{% static 'images/image.png' %}"
    let html = document.getElementById('players')
    html.style.display = 'flex'
    if (mode == 'game') {
        html.innerHTML = `
        <div class="holder">
            <div class="player-info left">
                <p>user1</p>
            </div>
			<div class="element">
				<div class="score left">
					<h1>${data.player.score}</h1>
				</div>
				<div class=" middle">
					<h3>:</h3>
				</div>
				<div class="score right">
					<h1>${data.otherPlayer.score}</h1>
				</div>
			</div>
            <div class="player-info right">
                <p>user2</p>
            </div>

        </div>
		`
    } else if (mode == 'multi') {
        html.innerHTML = `
		<div class="player-info">
			<div class="player">
				<p>hajar Ouaslam</p>
			</div>
			<h1>${data.player1.score}</h1>
		</div>


		<div class="player-info">
			<div class="player">
				<p>kaouthar kouaz</p>
			</div>
			<h1>${data.player2.score}</h1>
		</div>

		<div class="player-info">
			<div class="player">
				<p>ferdaous adermouch</p>
			</div>
			<h1>${data.player3.score}</h1>
		</div>

		<div class="player-info">
			<div class="player">
				<p>houda obenabad</p>
			</div>
			<h1>${data.player4.score}</h1>
		</div>
	`
    }

}

export function time(elapsedTime) {
    let time = document.createElement('div')
    time.setAttribute('id', 'timePanel')
    time.innerHTML = `
		<div class="container">
			<div class="circular-progress">
				<span class="progress-value">0 second</span>
			</div>
		</div>
	`
    return time
}

export function updateTime(data) {
    let circularProgress = document.querySelector(".circular-progress"),
        progressValue = document.querySelector(".progress-value");
    let progressStartValue = data.elapsed,
        progressEndValue = data.endTime
    let progressPercentage = (progressStartValue / progressEndValue) * 100;
    progressValue.textContent = `${progressStartValue} s`;
    if (progressStartValue > progressEndValue)
        circularProgress.style.background = `conic-gradient(red ${progressPercentage * 3.6}deg, black 0deg)`;
    else
        circularProgress.style.background = `conic-gradient(#7d2ae8 ${progressPercentage * 3.6}deg, black 0deg)`;

}

export function endgame(data) {
    let pop = document.createElement('div')
    pop.setAttribute('id', 'popup')

    let real_state = ""
    if (data.state == "W")
        real_state = "WON"
    else
        real_state = "LOST"
    pop.innerHTML = `
	<h4>YOU ${real_state}</h4>
	<p>by ${data.by}</p>
	<button id="back">BACK HOME</button>
	`
    return pop
}

export function updateEndGame(data) {
    let endGame = endgame(data);
    document.getElementById('canva').append(endGame)
    endGame.style.transform = " translate(-50%, -50%) scale(1) "
    let backHome = document.getElementById("back")
    backHome.addEventListener('click', (e) => {
        window.location.href = '/'
    })
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

export function update_match_making(usernames) {
    let user_list = document.getElementById('user_list')
    document.getElementById('match_popup').style.transform = ' translate(-50%, -50%) scale(1)'
    user_list.innerHTML = ''
    for (let i = 0; i < usernames.length; i++) {
        let node = document.createElement("li");
        node.innerHTML = usernames[i];
        user_list.appendChild(node)
    }
}


// NEW ONE

function createRadioOption(name, value, label, checked = false) {
	const modesOption = document.createElement('div') // DIV
	modesOption.className = 'option'

	const input = document.createElement('input')
	input.className = 'radio'
	input.type = 'radio'
	input.name = name
	input.value = value
	input.id = value
	if (checked) input.checked = true


	modesOption.appendChild(input)

	const labelOption = document.createElement('label')
	labelOption.htmlFor = value
	labelOption.className = 'radio-label'
	labelOption.style.backgroundImage = 'url(`static/img/background/popular.png`)'
	labelOption.innerHTML = label

	modesOption.appendChild(labelOption)



	return modesOption
}

function createOption(name ,value, id,labelId , checked=false){
		const mainDiv = document.createElement('Div')
		mainDiv.className= 'option'

		const inputOption = document.createElement('input')
		inputOption.type = 'radio'
		inputOption.className = 'radio'
		inputOption.name = name
		inputOption.value = value
		inputOption.id = id
		if (checked) inputOption.checked = true


		const inputLabel = document.createElement('label')
		inputLabel.htmlFor = id
		inputLabel.classList = 'radio-label'
		inputLabel.id = labelId
		inputLabel.innerHTML = value
		
		mainDiv.append(inputOption)
		mainDiv.append(inputLabel)
		return mainDiv
	}


export function gameSettings(gameSocket) {


	let canva = document.getElementById('canva')
	let form = document.createElement('form')
	form.id = 'gameSettings-form'

	const heading = document.createElement('h3')
	heading.innerHTML = 'Game settings'
	form.appendChild(heading)

	const modesDiv = document.createElement('div') // DIV
	modesDiv.className = 'modes'
	form.appendChild(modesDiv)

	const modesTitle = document.createElement('p')
	modesTitle.className = 'title'
	modesTitle.innerHTML = 'modes'
	modesDiv.appendChild(modesTitle)

	const modesOptions = document.createElement('div') // DIV 
	modesOptions.className = 'options'
	modesDiv.appendChild(modesOptions)


	const modesScore = createRadioOption('mode', 'score', 'Score')
	modesOptions.appendChild(modesScore)

	const modesTime = createRadioOption('mode', 'time', 'Time',  true)
	modesOptions.appendChild(modesTime)

	// RANGE 
	const rangeDiv = document.createElement('div') // div
	rangeDiv.className = 'counts'

	const rangeValue = document.createElement('span')
	rangeValue.className = 'title'
	rangeValue.id = 'count'
	rangeValue.innerHTML= 'Score'
	rangeDiv.appendChild(rangeValue)

	const rangeOptions = document.createElement('div')
	rangeOptions.className = 'options'


	const rangeInput = document.createElement('input')
	rangeInput.type = 'range'
	rangeInput.name = 'range'
	rangeInput.id = 'counts'
	rangeInput.value = 15
	rangeInput.onchange = (event) => rangeSlider(event.target.value);
	rangeInput.min = 0
	rangeInput.max = 100
	rangeOptions.appendChild(rangeInput)

	const rangeLabel = document.createElement('label')
	rangeLabel.id = 'countLabel'
	rangeLabel.innerHTML = '0'
	rangeOptions.appendChild(rangeLabel)
	rangeDiv.appendChild(rangeOptions)

	form.appendChild(rangeDiv)

	// TEXTURE 

	const textureDiv = document.createElement('div')
	textureDiv.className = 'texture'

	const textureTitle = document.createElement('p')
	textureTitle.innerHTML= 'Texture'
	textureTitle.className= 'title'
	
	const textureOptions = document.createElement('div')
	textureOptions.className = 'options'

	textureOptions.appendChild(createOption('texture','default', 'default-tex', 'd-tex',true))
	textureOptions.appendChild(createOption('texture','special', 'special-tex', 's-tex'))
	textureOptions.appendChild(createOption('texture','popular', 'popular-tex', 'p-tex'))
	textureDiv.appendChild(textureTitle)
	textureDiv.appendChild(textureOptions)
	form.appendChild(textureDiv)

	// BACKGROUNG

	const backgroundDiv = document.createElement('div')
	backgroundDiv.className = 'background'

	const backgroundTitle = document.createElement('p')
	backgroundTitle.innerHTML= 'Background'
	backgroundTitle.className= 'title'
	
	const backgroundOptions = document.createElement('div')
	backgroundOptions.className = 'options'

	backgroundOptions.appendChild(createOption('background', 'default', 'default-bac', 'd-bac',  true))
	backgroundOptions.appendChild(createOption('background', 'special', 'special-bac', 's-bac'))
	backgroundOptions.appendChild(createOption('background', 'popular', 'popular-bac', 'p-bac'))
	backgroundDiv.appendChild(backgroundTitle)
	backgroundDiv.appendChild(backgroundOptions)
	form.appendChild(backgroundDiv)
	
	// SUBMIT BUTTON

	const button = document.createElement('button')
	button.id='start'
	button.type='submit'
	button.innerHTML='Start'
	form.appendChild(button)

	document.body.appendChild(form);
	document.getElementById('score').addEventListener('click', () => {
		document.getElementById('count').innerHTML = 'Score'
	})
	document.getElementById('time').addEventListener('click', () => {
		document.getElementById('count').innerHTML = 'Seconds'
	})

	function rangeSlider(value) {
		document.getElementById('countLabel').innerHTML = value

	}

	canva.append(form)
	return form
}

