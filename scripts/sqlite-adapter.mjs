// Local development and tests only. Hosted requests use the managed D1 binding.
export function sqliteAdapter(getDatabase) {
 return { prepare(sql) {
  return { bind(...args) {
   return {
    async all() { return { results: getDatabase().prepare(sql).all(...args) }; },
    async first() { return getDatabase().prepare(sql).get(...args) || null; },
    async run() { return { meta: { changes: Number(getDatabase().prepare(sql).run(...args).changes) } }; }
   };
  }};
 }};
}
