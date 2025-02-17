export const modalTemplate =
{
    tournamentForm()
    {
        return (`
             <div id="modal-background">
                <div id="modal" class="modal-special">
                    <h2>Tournament Registration</h2>
                    <form id="alias">
                    <label for='first-player'>first player</label>
                    <input type='text' id='first-player' name='first-player' required autocomplete="off">
                
                    <label for='second-player'>second player</label>
                    <input type='text' id='second-player' name='second-player' required autocomplete="off">
                
                    <label for='third-player'>third player</label>
                    <input type='text' id='third-player' name='third-player' required autocomplete="off">
            
                    <label for='fourth-player'>fourth player</label>
                    <input type='text' id='fourth-player' name='fourth-player' required autocomplete="off">
            
                    <button type='submit' id='submit' class='button-type4'>Save</button>
                    </form>
                </div>
            </div>`)
    },
    addPasswordForm()
    {
        return (`
            <div id="modal-background">
               <div id="modal" class="modal-special">
                   <h2>add password</h2>
                   <form id="add-password">
                        <label for='current_password'>current Password</label>
                        <input type='password' id='current_password' name='current_password' required>

                        <label for='new_password'>new Password</label>
                        <input type='password' id='new_password' name='new_password' required>

                         <label for='confirm_password'>confirm Password</label>
                        <input type='password' id='confirm_password' name='confirm_password' required>
                        <button type='submit' id='submit' class='button-type4'>Save</button>
                   </form>
               </div>
           </div>`)
    }
}