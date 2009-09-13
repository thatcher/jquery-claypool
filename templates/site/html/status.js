<html>
    <head>
        <title>Claypool Server</title>
    </head>
    <body>
        <div>
            <h1>Claypool Server Status</h1>
            <p>The current time is : {new Date()}</p>
            <div id="globalDetails">
                <h2>Application Global Details</h2>
                <ul>{htmlListItem(window, "Global")}</ul>
            </div>
            <div id="locationDetails">
                <h2>Application Location Details</h2>
                <ul>{htmlListItem(window.location, "Location")}</ul>
            </div>
            <div id="navigatorDetails">
                <h2>Application Navigator Details</h2>
                <ul>{htmlListItem(window.navigator, "Navigator")}</ul>
            </div>
        </div>
    </body>
</html>