<script>
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  import { darkModeActive, subredditsRecent } from '../stores/';

  const dispatch = createEventDispatcher();

  // data
  let subreddit = '';
  let subredditsRecentEdit = true;
  let subredditsRecentItemDeleteTimeout = undefined

  // refs
  let submitButton;

  // methods
  const subredditPickerToggle = () => emitSubredditPickerToggle();
  const subredditPickerClose = () => emitSubredditPickerClose();
  
  const subredditsRecentEditToggle = () => subredditsRecentEdit = !subredditsRecentEdit;
  const subredditsRecentItemDeleteMessage = () => {
    clearTimeout(subredditsRecentItemDeleteTimeout);
    subredditsRecentItemDeleteTimeout = setTimeout(() => {
      dispatch('status-message-display', "Double click to remove this item.")
    }, 1000)
  }
  const subredditsRecentItemDelete = (subredditName) => {
    clearTimeout(subredditsRecentItemDeleteTimeout);
    subredditsRecent.remove(subredditName);
    dispatch('status-message-display', `'/r/${subredditName}' has been removed from your recent subreddits.`)
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
  function emitSubredditPickerClose(event) {dispatch('subreddit-picker-close')}
  function emitSubredditPickerToggle(event) {dispatch('subreddit-picker-toggle')}

</script>

<div class="modal is-active" transition:fade>
  <div class="modal-background" on:click="{subredditPickerClose}"></div>
  <div class="modal-content"></div>
  <div class="card"
       class:is-dark="{$darkModeActive}">
    <!-- close button -->
    <button class="delete action-icon action-icon-close-button"
            on:click="{subredditPickerClose}" aria-label="close">
    </button>
    <div class="card-content">
      <div class="has-text-centered">
        <div class="mb-5 is-size-3">Your Subreddits</div>
        <!--{#if subredditsRecentEdit}
          <div class="subreddits-action-icon-container">
            <svg class="ml-3 bi bi-pencil action-icon action-icon-pencil"
                 on:click="{subredditsRecentEditToggle}"
                 xmlns="http://www.w3.org/2000/svg"
                 width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
            </svg>
          </div>
        {/if}-->

        <div class="is-size-4">Favorites</div>
        {#if $subredditsRecent.length }
          {#each $subredditsRecent as subredditName}
            <div>
              {#if subredditsRecentEdit }
              <div class="subreddit-action-icon-container">
                <div class="subreddit-item-delete action-icon action-item-trash-can"
                     on:click="{subredditsRecentItemDeleteMessage}"
                     on:dblclick="{subredditsRecentItemDelete(subredditName)}"
                     transition:fade>
                  &#x1f5d1;
                </div>
              </div>
              {/if}
              <div class="subreddit-item-name-container is-size-5">
                <div class="has-text-link subreddit-item-name">
                  <span class="p-2 cursor-url" on:click="{() => subredditPicked(subredditName)}">
                    /r/{subredditName}/
                  </span>
                </div>
              </div>
            </div>
          {/each}
        {/if}

        <div class="mt-4 is-size-4">Recently Viewed</div>
        <!--div><button on:click="{subredditsRecent.reset}">Reset</button></div-->
        {#if $subredditsRecent.length }
          {#each $subredditsRecent as subredditName}
            <div>
              {#if subredditsRecentEdit }
              <div class="subreddit-action-icon-container">
                <div class="subreddit-item-delete action-icon action-item-trash-can"
                     on:click="{subredditsRecentItemDeleteMessage}"
                     on:dblclick="{subredditsRecentItemDelete(subredditName)}"
                     transition:fade>
                  &#x1f5d1;
                </div>
              </div>
              {/if}
              <div class="subreddit-item-name-container is-size-5">
                <div class="has-text-link subreddit-item-name">
                  <span class="p-2 cursor-url" on:click="{() => subredditPicked(subredditName)}">
                    /r/{subredditName}/
                  </span>
                </div>
              </div>
            </div>
          {/each}
        {/if}

        <!--div class="subreddit-search">
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
        <!--div class="is-size-4">Popular Subreddits</div>
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
        </div-->
        <div class="is-size-4">Multireddits</div>
      </div>
    </div>
  </div>
</div>

<style>
.card {
  max-height: 80vh;
  min-width: 25rem;
  margin: 2rem;
  overflow-y: auto;
  border-radius: 0.5rem;
}

.card.is-dark {
  background: black;
  color: whitesmoke;
  border: 1px solid whitesmoke;
}

.action-icon {
  cursor: pointer;
  user-select: none;
}

.action-icon:hover {
  background: gray;
  border-radius: 50%;
}

.action-icon-pencil {
}

.action-icon-close-button {
  position: absolute;
  padding: 1rem;
  margin-top: 1.25rem;
  margin-left: calc(100% - 3rem);
}

.subreddit-action-icon-container {
  display: flex;
  position: absolute;
  height: 2rem;
  margin-left: calc(100% - 4.75rem);
  justify-content: flex-end;
  align-items: center;
}

.action-item-trash-can {
  padding: 0.5rem 0.75rem;
  margin-right: 0.7rem;
}

.subreddit-item-container {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
}

.subreddit-item-name {
  height: 2rem;
  margin-left: auto;
}
</style>
