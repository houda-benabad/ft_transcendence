export class Icons extends HTMLDivElement
{
    constructor()
    {
        super()
        this._data = {}
    }
    // set action(newValue)
    // {
    //     this._action = newValue
    //     this.setAttribute('action', newValue)
    //     this.updateContent()
    // }
    // get action() // i dont know if i will be in need of this anymore
    // {
    //     return this._action
    // }
    async connectedCallback() 
    {
        this.updateContent(this._data.iconId)

        this.classList.add('icons')
    }
    set data(newValue)
    {
        this._data = newValue
        // console.log('the setter of custom element was fired : ', this._data)
    }
    set relationshipStatus(newValue)
    {
        this._data.relationship.status = newValue
        this.updateContent(this._data.iconId)
    }
    updateContent(iconId)
    {
        // console.log('hallo : ', iconId)
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

            // console.log('hereeeeee: ', iconAction)
            iconAction.forEach((e, index) => {
                const div = document.createElement('div')
                const a = document.createElement('a')
    
                a.href = "#"
                console.log('in custom element ', this._data.id)
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

        // console.log('->>>>>>>> type :' , type)
        // console.log('my id type : ', iconId)
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