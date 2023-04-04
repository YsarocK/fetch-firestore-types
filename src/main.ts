import { create, emit, DeclarationFlags, type, PrimitiveType, ArrayTypeReference } from 'dts-dom';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import findType from './utils/findType.js';
import { databasesClient } from './utils/firebase.js';

interface fetchParameters { outDir?: string }

/**
 * 
 * @param outDir The directory to output the types to. Defaults to "./types"
 * @param includeDBName Should exported interfaces include the database name as prefix? Defaults to false
 */
const fetchNewTypes = async ({ outDir = './types' }: fetchParameters = {}) => {
  // Create folder if non-existent
  if (!existsSync(outDir)) {
    mkdirSync(outDir);
  }

  // Empty the file
  const writeStream = createWriteStream(`${outDir}/firestore.ts`);
  writeStream.write("");

  // Iterate over all databases & collections
  const collections = await databasesClient.listCollections();

  for (const col of collections) {
    const { id: collectionName } = col;

    console.log(`Fetching types for collection ${collectionName}...`); // eslint-disable-line no-console

    // Create interface
    const intf = create.interface(collectionName, DeclarationFlags.Export);

    const result = new Map();

    const { docs: documents } = await databasesClient.collection(collectionName).limit(25).get();

    for (const doc of documents) {
      const docData = doc.data();

      for (const key in docData) {
        const value = docData[key];
        let t: PrimitiveType | ArrayTypeReference | Map<string, any> = findType(value);

        // handle 2nd level tree
        if (t === type.object) {

          t = new Map();

          for (const keyC in value) {
            const vC = value[keyC];

            const tC = findType(vC);

            if (!t.has(keyC)) {
              t.set(keyC, [tC]);
            } else {
              const r = t.get(keyC);

              if (!JSON.stringify(r).includes(JSON.stringify(tC))) {
                t.set(keyC, r.concat([tC]));
              }
            }
          }
        }

        if (!result.has(key)) {
          result.set(key, [t]);
        } else {
          const r = result.get(key);

          if (!JSON.stringify(r).includes(JSON.stringify(t))) {
            result.set(key, r.concat([t]));
          }
        }
      }
    }

    result.forEach((value, key) => {
      // Push attribute to interface
      if (value.length === 1) {
        let t = undefined;
        if (value[0].kind) {
          t = type.array(type[value[0].type]);
        } else if (value[0] instanceof Map) {
          const members = [];
          value[0].forEach((v, k) => {
            members.push({ name: k, kind: 'property', type: type[v] });
          });
          t = create.objectType(members);
        } else {
          t = type[value[0]];
        }
        intf.members.push(create.property(key, t));
      } else {
        const unionArray = value.map(v => {
          if (v.kind) {
            return type.array(type[v.type]);
          }
          return type[v];
        });
        intf.members.push(create.property(key, create.union(unionArray)));
      }
    });

    // Write interface to file
    const writeStream = createWriteStream(`${outDir}/firestore.ts`, { flags: 'a' });
    writeStream.write(emit(intf));
  }

  return 'file generated successfully';
};

await fetchNewTypes();

export { fetchNewTypes };