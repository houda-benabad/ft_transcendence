import { profileTemplate } from "../templates/profileTemplate.js"
import { animateProgressBar } from "../utils/animations.js"

export class profileView extends HTMLElement
{
    constructor(){
        super()
    }
    connectedCallback() 
    {
        this.innerHTML = profileTemplate.layout()
        //here to fetch for the profile infos

        console.log(token)
        this.addProfile()
        this.gameHistory()
        this.friends() // still need to make this one responsive.
    }
    addProfile()
    {
        const profileBox = document.getElementById('profile-box1')
    
        profileBox.innerHTML = profileTemplate.profileBox()
        animateProgressBar()
        eventListeners.on(window, 'resize', () => animateProgressBar())    
    }
    gameHistory()
    {
        const gameHistory = document.querySelector('.table-box')

        gameHistory.innerHTML = profileTemplate.gameHistory()
    }
    friends()
    {
        const friends = document.querySelector('.friends-box')

        friends.innerHTML = profileTemplate.friends()
    }
}
customElements.define('profile-view', profileView) 