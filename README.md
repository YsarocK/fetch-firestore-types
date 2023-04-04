# Generate Typesript file from your Firestore Databases

![npm](https://img.shields.io/npm/dt/fetch-firestore-types)
![npm](https://img.shields.io/npm/v/fetch-firestore-types)

## Quick usage
```bash
npx fetch-firestore-types
```

## Installation
```bash
# yarn
yarn add fetch-firestore-types

# npm
npm install fetch-firestore-types
```

### Config
Make sure ton add the following values to your ```.env``` :
```FIREBASE_PROJECT_ID```
```FIREBASE_PRIVATE_KEY```
```FIREBASE_CLIENT_EMAIL```

### Usage
```javascript
import { fetchNewTypes } from "fetch-firestore-types/dist/main";

await fetchNewTypes();
```

It creates a file firebase.ts in a /types folder (creates it if doen't exist).