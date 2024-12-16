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
                    <input type='text' id='first-player' name='first-player' required>
                
                    <label for='second-player'>second player</label>
                    <input type='text' id='second-player' name='second-player' required>
                
                    <label for='third-player'>third player</label>
                    <input type='text' id='third-player' name='third-player' required>
            
                    <label for='fourth-player'>fourth player</label>
                    <input type='text' id='fourth-player' name='fourth-player' required>
            
                    <button type='submit' id='submit' class='button-type4'>Save</button>
                    </form>
                </div>
            </div>`)
    }
}