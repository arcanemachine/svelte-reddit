<script>
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';

  const dispatch = createEventDispatcher();

  // data
  let subreddit = '';

  // refs
  let submitButton;

  // methods
  const subredditPickerToggle = () => {
    emitSubredditPickerToggle();
  }
  const subredditPickerClose = () => {
    emitSubredditPickerClose();
  }
  const submitButtonClicked = async () => {
    submitButton.classList.add('is-loading');
    setTimeout(() => {
      dispatch('subreddit-picker-close');
      dispatch('subreddit-pick', ({subreddit}));
    }, 200)
  }
  const subredditPicked = (subredditName) => {
    subreddit = subredditName;
    submitButtonClicked();
  }

  // events
  function emitSubredditPick(event) {
    dispatch('subreddit-pick', event);
  }
  function emitSubredditPickerClose(event) {
    dispatch('subreddit-picker-close', {});
  }
  function emitSubredditPickerToggle(event) {
    dispatch('subreddit-picker-toggle', {});
  }

</script>

<div class="modal is-active" transition:fade>
  <div class="modal-background" on:click="{subredditPickerClose}"></div>
  <div class="modal-content"></div>
  <div class="card">
    <div class="card-content">
      <button class="p-3 delete"
              on:click="{subredditPickerClose}"
              aria-label="close"></button>
      <div class="has-text-centered">
        <h4 class="is-size-5 card-text">Subreddit name:</h4>
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

.delete {
  float: right;
}

.card-text {
  margin-top: 1.5rem;
}
</style>
