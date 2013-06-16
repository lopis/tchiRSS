### About TchiRSS

http://lopis.github.io/tchiRSS/

TchiRSS is a tool to easily track changes to RSS feeds without having to rely on third-party services. It sits on your local or remote PHP Apache server and you can set to your homepage or something and see little warnings saying "last update: 3 days ago". 

It's still in development. Current goals are:
* **[ok]** SQLite connection to save RSS feed links;
* **[ok]** GUI to add RSS link;
* **[ok]** Extracting last release dates from RSS XML documents;
* **[no]** Come up with a "mark as read" feature or "last item read because sometimes just "last release date" is not enough;
* **[no]** Saving images to disk to load them faster;
* **[no]** Do something about the slowness of feed fetching. I'll probably move all fetching to JavaScript in the near future and do it only after the DOM is loaded. Plus, I can add sweet reloading animations and such;
* **[no]** Add themes;
* **[no]** Add refresh button (after moving to javascript)
* **[no]** Simplify app setup