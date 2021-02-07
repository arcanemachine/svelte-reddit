<script>
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  const dispatch = createEventDispatcher();

  // data
  export let title = 'reddit';
  export let currentContent;
  let navbarIsActive = false;

  // methods
  const navbarToggle = () => navbarIsActive = !navbarIsActive;
  const titleClicked = () => dispatch('title-clicked');

  const navbarItemClicked = (itemName, showNavbar=undefined) => {
    navbarToggle();
    if (itemName === 'go-to-subreddit') {
      emitSubredditPickerToggle();
      if (showNavbar !== undefined) {
        navbarIsActive = showNavbar;
      }
    }
  }

  // events
  const emitSubredditPickerToggle = () => {
    console.log('emitSubredditPickerToggle()');
    dispatch('subreddit-picker-toggle');
  }
</script>

<nav class="navbar is-fixed-top is-size-5" transition:fade>
  <div class="navbar-brand">
    <div class="ml-2 p-2 navbar-item brand-text has-text-weight-bold"
         on:click="{titleClicked}">
      {#if currentContent === 'post'}
      <span class="navbar-title">&larr; &nbsp;&nbsp;</span>
      {/if }
      <span class="navbar-title">{title}</span>
    </div>
    <div class="navbar-end-touch-icon-container">
      <svg on:click="{() => navbarItemClicked('go-to-subreddit', false)}"
           xmlns="http://www.w3.org/2000/svg"
           width="40" height="40"
           fill="currentColor" viewBox="0 0 16 16"
           class="p-2 bi bi-search cursor-url">
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
      </svg>
    </div>
    <div role="button"
       data-target="navMenu"
       on:click="{navbarToggle}"
       class="navbar-burger"
       class:is-active="{navbarIsActive}"
       aria-label="menu"
       aria-expanded="false">
      <span class="burger-line" aria-hidden="true"></span>
      <span class="burger-line" aria-hidden="true"></span>
      <span class="burger-line" aria-hidden="true"></span>
    </div>
  </div>
  <div id="navMenu" class="navbar-menu" class:is-active="{navbarIsActive}">
    <div class="navbar-end">
      <div class="navbar-item has-text-centered"
           on:click="{() => navbarItemClicked('go-to-subreddit')}">
        Go to subreddit
      </div>
      <div class="navbar-item has-text-centered"
           on:click="{() => navbarItemClicked('settings')}">
        Settings
      </div>
    </div>
  </div>
</nav>

<style>
.navbar {
  height: 4rem;
  max-width: 100vw;
  border-bottom: 2px solid black;
}

.navbar-end-touch-icon-container {
  display: flex;
  margin-right: 0.5rem;
  flex-grow: 1;
  justify-content: flex-end;
  align-items: center;
}

.navbar-burger {
  height: 4rem;
  width: 4rem;
}

.burger-line {
  height: 2px;
}

.navbar-item {
  cursor: pointer;
  font-weight: bold;
}

</style>
