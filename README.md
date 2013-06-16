About TchiRSS

TchiRSS is a tool to easily track changes to rss feeds without having to rely on thirdparty services. It sits on your local or remote PHP Apache server and you can set ito your homepage or something and see little warnings saying "last update: 3 days ago".

It's still in development. Current goals are:

    [ok] SQLite connection to save rss feed links.
    [ok] GUI to add rss link
    [ok] Extracting last release dates from rss xml documents
    [no] Come up with a "mark as read" feature or "last item read because sometimes just "last realese date" is not enough.
    [no] Saving images to disk to load them faster
    [no] Do something about the lowness of feed fetching. I'll probably move all fetching to javascript in the near future and do it only after the DOM is loaded. Plus, I can add sweet reloading animations and such.
