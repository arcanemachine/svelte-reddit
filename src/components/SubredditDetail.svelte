<script> import { createEventDispatcher } from 'svelte';
  import { darkModeActive, thumbnailsDisabled, voteCountDisabled } from '../stores/';
  import { htmlUnescape } from '../utils.js';

  const dispatch = createEventDispatcher();

  // props
  export let subredditContent;

  // methods
  const getFormattedDate = (date) => {
    date = new Date(date*1000);
    return `${date.getFullYear()}/${date.getMonth()+1}/${date.getDay()+1}`;
  }

  const postTitleClicked = (post) => {
    if (post.data.url.match(/(https:\/\/i.reddit.com\/)/)) {
      emitPostPick(post);
    } else {
      window.open(post.data.url, '_blank');
    }
  }

  const postCommentsClicked = (post) => {
    emitPostPick(post);
  }

  // events
  function emitPostPick(post) {
    dispatch('post-pick', {post});
  }
</script>

<div class="container">
  <div class="columns">
    {#if Object.keys(subredditContent).length}
      <div class="column">
        {#each subredditContent.data.children as post}
          <div class="px-2 my-0 media post-item"
               class:is-stickied="{post.data.stickied}"
               class:is-dark="{$darkModeActive}">
            {#if thumbnailsDisabled && voteCountDisabled}
            <div class="post-image-container">
              {#if post.data.thumbnail.match(/(http)/)}
                <img on:click="{postTitleClicked(post)}"
                     src="{post.data.thumbnail}"
                     alt="Post thumbnail"
                     class="post-image cursor-url">
              {:else}
                <svg on:click="{postTitleClicked(post)}"
                     xmlns="http://www.w3.org/2000/svg"
                     fill="currentColor"
                     class="bi bi-camera-fill post-image cursor-url"
                     viewBox="0 0 16 16">
                  <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                  <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z"/>
                </svg> 
              {/if}
              <div class="has-text-centered">{getFormattedDate(post.data.created)}</div>
            </div>
            {/if}
            <div class="ml-3 media-content">
              <div class="post-body-container">
                <div class="mb-4 p-2 post-link-name"
                     class:is-stickied="{post.data.stickied}"
                     on:click="{postTitleClicked(post)}">
                  {@html htmlUnescape(post.data.title)} <em>[{post.data.domain}]</em>
                </div>
                <div class="mx-1 post-description">
                  {@html htmlUnescape(post.data.selftext_html)}
                </div>
              <div class="mt-3 ml-5 mb-1 p-1 post-body-bottom-container">
                <div class="has-text-weight-bold is-italic post-link-comments"
                     on:click="{postCommentsClicked(post)}">
                  {post.data.num_comments} comments
                </div>
                <div class="has-text-weight-bold is-italic post-body-bottom-subreddit"
                     on:click="{() => dispatch('subreddit-pick', {subreddit: post.data.subreddit})}">
                  /r/{post.data.subreddit}
                </div>
              </div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
.media {
  max-width: 50rem;
  padding-top: 0;
  border-radius: 1rem;
}

.post-item {
  border: 1px solid black;
  border-width: 1px 0;
}

.post-item.is-dark {
  color: whitesmoke;
  border: 1px solid gray;
  border-width: 1px 0;
}

.post-item.is-stickied {
  background: #eee;
}

.post-item.is-stickied.is-dark {
  background: #111;
}

@media screen and (min-width: 50rem) {
  .post-item {
    /* show side borders on large displays */
    border-width: 1px 2px !important;
  }
}

.post-image-container {
  align-self: center;
}

.post-image {
  height: 4rem;
  width: 4rem;
  border-radius: 0.5rem;
}

.post-body-container {
  margin: 0.5rem auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.post-link-name {
  cursor: pointer;
  font-weight: bold;
}

.post-link-name.is-stickied {
  color: #070;
}

.post-description {
  display: -webkit-box;
  min-height: 3rem;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  pointer-events: none;
}

.post-body-bottom-container {
  display: flex;
}

.post-body-bottom-subreddit {
  cursor: pointer;
  margin-left: auto;
  margin-right: 1.5rem;
}

.post-link-comments {
  cursor: pointer;
  max-width: 10rem;
}
</style>
