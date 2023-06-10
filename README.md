# Kitty Cats

This project is a simple cat browser bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

NOTE: See deployed version in https://kcnmarquez.github.io/kitty-cats/.

## Routes

- `/` or `/#/` - allows the user to select a cat breed and then displays cats under that breed; supports pagination
- `/#/?breed=:breed_id` - shows the home page with a pre-selected breed
- `/#/:id` - displays info on a specific breed given a cat ID

## Technologies/libraries used

- react
- typescript
- bootstrap
- sass
- axios

## Set up

Run `npm install` to install the necessary packages.

### API

You need to provide an API key so that the pagination would work properly. To do so, create a `.env` file on the root folder (at the same level as `package.json`, not `src/`). Inside the file, you should have something like this:

```
REACT_APP_API_KEY=<your_api_key>
```

## Development

Run `npm start` to have the app run in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

## Production

Run `npm run build` to generate an optimized production build into the `build` folder.\
You can then run the following to have the app run with the production build:
```
npm install -g serve
serve -s build
```

## Deploy via `gh-pages`

To deploy to github pages, simply do `npm run deploy` after pushing your code.

Make sure that the repository has been configured correctly. To check, go to the **Settings** tab and click on the **Pages** menu. **Source** should be _Deploy from a branch_, and **Branch** should be _gh-pages_ using the _/ (root)_ folder. You should also see a link to the deployed application.
