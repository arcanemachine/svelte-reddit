<script>
  import { htmlUnescape } from '../utils.js';
  import { darkModeActive } from '../stores/';

  // props
  export let post, depth=0;

  // data
  let maxDepth = 8;

  // methods
  const getBackgroundColor = () => {
    let magicNumber = ((14 * 16) - (depth * 7));  // get offset color for child posts
    magicNumber = Math.abs((255 * $darkModeActive) - magicNumber);  // invert color for dark mode
    let result = magicNumber.toString(16);
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
  <div class="card post-item-card"
       class:is-dark="{$darkModeActive}"
       style="margin-left: {depth / 5}rem; background-color: {getBackgroundColor()};">
    <div class="post-child-author">
      <!-- span class="cursor-url">[-]</span -->
      <span class="has-text-weight-bold is-italic" class:is-dark="{$darkModeActive}">/u/{post.data.author}/</span>
    </div>
    <div class="py-2 card-content">
      <div class:is-dark="{$darkModeActive}">{@html htmlUnescape(post.data.body_html)}</div>
    </div>
    <div class="post-child-time is-italic" class:is-dark="{$darkModeActive}">{getFormattedTimeSince(post.data.created)}</div>
    {#if post.data.hasOwnProperty('replies') && Object.keys(post.data.replies).length}
      {#if depth < maxDepth}
        {#each post.data.replies.data.children as reply, index}
          <svelte:self post="{reply}" index="{index}" depth="{depth + 1}"/>
        {/each}
      {:else}
        <div class="get-more-posts" class:is-dark="{$darkModeActive}">Dive deeper...</div>
      {/if}
    {/if}
  </div>
</div>

<style>
.is-dark {
  background: inherit;
  color: whitesmoke;
}

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
