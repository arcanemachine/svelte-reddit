import { get, writable } from 'svelte/store';

// settings
export const darkModeActive = writable(false);
export const fontSize = writable(16);
export const thumbnailsDisabled = writable(false);
export const voteCountDisabled = writable(false);
export const subredditsFavorite = writable([]);
export const subredditsRecent = createSubredditsRecent();
export const subredditsCustom = writable({});


// recent subreddits
function createSubredditsRecent() {
  const { subscribe, set, update } = writable([]);

  return {
    subscribe,
    set,
    update,
    add: (subredditName) => {
      // use lowercase values when checking to see if the subreddit is already in the recents list
      let subredditNameLower = subredditName.toLowerCase();
      let recents = get(subredditsRecent);
      let recentsLower = recents.map(x => x.toLowerCase());

      // if lowercase subreddit in recents, pop it
      if (recentsLower.find(x => x === subredditNameLower)) { 
        recents.pop(recentsLower.indexOf(subredditNameLower));
      }

      // add subredditName to the beginning of the recents list
      update(arr => [subredditName, ...recents]);

      // TODO: increase this amount
      // if recents array longer than 3 items, pop the last item
      if (get(subredditsRecent).length > 3) {
        update(arr => arr.slice(-3));
      }

      // update localStorage
      localStorage.setItem('subredditsRecent', JSON.stringify(get(subredditsRecent)));
    },
  reset: () => {
    set([]);
    localStorage.removeItem('subredditsRecent');
    }
  }
}
