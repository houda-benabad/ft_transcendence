// export const settingsTemplate =
// {
//     layout()
//     {
//         return (`
//             <div id="settings-box1"></div>
//             <div id="settings-box2"></div>
//             <div id="settings-box3"></div>`)
//     },
//     settingsBox1()
//     {
//         return (` <h2>Profile</h2>
//             <div id="box-container">
                // <div id="user-picture">
                //     <img src='../assets/componants/user.jpeg' id="tobe-updated-img">
                //     <div id="user-picture-buttons">
                //         <input type="file" id="user-input-img" accept="image/*">
                //         <button class="anchor-tmp button-type4" data-action="update_image">Update</button>
                //         <button class="anchor-tmp button-type3" data-action="delete_image">Delete</button>
                //     </div>
                // </div>
                // <div id='user-username'>
                //     <p>username</p>
                //     <div>
                //         <input type='text' placeholder='new username' id="username-to-save">
                //         <button class="anchor-tmp button-type4" data-action="save_username">Save</button>
                //     </div>
                // </div></div>`)
//     },
//     settingsBox2()
//     {
//         return (`
//                <h2>Security</h2>
            // <div>
            //     <p>Password</p>
            //     <button class="anchor-tmp button-type4" data-action="add_password">Add</button>
            // </div>
//             <div>
//                 <p>2fa</p>
//                 <label id="switch">
//                     <input type="checkbox" class="anchor-tmp" data-action="two_fa">
//                     <span>
//                 </label>
//             </div>`)
//     },
//     settingsBox3()
//     {
//         return (`  <h2>Account</h2>
//             <div>
//                 <p>Permanently delete your Account and all associated data</p>
//                 <button class="anchor-tmp button-type3" data-action="delete_account">Delete Account</button>
//             </div>
//         `)
//     }
// }

export const settingsTemplate =
{
    settings()
    {
        return (`
            <h2>Settings</h2>
            <div id="settings">
                <div id="user-picture">
                    <p class="settings-label">Picture</p>
                    <img src='../assets/componants/user.jpeg' id="tobe-updated-img">
                    <div id="user-picture-buttons">
                        <input type="file" id="user-input-img" accept="image/*">
                        <button class="anchor-tmp button-type4" data-action="update_image">Update</button>
                        <button class="anchor-tmp button-type3" data-action="delete_image">Delete</button>
                    </div>
                </div>
                <div id='user-username'>
                    <p class="settings-label">Username</p>
                    <div>
                        <input type='text' placeholder='new username' id="username-to-save">
                        <button class="anchor-tmp button-type4" data-action="save_username">Save</button>
                    </div>
                </div>
            </div>
            `)
    },
    settingsPassword()
    {
        return (`<div>
                    <p class="settings-label">Password</p>
                    <button class="anchor-tmp button-type4" data-action="add_password">Add</button>
                </div>`)
    }
}
