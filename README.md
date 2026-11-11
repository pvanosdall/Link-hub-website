# Peter Vanosdall website

Static site for GitHub + Netlify. No build step.

## Pages
- `/` home (link page)
- `/sell/` sell your home + valuation form
- `/about/` about Peter
- `/contact/` contact form
- `/newsletter/` newsletter signup
- `/admin/` change background photos (code required, hidden from search)

## The one file you edit
`assets/config.js`
- `API_URL`: your Google Apps Script web app URL (see `Code.gs`)
- `QUIZ_URL`: where "Start your home search" goes
- `DEFAULT_BG`: starting background photo per page

## Adding a new background photo
1. Add `name.jpg` (about 2000px wide) and `name-sm.jpg` (about 1100px) to `img/photos/`, and a small `name.jpg` (about 360px) to `img/thumbs/`.
2. Add `"name"` to the `PHOTOS` list in `assets/config.js`.
3. Commit. It appears on the admin page.
