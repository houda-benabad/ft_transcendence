export function signTemplate()
{
    return (`
     <div id="image-cover"></div>
    <div id="signDiv" data-value='Sign up' class="container">
        <h1 class='sign'></h1>
        <form data-id="login">
            <label for="username">Username</label>
            <input name="username" id="username" required/>
            <label for="password" type="password">Password</label>
            <input name="password" id="password" type="password" required>
            <button type='submit' class="sign" id="button-type1"></button>
        </form>
        <div class="line-text">
            <span>or</span>
        </div>
        <a class="intra" href="#">
            <img src="../../assets/componants/intra-removebg-preview 1.png">
            <p>continue with <span>Intra</span></p>
        </a>
        <div id="redirect">
            <p id="sign-text"></p>
            <a href="#" id="sign-anchor"></a>
        </div>
    </div>
    `)
}