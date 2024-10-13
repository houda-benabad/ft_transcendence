const routes = {
    '/' : './html/signup.html',
    '/register' : './html/register.html',
    '/home' : './html/header.html'
}

function saveGenderOption () //function feature to check gender
{
    document.querySelectorAll('.gender-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.gender-option').forEach(item => item.classList.remove('selected'))
            option.classList.add('selected')

            const value = option.getAttribute('data-value')
            document.querySelector('#selected-gender').value = value
        })
    })
}
export async function loadPage(path)
{ 
    const app = document.getElementById('app')
    
    const htmlFile = routes[path]
    const html = await fetch(htmlFile)
    const content = await html.text()
    
    
    app.innerHTML = ''
    app.innerHTML = content
    if (path == '/register')
        saveGenderOption()
}

export function waitForFormSubmit()
{
    return (new Promise((resolve) => {
        const form = document.querySelector('form')
        const path = document.getElementById('submit').getAttribute('data-link')
        form.addEventListener('submit', (event) => {
            event.preventDefault()
            if (!saveFormData())
                return ;
            resolve(path)
        })
    }))
}

// this part gave it to the backend.
function saveFormData(path)
{
    const formId = document.querySelector('form').getAttribute('data-id')
    if (formId === 'login')
    {
        const loginData = {
            username : document.querySelector('#username').value,
            password : document.querySelector('#password').value
        }
        app.loginData = loginData // this is where i saved data related to login
    }
    else
    {
        const genderValue = document.getElementById('selected-gender').value
        console.log('gender value : ' + genderValue)
        if (!genderValue)
        {
            document.getElementById('error-message').style.display = 'block'
            return false;
        }
        const registrationData = {
            username : document.getElementById('username').value,
            country : document.getElementById('country').value,
            birthday : {
                day : document.getElementById('day').value,
                month : document.getElementById('month').value,
                year : document.getElementById('year').value,
            },
            gender : genderValue
        }
        app.registrationData = registrationData // thsi where i saved data related to register
    }
    return true
}

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