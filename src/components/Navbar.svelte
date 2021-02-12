<script>
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  import { darkModeActive, subredditCurrent, subredditsFavorite, subredditsPrevious } from '../stores/';

  // data
  export let title = 'reddit';
  export let currentContent;
  let subredditsFavoriteRemoveTimeout = undefined;
  let navbarIsActive = false;

  // methods
  const navbarToggle = () => {navbarIsActive = !navbarIsActive;}
  const navbarItemClicked = (itemName, showNavbar=undefined) => {
    navbarToggle();
    if (itemName === 'subreddit-picker') {
      emitSubredditPickerToggle();
      navbarIsActive = false;
    }
    if (itemName === 'subreddit-search') {
      emitSubredditSearchToggle();
      navbarIsActive = false;
    }
    if (itemName === 'settings') {
      emitSettingsToggle();
      navbarIsActive = false;
    }
  }
  const subredditsFavoriteAdd = (subredditName) => {
    try {
      if (subredditName === undefined) {
        return false;
      }
      subredditsFavorite.add($subredditCurrent);
    } catch (err) {
      console.log('Error: subredditsFavoriteAdd() - ' + err.message);
    }
    dispatch('status-message-display', `/r/${$subredditCurrent}/ has been added to your favorites`);
  }
  const subredditsFavoriteRemoveMessage = () => {
    clearTimeout(subredditsFavoriteRemoveTimeout);
    subredditsFavoriteRemoveTimeout = setTimeout(() => {
      dispatch('status-message-display', "Double click the heart icon to remove this subreddit from your favorites.")
    }, 1000)
  }
  const subredditsFavoriteRemove = (subredditName) => {
    clearTimeout(subredditsFavoriteRemoveTimeout);
    subredditsFavorite.remove($subredditCurrent);
    dispatch('status-message-display', `/r/${$subredditCurrent}/ has been removed from your favorites`);
  }

  // events
  const dispatch = createEventDispatcher();
  function titleClicked() {dispatch('title-clicked')}
  function emitSubredditPickerToggle() {dispatch('subreddit-picker-toggle')}
  function emitSubredditSearchToggle() {dispatch('subreddit-search-toggle')}
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
      <span on:click="{titleClicked}" alt="{title}">
        {#if currentContent === 'post' || $subredditsPrevious.length}
        <span class="mr-1 navbar-title" title="hello!">&larr;</span>
        {/if}
        <span class="navbar-title">{title}</span>
      </span>
      <span class="ml-2 navbar-title" on:click="{darkModeToggle}"><!-- ({$darkModeActive ? 'Dark' : 'Light'}) --></span>
    </div>
    <!-- navbar icons, touch-size viewports only -->
    <div class="navbar-end-touch-icon-container is-hidden-desktop">
      <!-- heart icon -->
      {#if !$subredditsFavorite.includes($subredditCurrent)}
      <svg class="bi bi-heart navbar-end-touch-icon navbar-end-touch-icon-heart"
           on:click="{subredditsFavoriteAdd($subredditCurrent)}"
           xmlns="http://www.w3.org/2000/svg"
           width="40" height="40" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
      </svg>
      {:else}
      <svg class="bi bi-heart-fill navbar-end-touch-icon navbar-end-touch-icon-heart"
           on:click="{subredditsFavoriteRemoveMessage}"
           on:dblclick="{subredditsFavoriteRemove($subredditCurrent)}"
           xmlns="http://www.w3.org/2000/svg"
           width="40" height="40" fill="currentColor" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
      </svg>
      {/if}
      <!-- reddit icon -->
      <svg on:click="{() => navbarItemClicked('subreddit-picker', false)}" class="navbar-end-touch-icon navbar-end-touch-icon-reddit" title="Your Subreddits" alt="Your Subreddits" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 1000" xml:space="preserve">
        <circle cx="354.1" cy="564" r="66"/><path d="M990,510.6c0-81.6-64.2-148-143.2-148c-27.7,0-53.4,8.4-75.3,22.4c-67.9-39.4-153.6-64-247.1-67.3l53.9-154.8L690,189.7c-0.4,3.7-1.1,7.2-1.1,11c0,61.6,50.1,111.7,111.7,111.7c61.5,0,111.7-50.1,111.7-111.7S862.1,89,800.6,89c-40.2,0-75.1,21.4-94.7,53.3l-159.7-38.2L471.6,318c-93.1,4.8-177.9,30.7-244.5,71.3c1.3-0.9,2.5-2,3.8-2.9c-22.4-15-49-23.8-77.7-23.8c-79,0-143.2,66.3-143.2,148c0,54.6,29,101.9,71.8,127.5c17.5,152.6,199.4,273,420.8,273c222.9,0,405.7-122,421.1-276C963.5,608.8,990,562.9,990,510.6z M800.5,138.8c34.1,0,61.9,27.8,61.9,62c0,34.1-27.8,61.9-61.9,61.9c-34.3,0-62-27.8-62-61.9C738.5,166.5,766.3,138.8,800.5,138.8z M153.2,412.3c11.3,0,21.9,2.5,31.9,6.3c-54,43.3-90.4,97.7-101.3,157.7c-14.9-17.5-24.2-40.4-24.2-65.7C59.6,456.4,101.6,412.3,153.2,412.3z M502.6,861.4c-205.6,0-372.9-110.9-372.9-247.3c0-136.4,167.3-247.3,372.9-247.3c205.6,0,372.8,110.9,372.8,247.3C875.4,750.4,708.2,861.4,502.6,861.4z M920.2,570.9c-12.2-58.4-48.4-111.2-101.6-153.5c9-3,18.4-5.1,28.3-5.1c51.5,0,93.5,44.1,93.5,98.3C940.2,533.4,932.6,554.2,920.2,570.9z"/><circle cx="638" cy="564" r="66"/><path d="M627.4,710.8c-139.9,92.3-252.8,5.3-257.8,1.4c-10.7-8.6-26.3-6.9-34.9,3.8c-8.6,10.7-7,26.3,3.7,34.9c0.9,0.8,65.4,51.5,159.1,51.5c46.6,0,100.4-12.6,157.2-50.1c11.5-7.6,14.6-23,7.1-34.4C654.2,706.4,638.8,703.2,627.4,710.8z"/>
      </svg>
      <!-- search icon -->
      <!--svg on:click="{() => navbarItemClicked('subreddit-search', false)}"
           class="bi bi-search navbar-end-touch-icon navbar-end-touch-icon-search"
           title="Search Subreddits" alt="Search Subreddits"
           xmlns="http://www.w3.org/2000/svg"
           fill="currentColor" viewBox="0 0 16 16">
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
      </svg-->
      <!-- settings icon -->
      <svg on:click="{() => navbarItemClicked('settings')}"
           class="bi bi-gear navbar-end-touch-icon navbar-end-touch-icon-settings"
           title="Settings" alt="Settings"
           xmlns="http://www.w3.org/2000/svg"
           width="40" height="40" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
        <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
      </svg>
    </div>
    <!-- hamburger menu -->
    <!-- div on:click="{navbarToggle}"
         class="pl-2 navbar-burger"
         class:is-active="{navbarIsActive}"
         title="Navbar Menu" alt="Navbar Menu"
         role="button"
         data-target="navMenu"
         aria-label="menu" aria-expanded="false">
      <span class="burger-line" aria-hidden="true"></span>
      <span class="burger-line" aria-hidden="true"></span>
      <span class="burger-line" aria-hidden="true"></span>
    </div>
  </div-->
  <div id="navMenu"
       class="navbar-menu"
       class:is-active="{navbarIsActive}"
       class:is-dark="{$darkModeActive}">
    <div class="navbar-end">
      <!-- navbar items, desktop-size viewports only -->
      <div class="navbar-item has-text-centered is-hidden-touch"
           class:is-dark="{$darkModeActive}"
           on:click="{() => navbarItemClicked('subreddit-picker')}">
        Your Subreddits
      </div>
      <div class="navbar-item has-text-centered is-hidden-touch"
           class:is-dark="{$darkModeActive}"
           on:click="{() => navbarItemClicked('subreddit-search')}">
        Search
      </div>
      <!-- navbar items for all viewports  -->
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
  fill: white;
}

.navbar-brand {
  height: 4rem;
  width: 100%; /* push the nav items to the end if hamburger icon isn't present */
}

.navbar-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.navbar-end-touch-icon-container {
  display: flex;
  margin-right: 0.25rem;
  flex-grow: 1;
  justify-content: flex-end;
  align-items: center;
}

.navbar-end-touch-icon {
  height: 2.5rem;
  width: 2.5rem;
  cursor: pointer;
}

.navbar-end-touch-icon:hover {
  background: gray;
  border-radius: 0.5rem;
}

.navbar-end-touch-icon-heart {
  margin-right: 1.25rem;
  padding: 0.5rem;
}

.navbar-end-touch-icon-reddit {
  margin-right: 1.25rem;
  padding: 0.4rem;
}

/*
.navbar-end-touch-icon-search {
  display: none;
  margin-right: 1.25rem;
  padding: 0.6rem;
}
*/

.navbar-end-touch-icon-settings {
  margin-right: 1rem;
  padding: 0.5rem;
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
  margin-right: 1rem; /* push the nav items to the end if hamburger icon isn't present */
  padding-bottom: 0;
  justify-content: flex-end; /* push the nav items to the end if hamburger icon isn't present */
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
