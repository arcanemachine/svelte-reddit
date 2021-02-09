<script>
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  import { darkModeActive } from '../stores/';

  // data
  export let title = 'reddit';
  export let currentContent;
  let navbarIsActive = false;

  // methods
  const navbarToggle = () => {navbarIsActive = !navbarIsActive;}
  const navbarItemClicked = (itemName, showNavbar=undefined) => {
    navbarToggle();
    if (itemName === 'go-to-subreddit') {
      emitSubredditPickerToggle();
      navbarIsActive = false;
    }
    if (itemName === 'settings') {
      emitSettingsToggle();
      navbarIsActive = false;
    }
  }

  // events
  const dispatch = createEventDispatcher();
  function titleClicked() {dispatch('title-clicked')}
  function emitSubredditPickerToggle() {dispatch('subreddit-picker-toggle')}
  function emitSettingsToggle() {dispatch('settings-toggle')}


  // dark mode
  const darkModeToggle = () => {  // deleteme
    if (!localStorage.getItem('darkModeActive')) {
      localStorage.setItem('darkModeActive', true);
      darkModeActive.set(true);
    } else {
      localStorage.removeItem('darkModeActive');
      darkModeActive.set(false);
    }
  }

</script>


<nav class="navbar is-fixed-top is-size-5"
     class:is-dark="{$darkModeActive}"
     transition:fade>
  <div class="navbar-brand">
    <div class="ml-2 p-2 navbar-item brand-text has-text-weight-bold">
      <span on:click="{titleClicked}">
        {#if currentContent === 'post'}
        <span class="navbar-title">&larr; &nbsp;&nbsp;</span>
        {/if }
        <span class="navbar-title">{title}</span>
      </span>
      <span class="ml-2 navbar-title" on:click="{darkModeToggle}"><!-- ({$darkModeActive ? 'Dark' : 'Light'}) --></span>
    </div>
    <div class="navbar-end-touch-icon-container is-hidden-desktop">
      <svg on:click="{() => navbarItemClicked('go-to-subreddit', false)}"
           xmlns="http://www.w3.org/2000/svg"
           width="40" height="40"
           fill="currentColor" viewBox="0 0 16 16"
           class="p-2 bi bi-search cursor-url navbar-end-touch-icon">
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
  <div id="navMenu"
       class="navbar-menu"
       class:is-active="{navbarIsActive}"
       class:is-dark="{$darkModeActive}">
    <div class="navbar-end">
      <div class="navbar-item has-text-centered is-hidden-touch"
           class:is-dark="{$darkModeActive}"
           on:click="{() => navbarItemClicked('go-to-subreddit')}">
        Go to subreddit
      </div>
      <div class="navbar-item has-text-centered"
           class:is-dark="{$darkModeActive}"
           on:click="{() => navbarItemClicked('settings')}">
        Settings
      </div>
      <div class="is-hidden-desktop navbar-popup-bottom-border"
           class:is-dark="{$darkModeActive}"></div>
    </div>
  </div>
</nav>

<style>
.navbar {
  height: 4rem;
  max-width: 100vw;
}

.navbar:not(.is-active) {
  border-bottom: 2px solid black;
}

.navbar.is-dark:not(.is-active) {
  border-bottom: 2px solid white;
}

.is-dark {
  background: black;
}

.navbar-end-touch-icon-container {
  display: flex;
  margin-right: 0.5rem;
  flex-grow: 1;
  justify-content: flex-end;
  align-items: center;
}

.navbar-end-touch-icon {
  max-height: 3rem;
  max-width: 3rem;
}

.navbar-burger {
  height: 4rem;
  width: 4rem;
}

.burger-line {
  height: 2px;
}

.navbar-menu {
  margin-top: -2px;
  padding-bottom: 0;
}

.navbar-item {
  cursor: pointer;
  font-weight: bold;
}

.navbar-menu.is-dark, .navbar-item.is-dark {
  background: black;
  color: whitesmoke;
}

.navbar-popup-bottom-border {
  margin-top: 1rem;
  border-bottom: 2px solid black;
}

.navbar-popup-bottom-border.is-dark {
  border-bottom: 2px solid white;
}

</style>
