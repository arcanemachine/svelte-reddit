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
  /* override bulma styling for dynamically generated html */
  ul {
    margin: 1rem;
    list-style: '- ';
  }

  p {
    margin: 0.5rem auto;
  }
  </style>
  <div class="pt-5">
    <div class="mb-2 card large"
         class:is-dark="{$darkModeActive}">
      <div class="card-header post-header"
           class:has-background-grey-lighter="{!$darkModeActive}"
           class:is-dark="{$darkModeActive}">
        <div class="pb-0 card-header-title post-title"
             class:is-dark="{$darkModeActive}">
          {postContent[0].data.children[0].data.title}
        </div>
        <div class="post-header-bottom-container">
          <div class="mt-0 p-2 ml-5 is-italic post-author"
               class:is-dark="{$darkModeActive}">
            - /u/{postAuthor}/
          </div>
          <div class="mr-5 p-2 is-italic has-text-decoration-underline cursor-url post-header-subreddit"
               on:click="{dispatch('subreddit-pick', {subreddit: postContent[0].data.children[0].data.subreddit})}">
            /r/{postContent[0].data.children[0].data.subreddit}/
          </div>
        </div>
      </div>
      <div class="card-content"
           class:hidden="{!postContent[0].data.children[0].data.selftext_html}"
           class:is-dark="{$darkModeActive}">
        {@html htmlUnescape(postContent[0].data.children[0].data.selftext_html)}
      </div>
    </div>
  </div>
  {#each postContent[1].data.children as post, index}
    <PostItem post="{post}"/>
  {/each}
</div>

<style>
.card {
  border-radius: 0.5rem;
}

.is-dark {
  color: whitesmoke;
}

.card-header.is-dark {
  background: #111;
}

.card-content.is-dark {
  margin-top: -1px;
  background: #222;
}

.post-header {
  flex-direction: column;
}

.post-header-bottom-container {
  display: flex;
  justify-content: space-between;
}
</style>
