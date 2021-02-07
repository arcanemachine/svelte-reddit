<script>
  import { htmlUnescape } from '../utils.js';

  // props
  export let post, index, depth=0;

  // data
  let maxDepth = 8;

  // methods
  const getBackgroundColor = () => {
    let result = ((14 * 16) - (depth * 7)).toString(16);
    return `#${result}${result}${result}`;
  }

  const getFormattedTimeSince = (timestamp) => {
    let now = new Date();
    let date = new Date(timestamp*1000);
    let difference = Math.floor((now - date) / 1000);

    let result, plural;

    if (difference < 60) {
      return "less than a minute ago";
    }
    else if (difference < 3600) {
      result = Math.floor(difference / 60);
      plural = result === 1 ? '' : 's';
      return `${result} minutes ago`;
    }
    else if (difference < 86400) {
      result = Math.floor(difference / 3600);
      plural = result === 1 ? '' : 's';
      return `${result} hours ago`;
    }
    else if (difference < (86400 * 30)) {
      result = Math.floor(difference / (86400));
      plural = result === 1 ? '' : 's';
      return `${result} days ago`;
    }
    else {
      let options = {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }
      return date.toLocaleString("en", options);
    }
  }

</script>

<div>
  <div class="card large post-item-card"
       style="margin-left: {depth / 4}rem; background-color: {getBackgroundColor()};">
    <div class="post-child-author">
      <!-- span class="cursor-url">[-]</span -->
      <span class="has-text-weight-bold is-italic">/u/{post.data.author}/</span>
    </div>
    <div class="py-2 card-content">
      <div>{@html htmlUnescape(post.data.body_html)}</div>
    </div>
    <div class="post-child-time is-italic">{getFormattedTimeSince(post.data.created)}</div>
    {#if post.data.hasOwnProperty('replies') && Object.keys(post.data.replies).length}
      {#if depth < maxDepth}
        {#each post.data.replies.data.children as reply, index}
          <svelte:self post="{reply}" index="{index}" depth="{depth + 1}"/>
        {/each}
      {:else}
        <div class="get-more-posts">Dive deeper...</div>
      {/if}
    {/if}
  </div>
</div>

<style>
.post-item-card {
  border: 1px solid black;
  box-shadow: none;
  margin-bottom: -1px;
  margin-right: -1px;
}

.post-child-author {
  padding-top: 0.75rem;
  margin-left: 0.75rem;
}

.post-child-time {
	text-align: end;
	margin-right: 0.75rem;
	padding-bottom: 0.75rem;
}
</style>
