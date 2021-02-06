<script>
  import { createEventDispatcher, onMount } from 'svelte';
  const dispatch = createEventDispatcher();

  // props
  export let content;
  export let postAuthor;

  // methods
  const getFormattedDate = (timestamp) => {
    let date = new Date(timestamp*1000);
    return `${date.getFullYear()}/${date.getMonth()+1}/${date.getDay()}`;
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

  const htmlUnescape = (input) => {
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
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
    <div class="card large card-info"
         class:has-background-light="{index % 2}"
         class:has-background-grey-lighter="{!(index % 2)}">
      <div class="post-child-author">
        <!-- span class="cursor-url">[-]</span -->
        <span class="has-text-weight-bold is-italic">/u/{post.data.author}/</span>
      </div>
      <div class="py-2 card-content">
        <div class="post-child-content">{@html htmlUnescape(post.data.body_html)}</div>
      </div>
      <div class="post-child-time is-italic">{getFormattedTimeSince(post.data.created)}</div>
    </div>
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
