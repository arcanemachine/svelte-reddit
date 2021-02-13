import { get, writable } from 'svelte/store';

// settings
export const darkModeActive = writable(false);
export const fontSize = writable(16);
export const thumbnailsDisabled = writable(false);
export const voteCountDisabled = writable(false);
export const subredditCurrent = writable(undefined);
export const subredditDefault = writable(undefined);
export const subredditsPrevious = createSubredditsPrevious();
export const subredditsRecent = createSubredditsRecent();
export const subredditsFavorite = createSubredditsFavorite();
export const subredditsMultiLabels = createSubredditsMultiLabels();
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
      let recentsMaxLength = 50;
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
        localStorage.setItem('subredditsRecent', JSON.stringify(get(subredditsRecent)));
      }
    },
    reset: () => {
      set([]);
      localStorage.removeItem('subredditsRecent');
    }
  }
}

function createSubredditsMultiLabels() {
  const { subscribe, set, update } = writable([]);

  const getMe = () => get(subredditsMultiLabels);
  function getSubredditsMultiSubreddits() {
    return get(subredditsMultiLabels).map(x => Object.keys(x)[0]);
  }
  function getSubredditsMultiLabels() {
    return get(subredditsMultiLabels).map(x => Object.values(x)[0]);
  }

  return {
    subscribe,
    set,
    update,
    get: () => get(subredditsMultiLabels),
    getLabel: (multiredditName) => {
      let index = getSubredditsMultiSubreddits().indexOf(multiredditName);
      if (index !== -1) {
        return getSubredditsMultiLabels()[index];
      } else {
        return false;
      }
    },
    add: (multiredditName, label) => {

      // if multiredditName does not represent a multireddit, return false
      if (!multiredditName.match(/\+/)) {
        console.log('Multireddits must contain a plus sign (+) in their name');
        return false;
      }

      // if multireddit does not have a label, create one
      if (!getSubredditsMultiSubreddits().includes(multiredditName)) {
        update(arr => [...arr, {[multiredditName]: label}]);
      }
      // if multireddit has a label, rename it
      else if (getSubredditsMultiSubreddits().includes(multiredditName)) {
        let result = get(subredditsMultiLabels);
        result.splice(get(subredditsMultiLabels).indexOf(multiredditName), 1, {[multiredditName]: label});
        update(arr => result);
      }
      localStorage.setItem('subredditsMultiLabels', JSON.stringify(get(subredditsMultiLabels)));
    },
    remove: (multiredditName) => {
      let result = get(subredditsMultiLabels);
      result.splice(get(subredditsMultiLabels).indexOf(multiredditName), 1);
      set(result); 
      if (!get(subredditsMultiLabels).length) {
        localStorage.removeItem('subredditsMultiLabels');
      }
    },
    reset: () => {
      set([]);
      localStorage.removeItem('subredditsFavorite');
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
      update(arr => [subredditName, ...favorites]);

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
        localStorage.setItem('subredditsFavorite', JSON.stringify(get(subredditsFavorite)));
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
