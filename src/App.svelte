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
      subredditContent = await fetch(`https://old.reddit.com/r/${subreddit}/hot.json`)
        .then(res => res.json())
        .then(() => isLoading = false)
    }
    catch(err) {
      console.log("Error: " + err.message)
    }
    if (subredditContent.data.dist === 27) {title = subredditContent.data.children[0].data.subreddit_name_prefixed}
  }

</script>

<div class="page-container">

  {#if subredditPickerShow}
    <SubredditPicker on:subreddit-picker-toggle="{subredditPickerToggle}"
                     on:subreddit-pick="{subredditPick}"/>
  {/if}

  <Navbar title="{title}"
          on:subreddit-picker-toggle="{subredditPickerToggle}"/>

  <main class="content-container">
    <div class="container">
      <div class="section">
        {#if currentContent === 'subreddit'}
          <SubredditContent content='{subredditContent}'/>
        {/if}
      </div>
    </div>
  </main>
  <div class="debug-info-container">
    <div class="debug-info">
      <p class="mb-2">Debug:</p>
    </div>
  </div>
  {#if isLoading}<LoadingScreen/>{/if}
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

.debug-info-container {
  background-color: #ddd;
  width: 100%;
}

.debug-info {
  margin: 1rem;
}
</style>
