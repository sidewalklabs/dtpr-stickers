## Running Locally

`yarn` (install dependencies)

`yarn start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

## Deploying


First build for production
`yarn build`

Then make sure you have the appropriate GCP permissions and use gcloud command line to deploy
`gcloud config set project dtpr-mvp`
`gcloud app deploy`


The build step bundles React in production mode and optimizes the build for the best performance, and locates it in the `build` folder.
