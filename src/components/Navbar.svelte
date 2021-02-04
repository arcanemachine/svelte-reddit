<script>
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';

  // data
  export let title = 'reddit';
  let navbarIsActive = true;

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

<nav class="navbar" transition:fade>
  <div class="navbar-brand">
    <div class="navbar-item brand-text has-text-weight-bold">{title}</div>
    <div role="button"
       data-target="navMenu"
       on:click="{navbarToggle}"
       class="navbar-burger"
       class:is-active="{navbarIsActive}"
       aria-label="menu"
       aria-expanded="false">
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
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

.navbar-item {
  cursor: pointer;
  font-weight: bold;
}

</style>
