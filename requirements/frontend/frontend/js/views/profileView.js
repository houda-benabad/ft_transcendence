import { apiService } from "../services/apiService.js"
import { profileTemplate } from "../templates/profileTemplate.js"
import { animateProgressBar } from "../utils/animations.js"

export class profileView extends HTMLElement
{
    constructor(){
        super()
    }
    async connectedCallback() 
    {
        this.innerHTML = profileTemplate.layout()
        //here to fetch for the profile infos
        console.log('im in profile view')
        const response = await apiService.profile.getProfileInfos()
        
        const [username, profile_pic_url] = response

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