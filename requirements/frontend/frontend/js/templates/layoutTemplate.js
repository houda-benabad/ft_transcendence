export function layoutTemplate()
{
    return(`
        <div id="header">
            <h2></h2>
            <div id="search-bar">
                <input id="search-input" type="text" placeholder="search friends ...">
                <i class="iconify" data-icon="teenyicons:search-outline" data-inline="false"></i>
                <div id="search-results"></div>
            </div>
            <div class="anchor-box circle">
                <a href="/notify"><i class="iconify" data-icon="clarity:notification-line" data-inline="false"></i></a>
            </div>
        </div>
        <div id="navbar">
            <nav>
                <div id="nav-top">
                    <a href="/home" data-action="router" class="static"><i class="iconify" data-icon="hugeicons:home-02" data-inline="false"></i></a>
                    <a href="/profile" data-action="router" class="static selected"><i class="iconify" data-icon="fluent:person-20-regular" data-inline="false"></i></a>
                    <a href="/game" data-action="router" class="static"><i class="iconify" data-icon="solar:gamepad-old-linear" data-inline="false"></i></a>
                </div>
                <div id="nav-btm">
                    <a href="/settings" data-action="router" class="static"><i class="iconify" data-icon="solar:settings-outline" data-inline="false"></i></a>
                    <a href="/logout" data-action="router" class="static"><i class="iconify" data-icon="streamline:logout-1" data-inline="false"></i></a>
                </div>
            </nav>
        </div>
        <div id="main"></div>
    `)
}

// to add h2 with username injected to itp