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
        this.updateContent()

        this.classList.add('icons')
    }
    set data(newValue)
    {
        this._data = newValue
        console.log('the setter of custom element was fired : ', this._data)
    }
    set relationshipStatus(newValue)
    {
        this._data.relationship.status = newValue

        this.updateContent()
    }
    updateContent()
    {
       
        // console.log('relationship : ', this._data.relationship)
        const iconAction = this.determineActionAndIcon()
        const fragement = document.createDocumentFragment()

        iconAction.forEach(e => {
            const div = document.createElement('div', )
            div.className = 'anchor-box square'
            div.innerHTML = `<a href="#" userId="${this._data.userId}"data-action="friendship" action-type="${e.action}"><i class="iconify" data-icon="${e.icon}" data-inline="false"></i></a>`
            fragement.appendChild(div)
        });
        this.appendChild(fragement)
    }
    determineActionAndIcon()
    {
        const {id, relationship} = this._data

        let type

        if (id === 'profile')
            type = relationship ? relationship.status : 'me'
        else if (id === 'friends')
            type =  relationship ? relationship.status  : 'me-friends'
        else 
            type = 'requests'

        console.log('type :' , type)
        const iconActionType = {
        'friend'  : [{icon : 'eva:person-remove-outline', action :'remove_friend'}],
        'stranger' : [{icon : 'eva:person-add-outline', action : 'send_request'}],
        'pending' : [{icon : 'dashicons:no', action : 'cancel_request'}, {icon : 'dashicons:yes', action : 'accept_request'}],
        'requested' : [{icon : 'dashicons:no', action : 'cancel_request'}],
        'me' : [{icon : 'mage:edit', action : 'edit_profile'}],
        'requests' : [{icon : 'dashicons:no', action : 'cancel_request'}, {icon : 'dashicons:yes', action : 'accept_request'}]
        }
        return (iconActionType[type])

    }
}
customElements.define('custom-icons', Icons, { extends: 'div' }) 