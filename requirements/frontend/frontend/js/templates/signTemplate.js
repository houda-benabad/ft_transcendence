import { SIGN_VIEW } from '../constants/sign.js'
import { escapeHtml } from '../utils/security.js'

export function signTemplate(type)
{
    const db = getData(type)

    return (`
     <div id="image-cover"></div>
    <div id="signDiv" class="container">
        <h1>${escapeHtml(db.sign)}</h1>
        <form data-action="${type}" id="sign">
            <label for="username">Username</label>
            <input name="username" id="username" required/>
            <label for="password" type="password">Password</label>
            <input name="password" id="password" type="password" required>
            <button type='submit' id="button-type1">${escapeHtml(db.sign)}</button>
        </form>
        <div class="line-text">
            <span>or</span>
        </div>
        <a class="intra" href="#" data-action="intra">
            <img src="../../assets/componants/intra-removebg-preview 1.png">
            <p>continue with <span>Intra</span></p>
        </a>
        <div id="redirect">
            <p>${escapeHtml(db.signText)}</p>
            <a href="#" data-link='${db.signlink}'>${escapeHtml(db.signAnchor)}</a>
        </div>
    </div>
    `)
}


function getData(type)
{
    return {
        sign : type === 'signin' ? 'Sign in' : 'Sign up',
        signAnchor : type === 'signin' ? 'Sign up' : 'Sign in',
        signlink : type === 'signin' ? '/signup' : '/signin',
        signText : type === 'signin' ? SIGN_VIEW.NO_ACCOUNT : SIGN_VIEW.ALREADY_MEMBER
    }
}