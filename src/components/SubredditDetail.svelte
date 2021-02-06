<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  // props
  export let content;

  // methods
  const htmlUnescape = (input) => {
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
  }

  const getFormattedDate = (date) => {
    date = new Date(date*1000);
    return `${date.getFullYear()}/${date.getMonth()+1}/${date.getDay()}`;
  }

  const postTitleClicked = (post) => {
    if (post.data.url.match(/(https:\/\/i.reddit.com\/)/)) {
      // console.log('reddit post');
      emitPostPick(post);
    } else {
      // console.log('non-reddit link');
      window.open(post.data.url, '_blank');
    }
  }

  const postCommentsClicked = (post) => {
    console.log('postCommentsClicked()');
    emitPostPick(post);
  }

  // events
  function emitPostPick(post) {
    dispatch('post-pick', {post: post})
  }
</script>

<div class="columns">
  {#if Object.keys(content).length}
    <div class="column">
      {#each content.data.children as post}
        <div class="px-2 my-0 media post-item"
             style="background-color: {post.data.stickied ? '#e7e7e7' : '#f5f5f5'}">
          <div class="post-image-container">
            {#if post.data.thumbnail.match(/(http)/)}
              <img src="{post.data.thumbnail}"
                   alt="Post thumbnail"
                   class="post-image">
            {:else}
              <svg xmlns="http://www.w3.org/2000/svg"
                   fill="currentColor"
                   class="bi bi-camera-fill post-image"
                   viewBox="0 0 16 16">
                <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z"/>
              </svg> 
            {/if}
            <div class="has-text-centered">{getFormattedDate(post.data.created)}</div>
          </div>
          <div class="ml-3 media-content">
            <div class="post-body-container">
              <div class="mb-4 p-2 post-link-name"
                   style="color: {post.data.stickied === true ? '#009900' : 'default'}"
                   on:click="{postTitleClicked(post)}">
                {post.data.title} <em>[{post.data.domain}]</em>
              </div>
              <div class="ml-2 post-description">
                {@html htmlUnescape(post.data.selftext)}
              </div>
              <div class="mt-3 ml-5 mb-1 p-1 post-link-comments"
                   on:click="{postCommentsClicked(post)}">
                {post.data.num_comments} comments
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
.media {
  max-width: 50rem;
  padding-top: 0;
}

.post-item {
  border: 1px solid black;
  border-width: 1px 2px;
}

.post-image-container {
  align-self: center;
  cursor: pointer;
}

.post-image {
  height: 4rem;
  width: 4rem;
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

.post-description {
  display: -webkit-box;
  min-height: 3rem;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-link-comments {
  cursor: pointer;
  max-width: 10rem;
}
</style>
