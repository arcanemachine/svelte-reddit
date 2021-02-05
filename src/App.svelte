<script>
  import { onMount } from 'svelte';
  import { currentSubreddit } from './stores/';

  import { deleteme } from './deleteme.js';

  // components
  import Navbar from './components/Navbar.svelte';
  import SubredditPicker from './components/SubredditPicker.svelte';
  import SubredditContent from './components/SubredditContent.svelte';
  import LoadingScreen from './components/LoadingScreen.svelte';

  // data
  let title = 'reddit';
  let isLoading = false;
  let subredditPickerShow = false;

  let subredditContent = deleteme;
  let postContent = {};
  let currentContent = 'subreddit';

  // methods
	const keyify = (obj, prefix = '') => // delete this when no longer needed
  Object.keys(obj).reduce((res, el) => {
    if( Array.isArray(obj[el]) ) {
      return res;
    } else if( typeof obj[el] === 'object' && obj[el] !== null ) {
      return [...res, ...keyify(obj[el], prefix + el + '.')];
    }
    return [...res, prefix + el];
  }, []);

  const subredditPickerToggle = () => {
    console.log('toggleSubredditPicker()');
    subredditPickerShow = !subredditPickerShow;
  }

  const subredditPick = async (event) => {
    let subreddit = event.detail.subreddit;
    console.log(`subredditPick(), ${subreddit}`);
    try {
      isLoading = true;
      subredditContent = await fetch(`https://old.reddit.com/r/${subreddit}/hot.json`).then(res => res.json())
      isLoading = false;
    }
    catch(err) {
      console.log("Error: " + err.message)
    }
    // if (subredditContent.data.dist === 27) {title = subredditContent.data.children[0].data.subreddit_name_prefixed}
  }

</script>

<div class="page-container">
  <Navbar title="{title}"
          on:subreddit-picker-toggle="{subredditPickerToggle}"/>

  {#if isLoading}<LoadingScreen/>{/if}

  {#if subredditPickerShow}
    <SubredditPicker on:subreddit-picker-toggle="{subredditPickerToggle}"
                     on:subreddit-pick="{subredditPick}"/>
  {/if}

  <main class="content-container">
    <div class="container">
      <div class="section">
        {#if currentContent === 'subreddit'}
          <SubredditContent content='{subredditContent}'/>
        {/if}
      </div>
    </div>
  </main>
  <footer class="footer-container">
    <div class="debug-info">
      <p class="mb-2">Debug:</p>
      <p>subredditContent: {subredditContent}</p>
    </div>
    <div class="has-text-centered">
      <p>This service has no affiliation with Reddit Inc.</p>
      <p>Licensed under <a href="https://mit-license.org/">MIT License</a></p>
      <div>
        <a href="https://github.com/arcanemachine/svelte-reddit/">
          <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50"><path fill-rule="evenodd" clip-rule="evenodd" fill="#181616" d="M25 10c-8.3 0-15 6.7-15 15 0 6.6 4.3 12.2 10.3 14.2.8.1 1-.3 1-.7v-2.6c-4.2.9-5.1-2-5.1-2-.7-1.7-1.7-2.2-1.7-2.2-1.4-.9.1-.9.1-.9 1.5.1 2.3 1.5 2.3 1.5 1.3 2.3 3.5 1.6 4.4 1.2.1-1 .5-1.6 1-2-3.3-.4-6.8-1.7-6.8-7.4 0-1.6.6-3 1.5-4-.2-.4-.7-1.9.1-4 0 0 1.3-.4 4.1 1.5 1.2-.3 2.5-.5 3.8-.5 1.3 0 2.6.2 3.8.5 2.9-1.9 4.1-1.5 4.1-1.5.8 2.1.3 3.6.1 4 1 1 1.5 2.4 1.5 4 0 5.8-3.5 7-6.8 7.4.5.5 1 1.4 1 2.8v4.1c0 .4.3.9 1 .7 6-2 10.2-7.6 10.2-14.2C40 16.7 33.3 10 25 10z"/></svg>
        </a>
      </div>
  </div>
</div>

<style>
.page-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
}

.content-container {
  flex-grow: 1;
}

.footer-container {
  background-color: #ddd;
  width: 100%;
}

.debug-info {
  margin: 1rem;
}
</style>
