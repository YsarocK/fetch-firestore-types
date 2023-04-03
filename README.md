# Generate Typesript file from your Firebase Databases

![npm](https://img.shields.io/npm/dt/fetch-firebase-types)
![npm](https://img.shields.io/npm/v/fetch-firebase-types)

## Quick usage
```bash
npx fetch-firebase-types
```

## Installation
```bash
# yarn
yarn add fetch-firebase-types

# npm
npm install fetch-firebase-types
```

### Config
Make sure ton add the following values to your ```.env``` :
```FIREBASE_PROJECT_ID```
```FIREBASE_PRIVATE_KEY```
```FIREBASE_CLIENT_EMAIL```

### Usage
```javascript
import { fetchNewTypes } from "fetch-firebase-types/dist/main";

await fetchNewTypes();
```

It creates a file firebase.ts in a /types folder (creates it if doen't exist).