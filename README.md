# Bwog Scraper

Scrapes comments from bwog [http://bwog.com](http://bwog.com).

Collects

- Comment text body
- Like count
- Dislike count

and saves them into a `.csv` file

## Quick Start

Requires:

- `node.js`
- `npm`

To install dependencies,

```bash
$ npm install
```

in the root directory.

Then, hit

```bash
$ node app.js
```

to run the app. The app will scrape the blog page by page (to avoid
overaggressive abuse of the server). 
