<script>

import { createEventDispatcher, onMount, onDestroy } from 'svelte';
import { fade } from 'svelte/transition';

// data
export let title = 'reddit';
let navbarIsActive = true;

// methods
const navbarToggle = () => navbarIsActive = !navbarIsActive;

// events
const dispatch = createEventDispatcher();
const emitToggleSubredditPicker = () => {
  console.log('emitToggleSubredditPicker()');
  dispatch('toggle-subreddit-picker');
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
        <span on:click="{emitToggleSubredditPicker}">Go to subreddit</span>
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
