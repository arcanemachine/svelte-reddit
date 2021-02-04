<script>
import Navbar from './components/Navbar.svelte';
import SubredditPicker from './components/SubredditPicker.svelte';

// data
let showSubredditPicker = true;
let currentSubreddit = undefined;

// methods
const toggleSubredditPicker = () => {
  console.log('toggleSubredditPicker()');
  showSubredditPicker = !showSubredditPicker;
}

</script>

<div class="page-container">
  <SubredditPicker/>
  <Navbar on:toggle-subreddit-picker="{toggleSubredditPicker}" title="reddit"/>
  <main class="content-container">
  </main>
  <div class="debug-info-container">
    <div class="debug-info">
      showSubredditPicker: {showSubredditPicker}
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
