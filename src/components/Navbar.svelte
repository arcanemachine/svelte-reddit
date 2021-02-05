<script>
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';

  // data
  export let title = 'reddit';
  let navbarIsActive = false;

  // methods
  const navbarToggle = () => navbarIsActive = !navbarIsActive;
  const itemClicked = () => navbarToggle();

  const goToSubredditClicked = () => {
    itemClicked();
    emitSubredditPickerToggle();
  }

  // events
  const dispatch = createEventDispatcher();

  const emitSubredditPickerToggle = () => {
    console.log('emitSubredditPickerToggle()');
    dispatch('subreddit-picker-toggle');
  }
</script>

<nav class="navbar is-size-5" transition:fade>
  <div class="navbar-brand">
    <div class="ml-2 p-2 navbar-item brand-text has-text-weight-bold">{title}</div>
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
      <div class="navbar-item has-text-centered">
        <span on:click="{goToSubredditClicked}">Go to subreddit</span>
      </div>
    </div>
  </div>
</nav>

<style>

.navbar {
  border-bottom: 1px solid black;
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
