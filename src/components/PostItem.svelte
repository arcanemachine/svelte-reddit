<script> import { htmlUnescape } from '../utils.js';
  import { darkModeActive, externalRedditStyle } from '../stores/';

  // props
  export let post;
  export let permalink = undefined;
  export let depth = 0;

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
       style="margin-left: {depth === 0 ? '0' : '0.5rem'}; background: {getBackgroundColor()};">
    {#if post.kind === 't1'}
      <div class="post-child-author">
        <!-- span class="cursor-url">[-]</span -->
        <div class="has-text-weight-bold is-italic" class:is-dark="{$darkModeActive}">/u/{post.data.author}/</div>
        <div class="mr-4">
          <a class="reply-link" href="https://reddit.com{post.data.permalink}{$externalRedditStyle}" target="_blank">
            <!-- reply arrow -->
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-reply-fill" viewBox="0 0 16 16">
              <path d="M5.921 11.9L1.353 8.62a.719.719 0 0 1 0-1.238L5.921 4.1A.716.716 0 0 1 7 4.719V6c1.5 0 6 0 7 8-2.5-4.5-7-4-7-4v1.281c0 .56-.606.898-1.079.62z"/>
            </svg>
            Reply
          </a>
        </div>
      </div>
      <div class="py-2 card-content">
        <div class:is-dark="{$darkModeActive}">{@html htmlUnescape(post.data.body_html)}</div>
      </div>
      <div class="post-child-time is-italic" class:is-dark="{$darkModeActive}">{getFormattedTimeSince(post.data.created)}</div>
      {#if post.data.hasOwnProperty('replies') && Object.keys(post.data.replies).length}
          {#each post.data.replies.data.children as reply, index}
            <svelte:self post="{reply}" depth="{depth + 1}" permalink="{post.data.permalink}"/>
          {/each}
        <!-- {:else}
        <div class="get-more-posts" class:is-dark="{$darkModeActive}">Dive deeper...</div>
        {/if} -->
      {/if}
    {:else if post.kind === 'more'}
      <div class="py-2 card-content">
        <a href="https://reddit.com{permalink}.compact" target="_blank">Read more replies...</a>
      </div>
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
  display: flex;
  justify-content: space-between;
  padding-top: 0.75rem;
  margin-left: 0.75rem;
}

.reply-link {
  color: unset;
  text-decoration: unset;
}

.post-child-time {
	text-align: end;
	margin-right: 0.75rem;
	padding-bottom: 0.75rem;
}
</style>
