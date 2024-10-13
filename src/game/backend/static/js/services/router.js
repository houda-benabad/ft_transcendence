import './profileView.js'
import './homeView.js'
import './settingsView.js'
import './gameView.js'

const router = {
    init : () => 
    {
        document.querySelectorAll('.static').forEach((a) => 
        {
            a.addEventListener('click' , (event) => {
            document.querySelectorAll('.static').forEach((item) => item.classList.remove('selected'))
            a.classList.add('selected')

            event.preventDefault()
            const path = a.getAttribute('href')
            router.go(path)
        })
        })
        window.addEventListener('popstate', (event) => 
        {
            const path = event.state ? event.state.path : './home'
            router.go(path, false)

            document.querySelectorAll('.static').forEach((item) => item.classList.remove('selected'))
            document.querySelector(`a[href="${path}"]`).classList.add('selected')
        })
        router.go('./home', false) // route to the view i want, normally it should be profile
    },
    go : (path, addTohistory=true) => {
        if(addTohistory)
            history.pushState({path}, {}, path)
        const main = document.getElementById('main')
        let mainContent
        switch(path)
        {
            case './profile' : 
            mainContent = document.createElement('profile-view')
            break;
            case './home' :
            mainContent = document.createElement('home-view')
            break;
            case './settings' :
            mainContent = document.createElement('settings-view')
            break;
            case './game':
            mainContent = document.createElement('game-view')
            break
        }
        main.innerHTML = ''
        main.append(mainContent)
    }
}

export default router