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

  const navbarItemClicked = (itemName) => {
    navbarToggle();
    if (itemName === 'go-to-subreddit') {
      emitSubredditPickerToggle();
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
        <span on:click="{() => navbarItemClicked('go-to-subreddit')}">Go to subreddit</span>
      </div>
    </div>
  </div>
</nav>

<style>

.navbar {
  height: 4rem;
  border-bottom: 2px solid black;
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
