import { apiService } from "../services/apiService.js"
import { profileTemplate } from "../templates/profileTemplate.js"
import { animateProgressBar } from "../utils/animations.js"
import { eventListeners } from "../utils/global.js"
export class profileView extends HTMLElement
{
    constructor(){
        super()
        //initialize which type of element we are talking about
    }
    async connectedCallback() 
    {
        this.innerHTML = profileTemplate.layout()

        const id = this.dataset.options
        const response = apiService.user.getUserInfos(id)
        console.log('identifier : =>.', id)
        //here to fetch for the profile infos
        const profile_pic_url = '../asse.jpeg'
        
        this.addProfile(profile_pic_url)
        this.gameHistory()
        this.friends() // still need to make this one responsive.
    }
    addProfile(profile_pic_url)
    {
        const profileBox = document.getElementById('profile-box1')
    
        profileBox.innerHTML = profileTemplate.profileBox(profile_pic_url)
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