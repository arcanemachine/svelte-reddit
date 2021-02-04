<script>
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';

  // data
  let submitButton;
  let subreddit = '';

  // events
  const dispatch = createEventDispatcher();
  function subredditPickerClosed() {
    console.log('emitSubredditPickerToggle()');
    dispatch('subreddit-picker-toggle');
  }
  async function submitButtonClicked() {
    console.log('emitSubredditPick()');
    submitButton.classList.add('is-loading');
    setTimeout(() => {
      dispatch('subreddit-picker-toggle');
      dispatch('subreddit-pick', ({subreddit}));
    }, 300)
  }
</script>

<div class="modal is-active" transition:fade>
  <div class="modal-background"></div>
  <div class="modal-content"></div>
    <div class="card">
      <div class="card-content">
        <button class="delete"
                on:click="{subredditPickerClosed}"
                aria-label="close"></button>
        <div class="has-text-centered">
          <h4 class="is-size-5 card-text">Subreddit name:</h4>
          <input class="mt-4 input" type="search"
                 bind:value="{subreddit}"
                 on:keyup="{e => e.key === 'Enter' && submitButtonClicked()}">
          <button class="mt-4 button is-info is-large is-fullwidth"
                  bind:this="{submitButton}"
                  on:click="{submitButtonClicked}">
            Search
          </button>
        </div>
      </div>
      <div>
        <p class="mb-2">Debug:</p>
        <p>subreddit: {subreddit}</p>
      </div>
    </div>
</div>

<style>
.card {
  margin: 2rem;
  width: 20rem;
}

.delete {
  float: right;
}

.card-text {
  margin-top: 1.5rem;
}
</style>
