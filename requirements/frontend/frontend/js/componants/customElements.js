import { escapeHtml } from "../utils/security.js"
import { createParagraph } from "./componants.js"

export class Icons extends HTMLDivElement
{
    constructor()
    {
        super()
        this._data = {}
    }
    async connectedCallback() 
    {
        this.updateContent(this._data.iconId)

        this.classList.add('icons')
    }
    set data(newValue)
    {
        this._data = newValue
    }
    set relationshipStatus(newValue)
    {
        this._data.relationship.status = newValue
        this.updateContent(this._data.iconId)
    }
    updateContent(iconId)
    {
        if (iconId === 'profile')
        {
            const iconAction = this.determineActionAndIcon()
            const fragement = document.createDocumentFragment()
    
            iconAction.forEach(e => {
                const div = document.createElement('div')
                const a = document.createElement('a')
    
                a.href = "#"
                a.id = this._data.id
                a.setAttribute('data-action', this._data.iconId)
                a.setAttribute('action-type', e.action)
                a.innerHTML = `<i class="iconify" data-icon="${e.icon}" data-inline="false"></i>`
                    
                div.className = 'anchor-box square'
                div.appendChild(a)
                fragement.appendChild(div)
            });
            this.replaceChildren(fragement)
        }
        else
        {
            const iconAction = this.determineActionAndIcon()
            const fragement = document.createDocumentFragment()

            iconAction.forEach((e, index) => {
                const div = document.createElement('div')
                const a = document.createElement('a')
    
                a.href = "#"
                const id = index === 0 ? 'first' : 'second'
                a.setAttribute('data-action', 'friends')
                a.setAttribute('action-type', e.action)
                a.setAttribute('id', this._data.id)
                a.innerHTML = `<i class="iconify ${id}" data-icon="${e.icon}" data-inline="false"></i>`
                    
                fragement.appendChild(a)
            });
            this.replaceChildren(fragement)
        }
    }
    determineActionAndIcon()
    {
        const {iconId, relationship = null} = this._data

        let type

        if (iconId === 'profile')
            type = relationship ? relationship.status : 'me'
        else if (iconId === 'friend')
            type =  relationship ? relationship.status  : 'me-friends'
        else 
            type = 'request'

        if (type === 'me-friends')
            return []
        const iconActionType = {
        'friend'  : [{icon : 'eva:person-remove-outline', action :'remove_friend'}],
        'stranger' : [{icon : 'eva:person-add-outline', action : 'send_request'}],
        'pending' : [{icon : 'dashicons:no', action : 'reject_request'}, {icon : 'dashicons:yes', action : 'accept_request'}],
        'requested' : [{icon : 'dashicons:no', action : 'cancel_request'}],
        'me' : [{icon : 'mage:edit', action : 'edit_profile'}],
        'request' : [{icon : 'dashicons:no', action : 'reject_request'}, {icon : 'dashicons:yes', action : 'accept_request'}]
        }
        return (iconActionType[type])

    }
}
customElements.define('custom-icons', Icons, { extends: 'div' }) 

export class Friends extends HTMLDivElement
{
    constructor()
    {
        super()

        this._friendsList = true
        this._friendsListDb = null
        this._friendsRequesstDb = null
    }
    set friendsList(value)
    {
        this._friendsList = value
        this.updateContent()
    }
    set friendsListDb(value)
    {
        if (this._friendsListDb === null)
            this._friendsListDb = value
    }
    set friendsRequestsDb(value)
    {
        if (this._friendsRequesstDb === null)
            this._friendsRequestsDb = value
    }
    set updateDb({index, action})
    {
        if (this._friendsList === true)
            this._friendsListDb.splice(index, 1)
        else
        {
           
            const{
                id,
                username,
                profilePic,
                relationship = {status  : 'friend' },
            } = this._friendsRequestsDb[index]
            if (action === 'accept_request')
                this._friendsListDb.push({id, username, profilePic, relationship, other : 'online', type : 'friend'})
            this._friendsRequestsDb.splice(index, 1)
        }
        this.removeChildUi(index)
    }
    set updateStatus({friend_id, status})
    {
        const friendBoxItem = this.querySelector(`[userId="${friend_id}"]`)

        if (friendBoxItem)
        {
            const statusDom = friendBoxItem.querySelector('.status')
            statusDom.id = escapeHtml(status)
            statusDom.innerHTML = escapeHtml(status)
        }
    }
    async connectedCallback() 
    {
        this.id = 'friends-box-container'
        this.updateContent()
    }
    removeChildUi(index)
    {
        const childToRemove = this.children[index]
        this.removeChild(childToRemove)

        const db = this._friendsList === true ? this._friendsListDb : this._friendsRequestsDb

        if (db.length === 0)
        {
            const value = this._friendsList ? 'friends' : 'requests'

            this.replaceChildren(createParagraph(value, `there is no ${value} at the moment`))
            return ;
        }
        Array.from(this.children).forEach((e, index) => e.id = index)

    }
    updateContent()
    {
        const db = this._friendsList === true ? this._friendsListDb : this._friendsRequestsDb
        let fragment = document.createDocumentFragment()

        if (db.length === 0)
        {
            const value = this._friendsList ? 'friends' : 'requests'

            fragment.appendChild(createParagraph(value, `there is no ${value} at the moment`))
        }
        db.forEach((e, index) => {
            const friendBoxItem = document.createElement('div')
            const value = this._friendsList === true ? 'status' : 'time-request'
            friendBoxItem.classList.add('friends-box-item')
            friendBoxItem.setAttribute('index', index)
            friendBoxItem.setAttribute('userId', e.id)
            friendBoxItem.innerHTML =
            `
                <img src='${escapeHtml(e.profilePic)}'>
                <div class="user-infos">
                    <p class="username">${escapeHtml(e.username)}</p>
                    <p class="${value}" id="${e.other}">${escapeHtml(e.other)}</p>
                </div>
            `
            const icons = document.createElement('div', {is : 'custom-icons'})
            icons.className = 'icons'
            icons.data = {id : e.id, relationship : e.relationship || null , iconId : e.type}
            friendBoxItem.appendChild(icons)

            fragment.appendChild(friendBoxItem)
        })
        this.replaceChildren(fragment)
    }
}
customElements.define('custom-friends', Friends, { extends: 'div' }) 
