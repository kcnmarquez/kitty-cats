# Kitty Cats

This project is a simple cat browser bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Routes

- `/` - allows the user to select a cat breed and then displays cats under that breed; supports pagination
- `/:id` - displays info on a specific breed given a cat ID

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
