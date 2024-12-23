import router  from '../router/router.js'
import { apiService } from '../services/apiService.js'

export class EventManager
{
    constructor()
    {
        this.init()
    }
    init()
    {
        // i have one event listeners
        document.addEventListener('click', this.handleEventDelegation.bind(this))
    }
    handleEventDelegation(event)
    {
        const htmlElement = event.target
        console.log('html element : ', htmlElement)
        // console.log('target :' , event.target)
        // console.log('333333 here in the manager : ', htmlElement)
        const tagName = htmlElement.tagName

        if (tagName === 'A')
            event.preventDefault()
       
    //   this.determineTheAction(htmlElement)
    }
    async determineTheAction(htmlElement)
    {
        //will make it more generic
        // add functions that does for me the work :)
        const action = htmlElement.getAttribute('action')
        const userId = htmlElement.getAttribute('userId')

        // console.log(' =>>>> html eleemnts is : ', htmlElement)
        if (action === 'edit_profile')
            router.navigateTo('/settings')
        else if (action === 'send_request' || action === 'accept_request')
        {
            // console.log('a malkkk')
            await apiService.profile.postFriendship(`${action}/${userId}`)
            if (action === 'send_request')
                htmlElement.action = 'cancel_request'
            else if(action === 'accept_request')
                htmlElement.action = 'to_profile'
            // htmlElement.content = '<i class="iconify" data-icon="dashicons:no" data-inline="false"></i>'
        }
        else if (action === 'remove_friend' || action === 'cancel_request')
        {
            await apiService.profile.deleteFriendship(`${action}/${userId}`)
            htmlElement.action = 'send_request'
        }
        //update icon automatically.
    }
    //icons as custom eleemnt when i set , automatically it does change .
}

// gotta make the div as a whole of icons . 