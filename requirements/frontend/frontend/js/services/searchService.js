import { eventListeners } from "../utils/global.js"
import { escapeHtml } from "../utils/security.js"
import { apiService } from "./apiService.js"

export class searchService
{
    constructor()
    {
        this.searchInput = null
        this.searchResults = null
        this.debounced = null
    }
    init()
    {
        this.searchInput = document.getElementById('search-input')
        this.searchResults = document.getElementById('search-results')
        this.debounced = this.debounce(this.performSearch.bind(this), 500)

        eventListeners.on(this.searchInput, 'input', (event) => {
            const value = event.target.value

            if (value.length >= 1)
                this.debounced(value)
        })
    }
    debounce(func, delay)
    {
        let timeoutId

        return function(...args)
        {
            clearTimeout(timeoutId)

            timeoutId = setTimeout(() => {
                func.apply(this, args)
            }, delay);
        }
    }
    async performSearch(query)
    {
        const response = await apiService.search.getSearchedUsersInfos(query)
        
        console.log(response)
        // //until hind comes back ..
        // const response = [
        // {
        //     user_id : 1,
        //     username : 'pingy world',
        //     profile_pic_url : '../../assets/componants/user.jpeg',
        // },
        // {
        //     user_id : 1,
        //     username : 'pingy world',
        //     profile_pic_url : '../../assets/componants/user.jpeg',
        // },
        // {
        //     user_id : 1,
        //     username : 'pingy world',
        //     profile_pic_url : '../../assets/componants/user.jpeg',
        // }
        // ]
        // // const response = []
        // let dynamicContent = ''

        // if (!response.length)
        //     console.log('in here we need to add some magic')
        // response.forEach(e => {
        //     const {username : username, profile_pic_url: profilePic} = response

        //     dynamicContent += `<div id="search-item">
        //         <img src=${escapeHtml(profilePic)}>
        //         <p>${escapeHtml(username)}</p>
        //     </div>`
        // })

        // console.log(dynamicContent)
        // this.searchResults.style.display = 'flex'
        // this.searchResults.innerHtml = dynamicContent
    }
    clear()
    {
        this.searchInput = null
        this.searchResults = null
        this.debounced = null
    }
}