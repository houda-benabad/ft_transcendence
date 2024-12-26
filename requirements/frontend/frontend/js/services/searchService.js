import { createParagraph } from "../componants/componants.js"
import { escapeHtml } from "../utils/security.js"
import { apiService } from "./apiService.js"

export const searchService =
{
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
    },
    async performSearch(query)
    {
        const response = await apiService.user.getUsers(query)

        const searchResults = document.getElementById('search-results') // dry
        let fragment = document.createDocumentFragment()
        if (!response.length)
            fragment.appendChild(createParagraph('no-result', 'no Results'))
        response.forEach(e => {
            const {username, profile_pic_url: profilePic, user_id: id} = e // to add id in here
            
            const searchItem = document.createElement('div')
            searchItem.id = id
            searchItem.classList.add('search-item')
            searchItem.innerHTML = 
                `<img src=${escapeHtml(profilePic)}>
                <p>${escapeHtml(username)}</p>`
            fragment.appendChild(searchItem)
        })
        searchResults.style.display = 'block'
        searchResults.innerHTML = `<p id="loading">loading ... </p>`
        setTimeout(() => searchResults.replaceChildren(fragment), 1000)
    },
    clear()
    {
        const searchResults = document.getElementById('search-results')
        const searchInput = document.getElementById('search-input')

        searchResults.classList.remove('clicked')
        searchResults.style.display = 'none'
        searchResults.replaceChildren()
        
        searchInput.value = ''
    }
}