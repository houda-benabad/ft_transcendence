export function layoutTemplate()
{
    return(`
        <div id="header">
            <div id="header-highlight">
            </div>
            <div id="search-bar">
                <input id="search-input" type="text" placeholder="search friends ..."autocomplete="off">
                <i class="iconify" data-icon="teenyicons:search-outline" data-inline="false"></i>
                <div id="search-results"></div>
            </div>
           
        </div>
        <div id="navbar">
            <nav>
                <div id="nav-top">
                    <a href="/" data-action="router" class="selected"><i class="iconify" data-icon="hugeicons:home-02" data-inline="false"></i></a>
                    <a href="/profile" data-action="router"><i class="iconify" data-icon="fluent:person-20-regular" data-inline="false"></i></a>
                    <a href="/game-settings" data-action="router"><i class="iconify" data-icon="solar:gamepad-old-linear" data-inline="false"></i></a>
                </div>
                <div id="nav-btm">
                    <a href="/settings" data-action="router"><i class="iconify" data-icon="solar:settings-outline" data-inline="false"></i></a>
                    <a href="/logout" data-action="router"><i class="iconify" data-icon="streamline:logout-1" data-inline="false"></i></a>
                </div>
            </nav>
        </div>
        <div id="main"></div>
    `)
}
