### About TchiRSS

http://lopis.github.io/tchiRSS/

TchiRSS is a web app I create to easily track changes to my RSS feeds without having to rely on other services. It sits on your local or remote PHP Apache server and you can set it as your homepage and, for instance, check when was the last time your manga series released a new chapter.

Tchi is still under development.
v.1.0
* [X] SQLite connection to save RSS feed links;
* [X] GUI to add RSS link;
* [X] Reading last release dates from RSS XML documents;
Planned:
* [ ] Come up with a "mark as read" feature or "last item read because sometimes just "last release date" is not enough;
* [ ] Saving images to disk to load them faster;
* [ ] Do something about the slowness of feed fetching. I'll probably move all fetching to JavaScript in the near future and do it only after the DOM is loaded. Plus, I can add sweet reloading animations and such;
* [ ] Add themes;
* [ ] Add refresh button (after moving to javascript)
* [ ] Simplify app setup
* [ ] Add icon to acess RSS page and change title link to Manga page
* [ ] Allow multiple feeds for each manga title
* [ ] Add delete/edit/add-feed button (after moving to javascript)
* [ ] Exporting RSS feed list (for sharing, backup, etc)
