<script>
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  import { darkModeActive, subredditsRecent } from '../stores/';

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
  const subredditPicked = (subredditName) => {
    subreddit = subredditName;
    setTimeout(() => {
      dispatch('subreddit-picker-close');
      dispatch('subreddit-pick', {subreddit});
    }, 200)
  }

  // events
  function emitSubredditPick(event) {dispatch('subreddit-pick', event)}
  function emitSubredditPickerClose(event) {dispatch('subreddit-picker-close', {})}
  function emitSubredditPickerToggle(event) {dispatch('subreddit-picker-toggle', {})}

</script>

<div class="modal is-active" transition:fade>
  <div class="modal-background" on:click="{subredditPickerClose}"></div>
  <div class="modal-content"></div>
  <div class="card"
       class:is-dark="{$darkModeActive}">
    <!-- close button -->
    <button class="p-3 delete" on:click="{subredditPickerClose}" aria-label="close"></button>
    <div class="card-content">
      <div class="has-text-centered">
        <div class="mb-2 is-size-4">Recently Viewed</div>
        <div><button on:click="{subredditsRecent.reset}">Reset</button></div>
        {#if $subredditsRecent.length }
          {#each $subredditsRecent as subredditName}
          <div class="is-size-5 has-text-link">
              <span class="p-2 cursor-url" on:click="{() => subredditPicked(subredditName)}">
                /r/{subredditName}/
              </span>
            </div>
          {/each}
        {/if}
        <!--div class="subreddit-input">
          <h4 class="mt-5 is-size-4">Subreddit name:</h4>
          <input class="mt-4 input" type="search"
                 bind:value="{subreddit}"
                 on:keyup="{e => e.key === 'Enter' && submitButtonClicked()}">
          <button class="mt-5 button is-info is-large is-fullwidth"
                  bind:this="{submitButton}"
                  on:click="{submitButtonClicked}">
            Search
          </button>
        </div-->
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
  border-radius: 0.5rem;
}

.card.is-dark {
  background: black;
  color: whitesmoke;
  border: 1px solid whitesmoke;
}

.delete {
  position: absolute;
  margin-top: 1rem;
  margin-left: calc(100% - 2.5rem);
}

.delete:hover {
  background: gray;
}
</style>
