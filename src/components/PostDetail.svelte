<script>
  import { createEventDispatcher, onMount } from 'svelte';

  import { htmlUnescape } from '../utils.js';
  import { PostItem } from './PostItem.svelte';

  const dispatch = createEventDispatcher();

  // props
  export let content;
  export let postAuthor;

  // methods
  const getFormattedDate = (timestamp) => {
    let date = new Date(timestamp*1000);
    return `${date.getFullYear()}/${date.getMonth()+1}/${date.getDay()}`;
  }

</script>

<div class="container">
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
  <div class="pt-5 px-3 section">
    <div class="columns">
      <div class="column">
        <div class="card large">
          <div class="card-header post-header has-background-grey-lighter">
            <div class="pb-0 card-header-title post-title">{content[0].data.children[0].data.title}</div>
            <div class="mt-0 mb-2 ml-5 is-italic post-author">- {postAuthor}</div>
          </div>
          <div class="card-content has-background-light" class:hidden="{!content[0].data.children[0].data.selftext_html}">
            {@html htmlUnescape(content[0].data.children[0].data.selftext_html)}
          </div>
        </div>
      </div>
    </div>
  </div>
  {#each content[1].data.children as post, index}
    <PostItem post=post/>
  {/each}
</div>

<style>
.hidden {
  display: none;
}

.cursor-url {
  cursor: pointer;
}

.post-header {
  flex-direction: column;
}
</style>
