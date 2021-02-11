<script>
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  import { darkModeActive, subredditsFavorite, subredditsRecent } from '../stores/';

  const dispatch = createEventDispatcher();

  // data
  let subreddit = '';
  let subredditsEdit = false;
  let subredditsFavoriteShowCount = 1;
  let subredditsRecentShowCount = 1;
  let subredditsItemDeleteTimeout = undefined

  // refs
  let submitButton;

  // methods
  const subredditPickerToggle = () => emitSubredditPickerToggle();
  const subredditPickerClose = () => emitSubredditPickerClose();
  
  const subredditsEditToggle = () => subredditsEdit = !subredditsEdit;
  const subredditsItemDeleteMessage = () => {
    clearTimeout(subredditsItemDeleteTimeout);
    subredditsItemDeleteTimeout = setTimeout(() => {
      dispatch('status-message-display', "Double click to remove this item.")
    }, 1000)
  }
  const subredditsItemDelete = (subredditName, categoryName) => {
    clearTimeout(subredditsItemDeleteTimeout);
    if (categoryName === 'favorite') {
      subredditsFavorite.remove(subredditName);
    }
    else if (categoryName === 'recent') {
      subredditsRecent.remove(subredditName);
    }
    dispatch('status-message-display', `'/r/${subredditName}' has been removed from your ${categoryName} subreddits.`)
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


  // methods
  const submitButtonClicked = async () => {
    submitButton.classList.add('is-loading');
    setTimeout(() => {
      dispatch('subreddit-picker-close');
      dispatch('subreddit-pick', {subreddit});
    }, 200)
  }

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
    <div class="card-content has-text-centered">

      <div class="mb-3 is-size-3">
        Your Subreddits
      </div>
      
      <div class="subreddit-search">
        <input class="input subreddit-search-input" type="search"
               bind:value="{subreddit}"
               placeholder="Find subreddit by name..."
               on:keyup="{e => e.key === 'Enter' && submitButtonClicked()}"
               autofocus> <!-- svelte-ignore a11y-autofocus -->
        <button class="button is-info subreddit-search-button-submit"
                bind:this="{submitButton}"
                on:click="{submitButtonClicked}">
          Search
        </button>
      </div>

      <div class="mt-5 is-size-4">
        Favorites
      </div>

      {#if $subredditsFavorite.length }
        {#each $subredditsFavorite.slice(0, subredditsFavoriteShowCount) as subredditName}
          <div>
            {#if subredditsEdit }
              <div class="subreddit-action-icon-container">
                <div class="subreddit-item-delete action-icon action-item-trash-can"
                     on:click="{subredditsItemDeleteMessage}"
                     on:dblclick="{subredditsItemDelete(subredditName, 'favorite')}"
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
      {:else}
        <div class="subject-empty-text">none</div>
      {/if}

      <div class="mt-4 is-size-4">Recently Viewed</div>
      <!--div><button on:click="{subredditsRecent.reset}">Reset</button></div-->
      {#if $subredditsRecent.length}
        {#each $subredditsRecent.slice(0, subredditsFavoriteShowCount) as subredditName}
          <div>
            {#if subredditsEdit }
            <div class="subreddit-action-icon-container">
              <div class="subreddit-item-delete action-icon action-item-trash-can"
                   on:click="{subredditsItemDeleteMessage}"
                   on:dblclick="{subredditsItemDelete(subredditName, 'recent')}"
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
      {:else}
        <div class="subject-empty-text">none</div>
      {/if}

      <div class="mt-4 is-size-4">
        Multireddits
      </div>
      {#if false}
      {:else}
        <div class="subject-empty-text">none</div>
      {/if}

      <div class="mt-6 mb-0 ml-2 cursor-url subreddits-action-icon-container"
           on:click="{subredditsEditToggle}">
        <span class="hover-background-gray" style="font-size: 1.1rem;">
          Edit
          <svg class="ml-1 bi bi-pencil action-icon-pencil"
               xmlns="http://www.w3.org/2000/svg"
               width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
          </svg>
        </span>
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

.subreddit-search {
  display: flex;
}

::placeholder {
  color: #444;
}

.subreddit-search-input {
  border-radius: 0.5rem 0 0 0.5rem;
}

.subreddit-search-button-submit {
  border-radius: 0 0.5rem 0.5rem 0;
}

.action-icon {
  cursor: pointer;
  user-select: none;
}

.hover-background-gray:hover {
  background: gray;
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

.subject-empty-text {
  font-style: italic;
  color: #ddd;
}
</style>
