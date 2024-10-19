import router from './router.js'

const routes = {
    '/signup' : 'signup',
    '/signin' : 'signin',
}
// to remove event listners that we wont be in need anymore

export async function init(path)
{
    await loadPage(path)
    eventListener()
    await waitForFormSubmit(path)
}

export async function loadPage(path)
{ 
    const app = document.getElementById('app')
    
    const htmlFile = routes[path]
    const html = await fetch(htmlFile)
    const content = await html.text()
    
    
    app.innerHTML = ''
    app.innerHTML = content
}

export function eventListener()
{
    const tmpAnchor = document.getElementById('sign')
    const tmpAnchor2 = document.querySelector('.intra')

    tmpAnchor.addEventListener('click', (event) => {
        event.preventDefault()
        init(tmpAnchor.getAttribute('href'))
    }
    )

    tmpAnchor2.addEventListener('click', async (event) => 
    {
        const value = tmpAnchor2.dataset.value

        console.log(value)
        event.preventDefault()
        try
        {
            console.log('data sent successfully to : intra')
            const response = await fetch('https://8b89b413-0cc1-4252-92aa-2ac6c60c1be4.mock.pstmn.io/intra')
            if (!response.ok)
            {
                throw new Error(response.status)
                return ;
            }
            await showModal(`you ${value} successfully`)
        }
        catch(error)
        {
            await showModal('an error occured')
        }
    })
}
export function waitForFormSubmit(endpoint)
{
    return (new Promise((resolve) => {
        const form = document.querySelector('form')
        const path = document.getElementById('submit').getAttribute('data-link')
        form.addEventListener('submit', async (event) => {
            event.preventDefault()
            await sendData(endpoint)
            resolve('/home')
        })
    }))
}
// this part gave it to the backend.
async function sendData(endpoint)
{
    // to use path
    const form = document.querySelector('form')
    const formData = new FormData(form)
    const formObject = {}

    formData.forEach((value, key) => { formObject[key] = value })

    try
    {
        console.log('data sent successfully to : ' + endpoint)
        const response = await fetch(`https://8b89b413-0cc1-4252-92aa-2ac6c60c1be4.mock.pstmn.io${endpoint}`, {
            method : 'POST', 
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify(formObject)
        })
        if (!response.ok)
        {
            if (response.status === 401)
            {
                await showModal('wrong username or password, please try again ^^')
                return ;
            }
            throw new Error(response.status)
        }
        await showModal('you logged in successfully')
    }
    catch(error)
    {
        await showModal('an error occured')
    }
}

async function showModal(message)
{
    const app = document.getElementById('app')
    const div = document.createElement('div')

    div.id = 'modal-background'
    div.innerHTML = 
    `
        <div id="modal">
            <p id="modal-message"></p>
        </div>
    `
    app.appendChild(div)

    const modalBackground = document.getElementById('modal-background')
    const modalMessage = document.getElementById('modal-message')

    modalBackground.style.display = 'flex'
    modalMessage.textContent = message
    
    modalBackground.addEventListener('click', (event) => {
        if (event.target === modalBackground)
            modalBackground.style.display = 'none'
        
        app.removeChild(div)
    })
}

export function delay (ms) { return new Promise(resolve => {setTimeout(resolve, ms)})}

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


