export class settingsView extends HTMLElement
{
    constructor()
    {
        super()
    }
    connectedCallback()
    {
        this.addLayout()
        this.addSettingsBox1()
        this.addSettingsBox2()
        this.addSettingsBox3()
        this.eventListener()
        
    }
    addLayout()
    {
        const settingsBox1 = document.createElement('div')
        const settingsBox2 = document.createElement('div')
        const settingsBox3 = document.createElement('div')

        settingsBox1.id = 'settings-box1'
        settingsBox2.id = 'settings-box2'
        settingsBox3.id = 'settings-box3'

        this.appendChild(settingsBox1)
        this.appendChild(settingsBox2)
        this.appendChild(settingsBox3)
    }
    addSettingsBox1()
    {
        const settingsBox1 = document.getElementById('settings-box1')

        settingsBox1.innerHTML =
        `
            <h2>Profile</h2>
            <div id="user-picture">
                <img src='static/img/user.jpeg'>
                <button class="tmp-anchors button-type4">Update</button>
                <button class="tmp-anchors button-type3">Delete</button>
            </div>
            <div id='user-username'>
                <p>username</p>
                <div>
                    <input type='text' placeholder='new username'>
                    <button class="tmp-anchors button-type4">Save</button>
                </div>
            </div>
        `
    }
    addSettingsBox2()
    {
        const settingsBox2 = document.getElementById('settings-box2')

        settingsBox2.innerHTML =
        `
            <h2>Security</h2>
            <div>
                <p>Password</p>
                <button class="tmp-anchors button-type4">Add</button>
            </div>
            <div>
                <p>bloqued users</p>
                <button class="tmp-anchors button-type4" value="view list">view list</button>
            </div>
            <div>
                <p>2fa</p>
                <label id="switch">
                    <input type="checkbox" class="tmp-anchors">
                    <span>
                </label>
            </div>
        `
    }
    addSettingsBox3()
    {
        const settingsBox3 = document.getElementById('settings-box3')

        settingsBox3.innerHTML =
        `
            <h2>Account</h2>
            <div>
                <p>Permanently delete your Account and all associated data</p>
                <button class="tmp-anchors button-type3">Delete Account</button>
            </div>
        `
    }
    eventListener()
    {
        const tmpAnchors = document.querySelectorAll('.tmp-anchors')

        tmpAnchors.forEach(a => a.addEventListener('click', () => {
            if (a.value === 'view list')
            {
                this.innerHTML += 
                `<div class="overlay">
                    <div class="centered-content">
                        <h2>bloqued users </h2>
                    </div>
                </div>`

                document.querySelector('.overlay').addEventListener('click', function(event) {
                    if (this === event.target)
                        console.log('remove my pop up window')
                })
            }
        })
        )
        document.body.style.overflow = 'hidden'
    }
}

customElements.define('settings-view', settingsView)