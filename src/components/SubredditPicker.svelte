<script>
  import { createEventDispatcher, onMount, tick } from 'svelte';
  import { fade, scale } from 'svelte/transition';
  import { darkModeActive, subredditsFavorite, subredditsMultiLabels, subredditsRecent } from '../stores/';

  const dispatch = createEventDispatcher();

  // data
  let subreddit = '';
  let subredditsEdit = false;
  let subredditsItemDeleteTimeout = undefined;

  let subredditsShowCountDefault = 3;
  let subredditsFavoriteShowCount = subredditsShowCountDefault;
  let subredditsRecentShowCount = subredditsShowCountDefault;
  let subredditsMultiShowCount = subredditsShowCountDefault;

  // declarations
  // $: localSubredditsFavorite = $subredditsFavorite;
  let localSubredditsFavorite = [];
  let localSubredditsRecent = [];
  let localSubredditsMulti = [];

  // refs
  let submitButton;

  // methods
  const getSubredditsFavorite = () => {
    let result = [];
    let subredditsFavoriteAll = $subredditsFavorite;
    // let subredditsFavoriteAll = ['this', 'andThis', 'not+this'];
    for (let i = 0; i < subredditsFavoriteAll.length; i++) {
      if (!subredditsFavoriteAll[i].match(/\+/)) {
        result.push(subredditsFavoriteAll[i]);
      }
    }
    return result;
  }
  const getSubredditsMulti = () => {
    let result = [];
    let subredditsFavoriteAll = $subredditsFavorite;
    // let subredditsFavoriteAll = ['this', 'andThis', 'not+this'];
    for (let i = 0; i < subredditsFavoriteAll.length; i++) {
      if (subredditsFavoriteAll[i].match(/\+/)) {
        result.push(subredditsFavoriteAll[i]);
      }
    }
    return result;
  }
  const getSubredditsRecent = () => $subredditsRecent;
 
  const subredditsFavoriteShowMore = () => subredditsFavoriteShowCount += subredditsShowCountDefault;
  const subredditsFavoriteShowLess = () => subredditsFavoriteShowCount -= subredditsShowCountDefault;
  const subredditsMultiShowMore = () => subredditsMultiShowCount += subredditsShowCountDefault;
  const subredditsMultiShowLess = () => subredditsMultiShowCount -= subredditsShowCountDefault;
  const subredditsRecentShowMore = () => subredditsRecentShowCount += subredditsShowCountDefault;
  const subredditsRecentShowLess = () => subredditsRecentShowCount -= subredditsShowCountDefault;

  const subredditsMultiLabelUpdate = (multiredditName) => {
    let label = prompt(`Enter a label for this multireddit.\n\nA blank entry will clear the label.\n\nSubreddits in this multireddit:\n\n${multiredditName.split('+').join('\n')}\n `, $subredditsMultiLabels[$subredditsMultiLabels.indexOf(multiredditName)] ? $subredditsMultiLabels.indexOf(multiredditName) : '');
    if (label) {
      subredditsMultiLabels.add(multiredditName, label);
    } else {
      subredditsMultiLabels.remove(multiredditName);
    }
    localSubredditsMulti = getSubredditsMulti();
  }

  const subredditsEditToggle = () => subredditsEdit = !subredditsEdit;
  const subredditsItemDeleteMessage = () => {
    clearTimeout(subredditsItemDeleteTimeout);
    subredditsItemDeleteTimeout = setTimeout(() => {
      dispatch('status-message-display', "Double click to remove this item.")
    }, 1000)
  }
  const subredditsItemDelete = (subredditName, categoryName) => {
    let categoryDescription;
    clearTimeout(subredditsItemDeleteTimeout);
    if (categoryName === 'favorite') {
      subredditsFavorite.remove(subredditName);
      localSubredditsFavorite = getSubredditsFavorite();
      categoryDescription = 'favorite subreddits';
    }
    else if (categoryName === 'recent') {
      subredditsRecent.remove(subredditName);
      localSubredditsRecent = getSubredditsRecent();
      categoryDescription = 'recent subreddits';
    }
    else if (categoryName === 'multireddit') {
      subredditsFavorite.remove(subredditName);
      localSubredditsMulti = getSubredditsMulti();
      categoryDescription = 'multireddits';
    }
    dispatch('status-message-display', `'/r/${subredditName}' has been removed from your ${categoryDescription}.`)
  }

  const subredditPickerToggle = () => emitSubredditPickerToggle();
  const subredditPickerClose = () => emitSubredditPickerClose();

  const subredditPicked = (subredditName) => {
    subreddit = subredditName;
    setTimeout(() => {
      dispatch('subreddit-picker-close');
      dispatch('subreddit-pick', {subreddit});
    }, 200)
  }

  const submitButtonClicked = async () => {
    submitButton.classList.add('is-loading');
    setTimeout(() => {
      dispatch('subreddit-picker-close');
      dispatch('subreddit-pick', {subreddit});
    }, 200)
  }

  // events
  function emitSubredditPick(event) {dispatch('subreddit-pick', event)}
  function emitSubredditPickerClose(event) {dispatch('subreddit-picker-close')}
  function emitSubredditPickerToggle(event) {dispatch('subreddit-picker-toggle')}

  onMount(async () => {
    await tick();
    localSubredditsFavorite = getSubredditsFavorite();
    localSubredditsRecent = getSubredditsRecent();
    localSubredditsMulti = getSubredditsMulti();
  })

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

      <div class="mb-4 is-size-3 card-title-text">
        Your Subreddits
      </div>
      
      <div class="subreddit-search">
        <input class="input subreddit-search-input" type="search"
               bind:value="{subreddit}"
               placeholder="Go to subreddit by name..."
               on:keyup="{e => e.key === 'Enter' && submitButtonClicked()}">
        <button class="button is-info subreddit-search-button-submit"
                bind:this="{submitButton}"
                on:click="{submitButtonClicked}">
          Go
        </button>
      </div>

      <div class="mt-4 mb-1 is-size-4">
        Favorite Subreddits
      </div>

      {#if localSubredditsFavorite.length}
        {#each localSubredditsFavorite.slice(0, subredditsFavoriteShowCount) as subredditName}
          <div class="mx-1" transition:fade>
            {#if subredditsEdit}
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
              <div class="has-text-link subreddit-item-name subreddit-list-item">
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
      <!--
      {#if localSubredditsFavorite.length}
         <button class="mt-2 button is-small subreddits-button-more"
                 class:is-info="{localSubredditsFavorite.length - subredditsFavoriteShowCount > subredditsFavoriteShowCount}"
                 class:is-disabled="{localSubredditsFavorite.length - subredditsFavoriteShowCount <= 0}"
                on:click="{subredditsFavoriteShowLess}">
          Show less
        </button>
      {/if}
      -->
      {#if subredditsFavoriteShowCount < localSubredditsFavorite.length}
        <button class="mt-2 button is-small is-info subreddits-button-more"
                on:click="{subredditsFavoriteShowMore}">
          Show more
        </button>
      {/if}

      <div class="mt-5 is-size-4">
        Favorite Multireddits
        <svg class="ml-1 bi bi-question-circle cursor-url"
             on:click="{() => dispatch('status-message-display', `A multireddit is created by entering multiple subreddit names separated by a plus sign, e.g. cats+dogs`)}"
             xmlns="http://www.w3.org/2000/svg"
             width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
          <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
        </svg>
      </div>
      {#if localSubredditsMulti.length}
        {#each localSubredditsMulti.slice(0, subredditsRecentShowCount) as multiredditName}
          <div class="mx-1" transition:fade>
            {#if subredditsEdit}
              <div class="subreddit-action-icon-container multireddit-action-icon-container">
                <div class="subreddit-item-delete action-icon action-item-trash-can"
                     on:click="{subredditsItemDeleteMessage}"
                     on:dblclick="{subredditsItemDelete(multiredditName, 'multireddit')}"
                     transition:fade>
                  &#x1f5d1;
                </div>
                <svg class="mr-1 bi bi-pencil action-icon-pencil cursor-url"
                     xmlns="http://www.w3.org/2000/svg"
                     width="16" height="16" fill="currentColor" viewBox="0 0 16 16"
                     on:click="{subredditsMultiLabelUpdate(multiredditName)}"
                     transition:fade>
                  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                </svg>
              </div>
            {/if}
            <div class="subreddit-item-name-container is-size-5">
              <div class="has-text-link subreddit-item-name subreddit-list-item">
                <span class="p-2 cursor-url" on:click="{() => subredditPicked(multiredditName)}">
                  {#if subredditsMultiLabels.getLabel(multiredditName)}
                    /m/{subredditsMultiLabels.getLabel(multiredditName)}/
                  {:else}
                    /m/{multiredditName}/
                  {/if}
                </span>
              </div>
            </div>
          </div>
        {/each}
      {:else}
        <div class="subject-empty-text">none</div>
      {/if}
      {#if subredditsMultiShowCount < localSubredditsMulti.length}
        <button class="mt-2 button is-small is-info subreddits-button-more"
                on:click="{subredditsMultiShowMore}">
          Show more
        </button>
      {/if}

      <div class="mt-5 mb-1 is-size-4">Recently Viewed</div>
      <!--div><button on:click="{subredditsRecent.reset}">Reset</button></div-->
      {#if localSubredditsRecent.length}
        {#each localSubredditsRecent.slice(0, subredditsRecentShowCount) as subredditName}
          <div class="mx-1" transition:fade>
            {#if subredditsEdit}
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
              <div class="has-text-link subreddit-item-name subreddit-list-item">
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
      {#if subredditsRecentShowCount < localSubredditsRecent.length}
        <button class="mt-2 button is-small is-info subreddits-button-more"
                on:click="{subredditsRecentShowMore}">
          Show more
        </button>
      {/if}


      <div class="mt-6 subreddits-edit-button-container">
        <button class="button is-warning subreddits-edit-button"
              class:is-active="{subredditsEditToggle}"
              on:click="{subredditsEditToggle}">
          Edit Subreddits
          <svg class="ml-2 bi bi-pencil action-icon-pencil"
               xmlns="http://www.w3.org/2000/svg"
               width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
          </svg>
        </button>
      </div>

    </div>
  </div>
</div>

<style>
.card {
  max-height: 95vh;
  min-width: 25rem;
  max-width: 95vw;
  margin: 2rem;
  overflow-y: auto;
  border-radius: 0.5rem;
}

.card.is-dark {
  background: black;
  color: whitesmoke;
  border: 1px solid whitesmoke;
}

.subreddit-list-item {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-title-text {
  margin-top: -0.5rem;
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

.action-icon:hover {
  background: gray;
  border-radius: 50%;
}

.action-icon-close-button {
  position: absolute;
  padding: 1rem;
  margin-top: 1.25rem;
  margin-left: calc(100% - 3rem);
}

.subreddit-action-icon-container {
  display: flex;
  flex-direction: row-reverse;
  position: absolute;
  height: 2rem;
  margin-left: calc(100% - 5rem);
  justify-content: flex-end;
  align-items: center;
}

.multireddit-action-icon-container {
  margin-left: calc(100% - 6.25rem);
}

.action-item-trash-can {
  padding: 0.5rem 0.75rem;
  margin-right: 0.7rem;
}

/*

.hover-background-gray:hover {
  background: gray;
}

.subreddit-item-container {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
}
*/

.subreddit-item-name-container {
}

.subreddit-item-name {
  height: 2rem;
  max-width: 75%;
  margin-left: auto;
  margin-right: auto;
}

.subject-empty-text {
  font-style: italic;
  color: #aaa;
  transition-delay: 0.5s;
}
</style>
