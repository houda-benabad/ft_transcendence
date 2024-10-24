import router from './router.js'

const valueType = ['Sign up', 'Sign in']
// to remove event listners that we wont be in need anymore

export async function superviser()
{
    await updateData()
    eventListener()
    await waitForFormSubmit()
}

export async function loadFirstPage()
{ 

    const app = document.getElementById('app')
    app.innerHTML =
    `
    <div id="image-cover"></div>
    <div class="container">
        <div id="signDiv" data-value='Sign in'>
            <h1 class='sign'></h1>
            <form data-id="login">
                <label for="username">Username</label>
                <input name="username" id="username" required/>
                <label for="password" type="password">Password</label>
                <input name="password" id="password" type="password" required>
                <button type='submit' class="button-type1 sign"></button>
            </form>
            <div class="line-text">
                <span>or</span>
            </div>
            <a class="clickable intra" href="#">
                <img src="static/img/intra-removebg-preview 1.png">
                <p>continue with <span>Intra</span></p>
            </a>
            <p id="sign-text"></p>
        </div>
    </div>
    `
}

function updateData()
{
    const value = document.getElementById('signDiv').getAttribute('data-value')

    const dataToChange = document.querySelectorAll('.sign').forEach(e => {
        e.innerHTML = value
    })
    document.querySelectorAll('input').forEach(e => { e.value = ''})

    const signText = document.getElementById('sign-text')
    const signAnchor = document.getElementById('sign-anchor')

    const text = (value === valueType[0]) ? "already a Member?" : "don't you have an Account?"
    const text2 = (value === valueType[0]) ? valueType[1] : valueType[0]

    signText.innerHTML = text + ` <a href="#" id="sign-anchor">${text2}</a>`

}
export function eventListener()
{
    const tmpAnchor = document.getElementById('sign-anchor')
    const tmpAnchor2 = document.querySelector('.intra')

    tmpAnchor.addEventListener('click', (event) => {
        event.preventDefault()
        document.getElementById('signDiv').dataset.value = tmpAnchor.innerHTML
        updateData()
    }
    )

    tmpAnchor2.addEventListener('click', async (event) => 
    {
        const value = tmpAnchor2.dataset.value
        let response
        event.preventDefault()
        try
        {
            console.log('data sent successfully to : intra') // just for the moment
            response = await fetch('https://8b89b413-0cc1-4252-92aa-2ac6c60c1be4.mock.pstmn.io/intra')
            if (!response.ok)
            {
                throw new Error(response.status)
                return ;
            }
        }
        catch(error)
        {
            console.log(error)
        }
        
        const responseBody = await response.json()

        await showModal(responseBody)
    })
}
export function waitForFormSubmit(type='false')
{
    return (new Promise((resolve) => {
        const form = document.querySelector('form')

        form.addEventListener('submit', async (event) => {
            event.preventDefault()
            if (type)
            {
                let data = new FormData(form);
				let playersObject = Object.fromEntries(data)
                let players = Object.values(playersObject)
                return resolve(players)
            }
            await sendData()
            console.log('im out of send data')
            resolve('/home')
        })
    }))
}
// this part gave it to the backend.
async function sendData()
{
    const endpoint = document.getElementById('signDiv').getAttribute('data-value').toLowerCase().replace(' ', '')

    const form = document.querySelector('form')
    const formData = new FormData(form)
    const formObject = {}
    let response

    formData.forEach((value, key) => { formObject[key] = value })

    try
    {
        console.log('data sent successfully to : ' + endpoint)
        response = await fetch(`https://8b89b413-0cc1-4252-92aa-2ac6c60c1be4.mock.pstmn.io/${endpoint}`, {
            method : 'POST', 
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify(formObject)
        })
        if (!response.ok)
        {
            if (response.status !== 401 & response.status !== 409)
                throw new Error(response)
        }
    }
    catch(error)
    {
        console.log('an error occured')
    }
    const responseBody = await response.json()

    await showModal(responseBody)
}

export async function showModal(message, type)
{
    const app = document.getElementById('app')
    const div = document.createElement('div')

    div.id = 'modal-background'
    div.innerHTML = 
    `
        <div id="modal">
        </div>
    `
    app.appendChild(div)

    const modalBackground = document.getElementById('modal-background')
    const modalMessage = document.getElementById('modal')

    if (!type)
    {
        modal.innerHTML = message
        modalBackground.style.display = 'flex'
    }
    else
    {
        // make it work later on make it cleaner and better
        if (type === 'alias')
        {
            modal.classList.add('modal-special')
            modal.innerHTML =
            `
            <h2>Tournament Registration</h2>
            <form id="alias">
                <label for='first-player'>first player</label>
                <input type='text' id='first-player' name='first-player' required>
            
                <label for='first2-player'>first player</label>
                <input type='text' id='first2-player' name='first2-player' required>
            
                <label for='first3-player'>first player</label>
                <input type='text' id='first3-player' name='first3-player' required>
        
                <label for='first4-player'>first player</label>
                <input type='text' id='first4-player' name='first4-player' required>
        
                <button type='submit' id='submit' class='button-type4'>Save</button>
            </form>
            `
        }
        modalBackground.style.display = 'flex'
        let response = await waitForFormSubmit(type, true)
        console.log('response : ' + response)
        modalBackground.style.display = 'none'
        app.removeChild(div)
        return (response)
    }

    // we did remove it for the pop up windows for the game part for a reason
    modalBackground.addEventListener('click', (event) => {
        if (event.target === modalBackground)
        {
            modalBackground.style.display = 'none'
            app.removeChild(div)
        }
        
    })
}

export function delay (ms) 
{ return new Promise(resolve => 
    {
        const app = document.getElementById('app')

        app.innerHTML = "<div id='loader'></div>"
        setTimeout(resolve, ms)
    })
}

// other function , we ll see if we need them later on 
export function tableLine(data)
{
    const key = Object.keys(data)

    const tr = document.createElement('tr')
    for (let i = 0 ; i < key.length ; i++)
    {
        const td = document.createElement('td')
        td.innerHTML = `${data[key[i]]}`
        tr.appendChild(td)
    }
    document.querySelector('tbody').appendChild(tr)
}

function createFriendLine(friend)
{
    const key = Object.keys(friend)

    const friendsList = document.querySelector('.friends-user-list')

    friendsList.innerHTML += 
    `
        <div class='friend ${friend[key[2]]}'>
            <img src="${friend[key[0]]}">
            <div class="friend-mini-box">
                <div id="friend-info">
                    <p id="friend-name">${friend[key[1]]}</p>
                    <p id="status">${friend[key[2]]}</p>
                </div>
                <div id="icons">
                    <a href="#"><i class="iconify" data-icon="solar:gamepad-old-linear" data-inline="false"></i></a>
                </div>
            </div>
        </div>
    `
}
export async function addFriendsBox()
{
    const friendsBox = document.querySelector('.friends-box')
    friendsBox.innerHTML = 
    `
    <h2>Friends</h2>
    <div class="friends-user-list"></div>
    `

    const response = await fetch('../Apis/friends.json')
    const responseText = await response.text()

    if (responseText)
    {
        const response = JSON.parse(responseText)
        const friend = response.friends
        
        for (let i = 0; friend[i] ; i++)
            createFriendLine(friend[i])
    }
    else
    {
        document.querySelector('.friends-user-list').innerHTML =
        `
            <p class="message-info"> you don't have any friends at the current moment</p>
        `
    }
}

// houda palezzzzzz rememeber this 

export async function getBackToHome()
{
    await addWebsiteLayout()
    router.init()
}

export async function addWebsiteLayout() {
    const response = await fetch('/websiteLayout')
    const responseText = await response.text()
    const app = document.getElementById('app')

    app.classList.add('active')
    app.innerHTML = `${responseText}`
}
