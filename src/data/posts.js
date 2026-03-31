// Posts are loaded from content/posts/*.json
// To add a new post, create a new JSON file in that directory.
const postModules = import.meta.glob('../../content/posts/*.json', { eager: true });
const posts = Object.values(postModules).map(m => m.default ?? m);

export default posts;
