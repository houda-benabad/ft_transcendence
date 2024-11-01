import "./services/gameView.js"

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
    }

}

// export function time() {
//     let time = document.createElement('div')
//     time.setAttribute('id', 'timePanel')
//     time.innerHTML = `
// 		<div class="container">
// 			<div class="circular-progress">
// 				<span class="progress-value">0 second</span>
// 			</div>
// 		</div>
// 	`
//     return time
// }

// export function updateTime(data) {
//     let circularProgress = document.querySelector(".circular-progress"),
//         progressValue = document.querySelector(".progress-value");
//     let progressStartValue = data.elapsed,
//         progressEndValue = data.endTime
//     let progressPercentage = (progressStartValue / progressEndValue) * 100;
//     progressValue.textContent = `${progressStartValue} s`;
//     if (progressStartValue > progressEndValue)
//         circularProgress.style.background = `conic-gradient(red ${progressPercentage * 3.6}deg, black 0deg)`;
//     else
//         circularProgress.style.background = `conic-gradient(#7d2ae8 ${progressPercentage * 3.6}deg, black 0deg)`;

// }


export function updateEndGame(data) {
    let endGame = document.createElement('div');
	endGame.id = 'endGame'
	endGame.className = 'glass'
    document.getElementById('app').appendChild(endGame)

	let real_state = ""
    if (data.state == "W")
        real_state = "WON"
    else
        real_state = "LOST"

	endGame.innerHTML = `
		<h4>YOU ${real_state}!</h4>
		`
    endGame.style.transform = " translate(-50%, -50%) scale(1) "
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


export function gameSettings() {
	const main = document.getElementById('main')
	let mainContent = document.createElement('game-view')

	main.innerHTML = ''
	main.append(mainContent)
	
}

