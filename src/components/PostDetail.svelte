<script>
  import { createEventDispatcher } from 'svelte';
  import { darkModeActive, externalRedditStyle } from '../stores/';
  import { htmlUnescape } from '../utils.js';

  import PostItem from './PostItem.svelte';

  const dispatch = createEventDispatcher();

  // props
  export let postContent, postAuthor;

  // data
  let parentContent = postContent[0].data.children[0].data;

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
blockquote {
  color: black;
  margin-left: 0.75rem;
  background-color: gray;
  padding-left: 0.5rem;
  border-left: 2px solid black;
}
  </style>
  <div class="pt-2">
    <div class="mb-3 card large"
         class:is-dark="{$darkModeActive}">
      <div class="card-header post-header"
           class:has-background-grey-lighter="{!$darkModeActive}"
           class:is-dark="{$darkModeActive}">
        <div class="pb-0 card-header-title post-title"
             class:is-dark="{$darkModeActive}">
          {parentContent.title}
        </div>
        <div class="p-2 post-header-bottom-container">
          <div class="mt-0 ml-5 is-italic has-text-decoration-underline cursor-url post-header-subreddit"
               on:click="{() => dispatch('subreddit-pick', {subreddit: parentContent.subreddit})}">
            /r/{parentContent.subreddit}/
          </div>
          <div class="mr-5 is-italic post-author"
               class:is-dark="{$darkModeActive}">
            - /u/{postAuthor}/
          </div>
          <div class="mr-2">
            <a class="reply-link" href="https://reddit.com{parentContent.permalink}{$externalRedditStyle}" target="_blank">
              <!-- reply arrow -->
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-reply-fill" viewBox="0 0 16 16">
                <path d="M5.921 11.9L1.353 8.62a.719.719 0 0 1 0-1.238L5.921 4.1A.716.716 0 0 1 7 4.719V6c1.5 0 6 0 7 8-2.5-4.5-7-4-7-4v1.281c0 .56-.606.898-1.079.62z"/>
              </svg>
              Reply
            </a>
          </div>
        </div>
      </div>
      <div class="card-content"
           class:hidden="{!parentContent.selftext_html}"
           class:is-dark="{$darkModeActive}">
        {@html htmlUnescape(parentContent.selftext_html)}
      </div>
    </div>
  </div>
  {#if parentContent.url && parentContent.url.match(/(jpg|png)$/)}
   <img class="mt-0" src="{parentContent.url}" alt="Post Thumbnail">
  {/if}
  {#each postContent[1].data.children as post}
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

.reply-link {
  color: unset;
  text-decoration: unset;
}

</style>
