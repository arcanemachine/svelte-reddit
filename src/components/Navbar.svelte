<script>

import { createEventDispatcher, onMount, onDestroy } from 'svelte';

export let title;
export let navbarIsActive = false;

export const navbarToggle = () => navbarIsActive = !navbarIsActive;

</script>

<nav class="navbar">
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
        Go to subreddit
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
