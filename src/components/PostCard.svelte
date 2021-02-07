<script>
  import { createEventDispatcher, onMount } from 'svelte';

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
            <div class="pb-0 card-header-title post-title">{postContent[0].data.children[0].data.title}</div>
            <div class="mt-0 mb-2 ml-5 is-italic post-author">- {postAuthor}</div>
          </div>
          <div class="card-content has-background-light" class:hidden="{!postContent[0].data.children[0].data.selftext_html}">
            {@html htmlUnescape(postContent[0].data.children[0].data.selftext_html)}
          </div>
        </div>
      </div>
    </div>
  </div>
  {#each postContent[1].data.children as post, index}
    <div class="card large"
         class:has-background-light="{index % 2}"
         class:has-background-grey-lighter="{!(index % 2)}"
         style="margin-left: {index h 2}rem;">
      <PostItem post="{post}" index="{index}"/>
    </div>
    
    {#if post.data.hasOwnProperty('replies') && Object.keys(post.data.replies).length}
      {#each post.data.replies.data.children as reply0, index}
        <PostItem post="{reply0}" index="{index + index % 2 ? 0 : 1}" indent="{1}"/>
      {/each} 
    {/if}
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
