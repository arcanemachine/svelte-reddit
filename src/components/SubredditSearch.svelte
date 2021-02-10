<script>
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  import { darkModeActive } from '../stores/';

  const dispatch = createEventDispatcher();

  // data
  let subreddit = '';

  // refs
  let submitButton;

  // methods
  const subredditSearchToggle = () => {
    emitSubredditSearchToggle();
  }
  const subredditSearchClose = () => {
    emitSubredditSearchClose();
  }
  const submitButtonClicked = async () => {
    submitButton.classList.add('is-loading');
    setTimeout(() => {
      dispatch('subreddit-search-close');
      dispatch('subreddit-pick', {subreddit});
    }, 200)
  }
  const subredditPicked = (subredditName) => {
    subreddit = subredditName;
    submitButtonClicked();
  }

  // events
  function emitSubredditPick(event) {dispatch('subreddit-pick', event)}
  function emitSubredditSearchClose(event) {dispatch('subreddit-search-close')}
  function emitSubredditSearchToggle(event) {dispatch('subreddit-search-toggle')}

</script>

<div class="modal is-active" transition:fade>
  <div class="modal-background" on:click="{subredditSearchClose}"></div>
  <div class="modal-content"></div>
  <div class="card"
       class:is-dark="{$darkModeActive}">
    <div class="card-content">
      <button class="p-3 delete"
              on:click="{subredditSearchClose}"
              aria-label="close"></button>
      <div class="has-text-centered">
        <h4 class="mt-5 is-size-4">Subreddit name:</h4>
        <input class="mt-4 input" type="search"
               bind:value="{subreddit}"
               on:keyup="{e => e.key === 'Enter' && submitButtonClicked()}">
        <button class="mt-5 button is-info is-large is-fullwidth"
                bind:this="{submitButton}"
                on:click="{submitButtonClicked}">
          Search
        </button>
      </div>
      <div class="mt-5 has-text-centered">
        <div class="is-size-4">Popular Subreddits</div>
        <div class="mt-4 is-size-5 has-text-link cursor-url"
             on:click="{() => subredditPicked('Pine64Official')}">
          /r/PINE64Official/
        </div>
        <div class="is-size-5 has-text-link cursor-url"
             on:click="{() => subredditPicked('AskReddit')}">
          /r/AskReddit/
        </div>
        <div class="is-size-5 has-text-link cursor-url"
             on:click="{() => subredditPicked('Android')}">
          /r/Android/
        </div>
      </div>
      <div class="mt-5 has-text-centered">
        <div class="is-size-4">Recently Viewed</div>
        <div class="is-size-4">Saved Subreddits</div>
        <div class="is-size-4">Multireddits</div>
      </div>
    </div>
  </div>
</div>

<style>
.card {
  max-height: 80vh;
  width: 20rem;
  margin: 2rem;
  overflow-y: auto;
}

.card.is-dark {
  background: black;
  color: whitesmoke;
  border: 1px solid whitesmoke;
}

.delete {
  float: right;
}
</style>
