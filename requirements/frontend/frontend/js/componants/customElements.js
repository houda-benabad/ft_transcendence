export class Icons extends HTMLDivElement
{
    constructor()
    {
        super()
        // this._action = null
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
        console.log('im in the connected call back of connected call back - -')
        // this._action = this.getAttribute('action')
        this.updateContent()

    }
    set data(newValue)
    {
        this._data = newValue

        console.log('im in the setter : ', this._data)
    }
    updateContent()
    {
       
        console.log('relationship : ', this._data.relationship)
        const iconAction = this.determineActionAndIcon()
        const fragement = document.createDocumentFragment('fragmenet')

        // for the momenet for the profile
        iconAction.forEach(e => {
            const div = document.createElement('div', )
            div.className = 'anchor-box square'
            div.userId = this._data.userId
            console.log('->>>>> div : ', div)
            div.innerHTML = `<a href="#" data-action="${e.action}" class="static"><i class="iconify" data-icon="${e.icon}" data-inline="false"></i></a>`
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

        const iconActionType = {
        'friend'  : [{icon : 'eva:person-remove-outline', action :'remove_friend'}],
        'stranger' : [{icon : 'eva:person-add-outline', action : 'send_request'}],
        'pending' : [{icon : 'dashicons:no', action : 'cancel_request'}, {icon : 'dashicons:yes', action : 'accept_request'}],
        'requested' : [{icon : 'dashicons:no', action : 'cancel_request'}],
        'me' : [{icon : 'mage:edit', action : 'edit_profile'}],
        'requests' : [{icon : 'dashicons:no', action : 'cancel_request'}, {icon : 'dashicons:yes', action : 'accept_request'}]
        }
        // console.log('here in the extractor : ', IconType[type])
        return (iconActionType[type])

    }
}
customElements.define('custom-icons', Icons, { extends: 'div' }) 

/////// let it go fo nowww
// const IconType = {
//     'friend'  : [{icon : 'eva:person-remove-outline', action :'remove_friend'}],
//     'stranger' : [{icon : 'eva:person-add-outline', action : 'send_request'}],
//     'pending' : [{icon : 'dashicons:no', action : 'cancel_request'}, {icon : 'dashicons:yes', action : 'accept_request'}],
//     'requested' : [{icon : 'dashicons:no', action : 'cancel_request'}],
//     'me' : [{icon : 'mage:edit', action : 'edit_profile'}],
//     'requests' : [{icon : 'dashicons:no', action : 'cancel_request'}, {icon : 'dashicons:yes', action : 'accept_request'}]
// }


// data-icon="${icon}"

//  data-icon="${icon}"