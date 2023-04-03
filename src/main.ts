import { create, emit, DeclarationFlags } from 'dts-dom';
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
  const writeStream = createWriteStream(`${outDir}/firebase.ts`);
  writeStream.write("");

  // Iterate over all databases & collections
  const collections = await databasesClient.listCollections();

  for (const col of collections) {
    const { id: collectionName } = col;

    console.log(`Fetching types for collection ${collectionName}...`); // eslint-disable-line no-console

    // Create interface
    const intf = create.interface(collectionName, DeclarationFlags.Export);

    const result = new Map();

    const documents = await col.listDocuments();

    for (const doc of documents) {
      const docData = (await doc.get()).data()

      for (const key in docData) {
        const value = docData[key];
        result.set(key, value);
      }
    }

    result.forEach((value, key) => {
      // Push attribute to interface
      intf.members.push(create.property(key, findType(value)));
    });

    // Write interface to file
    const writeStream = createWriteStream(`${outDir}/firebase.ts`, { flags: 'a' });
    writeStream.write(emit(intf));
  }

  return 'file generated successfully';
};

await fetchNewTypes();

export { fetchNewTypes };