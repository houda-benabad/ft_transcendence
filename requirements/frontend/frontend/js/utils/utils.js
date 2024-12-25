import { layoutTemplate } from '../templates/layoutTemplate.js'

export async function reset()
{
    const app = document.getElementById('app')
    
    await new Promise(resolve => {
        app.innerHTML = '<div id="loader"></div>'
        setTimeout(resolve, 1500)
    })
    app.innerHTML = layoutTemplate()
    app.classList.add('active')
    
}