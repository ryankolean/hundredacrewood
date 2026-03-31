import posts from '../data/posts.js';

function sortBy(arr, field) {
  if (!field) return arr;
  const desc = field.startsWith('-');
  const key = desc ? field.slice(1) : field;
  return [...arr].sort((a, b) => {
    if (a[key] < b[key]) return desc ? 1 : -1;
    if (a[key] > b[key]) return desc ? -1 : 1;
    return 0;
  });
}

export const BlogPost = {
  filter: async (criteria = {}, sort = null) => {
    let result = posts.filter(post =>
      Object.entries(criteria).every(([k, v]) => post[k] === v)
    );
    return sort ? sortBy(result, sort) : result;
  },
  create: async () => { console.warn('BlogPost.create: not supported in static mode'); },
  update: async () => { console.warn('BlogPost.update: not supported in static mode'); },
  delete: async () => { console.warn('BlogPost.delete: not supported in static mode'); },
};

export const User = {
  me: async () => { throw new Error('Auth not available in static mode'); },
  loginWithRedirect: async () => {},
  logout: async () => {},
};
