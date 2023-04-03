interface fetchParameters {
    outDir?: string;
}
/**
 *
 * @param outDir The directory to output the types to. Defaults to "./types"
 * @param includeDBName Should exported interfaces include the database name as prefix? Defaults to false
 */
declare const fetchNewTypes: ({ outDir }?: fetchParameters) => Promise<string>;
export { fetchNewTypes };
