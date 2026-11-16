# Frutiger-Eco-Firefox-theme-v1.0
Frutiger Eco start page for Firefox: a glossy new tab and homepage with water ripples, floating bubbles, custom quick launch links and a settings panel. Includes an optional Firefox top-bar theme.
Features
Look and layout
Frutiger Eco scenery: a sky-to-grass gradient with a glowing sun and rolling hills by default.
Your own wallpaper: change it from Settings with any image on your computer. It's remembered in your browser.
Clock and date: a large clock with the day and date underneath.
Glass search bar: searches Brave Search. You can change the search engine in eco-homepage.html or newtab.html.
Quick launch
Built in: YouTube and Reddit.
Add your own: open Settings, type a website such as github.com, optionally add a name, and press Add. You can have up to 8 extra links.
Remove links: press the red × next to a link in the Settings list.
Real website icons: each new link shows the site's icon on a white glossy orb. If the icon can't load, you get a colored letter orb instead.
Safe links only: only normal web addresses (http and https) are accepted. Duplicates are blocked.
Saved: your links stay after you close and reopen the browser.
Water touch effect
Press anywhere on the page to make a Samsung-style water ripple.
Each press also plays a short water-drop sound. It's generated in the browser, so no audio file is needed.
A speaker button in the bottom-right corner mutes just the sound.
You can turn the whole effect off in Settings. Quick launch links then open straight away.
Floating bubbles
16 glass bubbles rise from the bottom, sway gently, and pop as they reach their height.
They pause when the tab is hidden.
They don't float if your computer is set to reduce motion.
You can turn them off in Settings. When they're off, nothing is drawn, so there's no cost.
Settings panel (gear icon, bottom right)
Water touch effect: on or off.
Floating bubbles: on or off.
Website icons: on or off.
Change the wallpaper: choose an image, or go back to the default.
Add a quick launch: add or remove your own links.

Your choices are saved in the browser.

Firefox top bar (optional)

The file chrome/userChrome.css restyles the Firefox top bar:

A glossy blue-to-grass gradient with soap bubbles in the empty tab area.
A green gel bubble for the active tab, and clear glass tabs for the others.
A glass address bar that glows when you click into it.
Toolbar buttons (sidebar, back, forward, reload, profile, extensions) as glossy orbs.
A green menu orb.
Install
Option 1: Use it as your home page (easiest)
Download eco-homepage.html and save it somewhere permanent, such as your Documents folder. Don't move it later.
Open the file in Firefox. Copy the address from the address bar. It looks like file:///C:/Users/YourName/Documents/eco-homepage.html.
Go to about:preferences#home.
Under Homepage and new windows, choose Custom URLs... and paste the address.
Press the Home button or open a new window.

The whole page is in this one file, so you don't need anything else. Pictures and icons are built in.

Option 2: Install as an extension (replaces the new tab page)
Download the files manifest.json, newtab.html, newtab.css, newtab.js, wallpaper.jpg and gear.png into one folder.
Open about:debugging#/runtime/this-firefox.
Click Load Temporary Add-on... and select manifest.json.
Open a new tab with Ctrl+T.

Temporary add-ons are removed when you close Firefox, so you'll need to load it again. To keep it permanently, use Firefox Developer Edition or Nightly with signing turned off, or sign the add-on through addons.mozilla.org.

Option 3: Firefox top bar (optional)
Open about:config, accept the warning, search for toolkit.legacyUserProfileCustomizations.stylesheets, and set it to true.
Open about:support and click Open Folder next to Profile Folder.
Create a folder named chrome in that folder.
Put userChrome.css inside it.
Restart Firefox.

To undo it, delete userChrome.css and restart Firefox.

Privacy and network use
Website icons: to show a link's icon, the page asks Google's favicon service for it. Google can see the website addresses you add. Turn off Website icons in Settings to stop this. Private addresses such as localhost, 192.168.x.x and .local are never sent.
Everything else stays on your computer: your settings, links, and wallpaper are saved in the browser's own storage. The page doesn't send them anywhere.
Search: the search bar sends your search to Brave Search when you press Enter.
Browser support
Firefox: fully tested with the homepage file and the top-bar theme.
Other Chromium browsers (Brave, Chrome, Edge): the homepage file may work, but it hasn't been tested. The top-bar theme is Firefox-only.
Notes
The wallpaper in this project is the default painted scene. The city-and-grass photo is not included, so you can pick your own image in Settings.
Some features use a few kilobytes of browser storage. Clearing your browser's site data will reset them.
If something looks wrong on your screen, open an issue on this repository and describe your Firefox version and what you see.
