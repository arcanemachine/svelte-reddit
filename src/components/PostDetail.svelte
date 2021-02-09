<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { darkModeActive } from '../stores/';
  import { htmlUnescape } from '../utils.js';

  import PostItem from './PostItem.svelte';

  const dispatch = createEventDispatcher();

  // props
  export let postContent, postAuthor;

  // methods
  const getFormattedDate = (timestamp) => {
    let date = new Date(timestamp*1000);
    return `${date.getFullYear()}/${date.getMonth()+1}/${date.getDay()}`;
  }

</script>

<div class="container" class:is-dark="{$darkModeActive}">
  <style>
  /* start: override bulma styling for dynamically generated html */
  ul {
    margin: 1rem 2rem;
    list-style: '- ';
  }

  p {
    margin: 0.5rem auto;
  }
  /* end: override bulma styling for dynamically generated html */
  </style>
  <div class="pt-5 section">
    <div class="columns">
      <div class="column">
        <div class="card large"
             class:is-dark="{$darkModeActive}">
          <div class="card-header post-header"
               class:has-background-grey-lighter="{!$darkModeActive}"
               class:is-dark="{$darkModeActive}">
            <div class="pb-0 card-header-title post-title"
                 class:is-dark="{$darkModeActive}">
              {postContent[0].data.children[0].data.title}
            </div>
            <div class="mt-0 mb-2 ml-5 is-italic post-author"
                 class:is-dark="{$darkModeActive}">
              - /u/{postAuthor}/
            </div>
          </div>
          <div class="card-content" class:hidden="{!postContent[0].data.children[0].data.selftext_html}">
            {@html htmlUnescape(postContent[0].data.children[0].data.selftext_html)}
          </div>
        </div>
      </div>
    </div>
  </div>
  {#each postContent[1].data.children as post, index}
    <PostItem post="{post}" index="{index}"/>
  {/each}
</div>

<style>
.is-dark {
  color: whitesmoke;
}

.card-header {
  border-radius: 0.2rem;
}

.card-header.is-dark {
  background: #333;
}

.post-header {
  flex-direction: column;
}
</style>
