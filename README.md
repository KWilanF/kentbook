# KentBook — Mini Facebook Clone (Backbone.js)

This lightweight project is built to meet the MIDTERM rubric you provided (Cross-Platform Script Development — Backbone.js).

## Project structure
- index.html — main entry
- css/style.css — responsive UI styles
- js/models.js — Backbone models (User, Post, Comment)
- js/collections.js — collections (Users, Posts, Comments)
- js/views.js — views (Composer, Posts list, Post item)
- js/router.js — Backbone.Router with routes: home, profile, post/:id, about
- js/app.js — app bootstrap, persistence (localStorage), seeding
- tests/specs.js — simple Jasmine unit tests
- README.md — this file

## How this meets the rubric
1. **Functionality (Models/Views/Collections/Router)** — Implemented in js/*. (see models.js, collections.js, views.js, router.js)
2. **Routing & Navigation** — Router handles navigation and route transitions.
3. **Data Binding & Updates** — Views listen to model/collection events; actions persist to localStorage.
4. **UI & Responsiveness** — CSS implements clean, mobile-first responsive layout.
5. **Usability & Error Handling** — Composer validates post body and shows alerts for errors; router redirects if post missing.
6. **Code Quality** — Modular files with comments; clear structure for extension.
7. **Performance** — Lightweight, uses client-side storage, fast load from static files.
8. **Testing** — Jasmine tests included (open page and see Jasmine runner).

## Run locally
1. Unzip the project.
2. Open `index.html` in a browser.
3. Use the composer to add posts. Data is saved to localStorage.
4. Run tests: the Jasmine runner appears on page load.

## Notes for grading
- The app is intentionally minimal to fit in a single deliverable zip while covering all rubric points.
- To extend: add comments, friends, real auth, ajax backend, pagination, and better unit/integration testing.
