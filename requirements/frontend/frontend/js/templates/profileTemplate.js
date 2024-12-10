export const profileTemplate  =
{
    layout()
    {
        return (
            `<div id="profile-box1"></div>
            <div class="table-box"></div>
            <div class="friends-box"></div>`
        )
    },
    profileBox(db)
    {
        return (`
            <div id="box">
            <div id="profile-box1-top">
                <div id="profile-box1-top1">
                    <img src="${db.profilePic}">
                    <div id="profile-box1-top-id">
                        <h2 id="profile-box1-top-username">${db.username}</h2>
                        <p class="status profile-box1-box-text">${db.status}</p>
                    </div>
                </div>
                <div class="anchor-box square">
                    <a href="./edit-profile"><i class="iconify" data-icon="${db.iconType}" data-inline="false"></i></a>
                </div>
            </div>
            <div id="profile-box1-middle">
                <p class="profile-box1-box-text">Level</p>
                <div>
                    <div id="level-wrap" class="progress">
                        <div id="level-progress" class="progress"></div>
                    </div>
                    <p class="profile-box1-box-text">67%</p>
                </div>
            </div>
            <div id="profile-box1-bottom">
                <div>
                    <p class="profile-box1-box-text">total Points</p>
                    <p class="profile-box1-bottom-data">${db.totalPoints}</p>
                </div>
                <div class="vertical-dividers"></div>
                <div>
                    <p class="profile-box1-box-text">total Games</p>
                    <p class="profile-box1-bottom-data">${db.totalGames}</p>
                </div>
                <div class="vertical-dividers"></div>
                <div>
                    <p class="profile-box1-box-text">friends</p>
                    <p class="profile-box1-bottom-data">${db.friendsCount}</p>
                </div>
                <div class="vertical-dividers"></div>
                <div>
                    <p class="profile-box1-box-text">Rank</p>
                    <p class="profile-box1-bottom-data">${db.rank}</p>
                </div>
            </div>
        </div>`)
    },
    gameHistory(db)
    {
        let dynamicPart = ''

        if (!db.length)
            dynamicPart = `<tr><td colspan="4" id="no-data">no games played yet !!!</td></tr>`
        db.forEach(e => {
            dynamicPart += 
            `<tr>
                <td>${e.gameType}</td>
                <td>${e.dateTime}</td>
                <td>${e.gamePoints}</td>
                <td>${e.gameStatus}</td>
            </tr>
            `
        });

        return `
        <h3>Game History</h3>
        <div id="table">
        <table>
            <thead>
                <tr>
                    <th>game type</th>
                    <th>date/time</th>
                    <th>points</th>
                    <th>status</th>
                </tr>
            </thead>
            <tbody>
            ${dynamicPart}
            </tbody`        
    },
    friendsBox(db)
    {
        let friendsBoxConatainer = document.getElementById('friends-box-container')
        let fragment = document.createDocumentFragment()

        //good idea to use here a document fragment and replacechildren
        
        db.forEach(e => {
            const friendBoxItem = document.createElement('div')

            friendBoxItem.classList.add('friends-box-item')
            friendBoxItem.innerHTML =
            `
                <img src='${e.profilePic}'>
                <div class="user-infos">
                    <p class="username">${e.username}</p>
                    <p class="other">${e.other}</p>
                </div>
            `
            const iconsDiv = document.createElement('div')

            iconsDiv.classList.add('icons')
            iconsDiv.innerHTML = ''
            e.icons.forEach((e, index) => {
                iconsDiv.innerHTML += ` <a href="./play" ><i class="iconify ${index === 0 ? 'first' : 'second'}" data-icon="${e}" data-inline="false"></i></a>`
            })
            friendBoxItem.appendChild(iconsDiv)

            fragment.appendChild(friendBoxItem)
        })
        friendsBoxConatainer.replaceChildren(fragment)
    },
}
{/* <a href="./play" ><i class="iconify first" data-icon="${e.firstIcon}" data-inline="false"></i></a>
<a href="./remove" ><i class="iconify second" data-icon="${e.secondIcon}" data-inline="false"></i></a> */}