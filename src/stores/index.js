import { get, writable } from 'svelte/store';

// settings
export const darkModeActive = writable(false);
export const fontSize = writable(16);
export const thumbnailsDisabled = writable(false);
export const voteCountDisabled = writable(false);
export const subredditCurrent = writable('all');
export const subredditsPrevious = createSubredditsPrevious();
export const subredditsRecent = createSubredditsRecent();
export const subredditsFavorite = createSubredditsFavorite();
export const subredditsCustom = writable({});

function createSubredditsRecent() {
  const { subscribe, set, update } = writable([]);

  return {
    subscribe,
    set,
    update,
    get: (subredditName) => get(subredditsRecent),
    add: (subredditName) => {
      // use lowercase values when checking to see if the subreddit is already in the recents list
      let subredditNameLower = subredditName.toLowerCase();
      let recents = get(subredditsRecent);
      let recentsLower = recents.map(x => x.toLowerCase());

      // if lowercase subreddit in recents, remove it temporarily
      if (recentsLower.find(x => x === subredditNameLower)) { 
        let index = recents.indexOf(subredditName);
        recents.splice(index, 1);
      }

      // add subredditName to the beginning of the recents list
      update(arr => [subredditName, ...recents]);

      // TODO: increase this amount
      // if recents array longer than 3 items, remove the last items
      let recentsMaxLength = 3;
      if (get(subredditsRecent).length > recentsMaxLength) {
        update(arr => arr.slice(0, recentsMaxLength));
      }

      // update localStorage
      localStorage.setItem('subredditsRecent', JSON.stringify(get(subredditsRecent)));
    },
    remove: (subredditName) => {
      let recents = get(subredditsRecent);
      let index = recents.indexOf(subredditName);
      if (index !== -1) {
        update(arr => {
          recents.splice(index, 1);
          return recents;
        })
        localStorage.setItem('subredditsRecent', JSON.stringify(recents));
      }
    },
    reset: () => {
      set([]);
      localStorage.removeItem('subredditsRecent');
    }
  }
}

function createSubredditsFavorite() {
  const { subscribe, set, update } = writable([]);

  return {
    subscribe,
    set,
    update,
    get: () => get(subredditsFavorite),
    add: (subredditName) => {
      // use lowercase values when checking to see if the subreddit is already in the favorites list
      let favorites = get(subredditsFavorite);
      let favoritesLower = favorites.map(x => x.toLowerCase());
      let subredditNameLower = subredditName.toLowerCase();
      if (favorites.find(x => x === subredditNameLower)) { 
        return false;
      }

      // add subredditName to the favorites list
      update(arr => [...favorites, subredditName]);

      // update localStorage
      localStorage.setItem('subredditsFavorite', JSON.stringify(get(subredditsFavorite)));
    },
    remove: (subredditName) => {
      let favorites = get(subredditsFavorite);
      let index = favorites.indexOf(subredditName);
      if (index !== -1) {
        update(arr => {
          favorites.splice(index, 1);
          return favorites;
        })
        localStorage.setItem('subredditsFavorite', JSON.stringify(favorites));
      }
    },
    reset: () => {
      set([]);
      localStorage.removeItem('subredditsFavorite');
    }
  }
}

function createSubredditsPrevious() {
  const { subscribe, set, update } = writable([]);

  return {
    subscribe,
    set,
    update,
    get: () => get(subredditsPrevious),
    push: (subredditName) => update(arr => [...arr, subredditName]),
    pop: () => update(arr => arr.slice(0, arr.length - 1))
  }
}
