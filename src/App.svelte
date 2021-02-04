<script>
  import { currentSubreddit } from './stores/'

  // components
  import Navbar from './components/Navbar.svelte';
  import SubredditPicker from './components/SubredditPicker.svelte';

  // data
  let subredditPickerShow = false;
  let content = undefined;

  // methods
  const subredditPickerToggle = () => {
    console.log('toggleSubredditPicker()');
    subredditPickerShow = !subredditPickerShow;
  }

  const subredditPick = async (event) => {
    let subreddit = event.detail.subreddit;
    console.log(`subredditPick(), ${subreddit}`);
    content = await fetch(`https://old.reddit.com/r/${subreddit}/hot.json`).then(res => res.json())
  }
</script>

<div class="page-container">
  {#if subredditPickerShow}
  <SubredditPicker on:subreddit-picker-toggle="{subredditPickerToggle}"
                   on:subreddit-pick="{subredditPick}"/>
  {/if}
  <Navbar title="reddit"
          on:subreddit-picker-toggle="{subredditPickerToggle}"/>
  <main class="content-container">
    Content: {JSON.stringify(content)}
  </main>
  <div class="debug-info-container">
    <div class="debug-info">
      <p class="mb-2">Debug:</p>
      <p>subredditPickerShow: {subredditPickerShow}</p>
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

.debug-info-container {
  background-color: #ddd;
  width: 100%;
}

.debug-info {
  margin: 1rem;
}

</style>
