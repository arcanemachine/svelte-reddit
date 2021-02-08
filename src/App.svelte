<script>
  import { onMount } from 'svelte';
  import { currentSubreddit } from './stores/';
  import { mockedSubredditData } from './mockedSubredditData.js';
  import { mockedPostData } from './mockedPostData.js';

  // components
  import Navbar from './components/Navbar.svelte';
  import Settings from './components/Settings.svelte';
  import LoadingScreen from './components/LoadingScreen.svelte';
  import SubredditPicker from './components/SubredditPicker.svelte';
  import SubredditDetail from './components/SubredditDetail.svelte';
  import PostDetail from './components/PostDetail.svelte';
  import AppFooter from './components/AppFooter.svelte';

  // onMount
  onMount(() => {
    // if font size saved in localStorage, retir
    if (localStorage.getItem('fontSize')) {
      document.querySelector('html').style.fontSize = `${localStorage.getItem('fontSize')}px`;
      console.log(localStorage.getItem('fontSize'));
    }
    // subredditPick(undefined, 'AskReddit');
  })

  // data
  let title = 'Reddit Micro';
  let isLoading = false;
  let settingsShow = true;
  let subredditPickerShow = false;

  let subredditContent = mockedSubredditData;
  let postContent = mockedPostData;
  // let subredditContent;
  // let postContent;
  let postAuthor = '';
  let currentContent = 'post';

  const titleClicked = () => {currentContentIs('subreddit')}
  const currentContentIs = (x) => {
    isLoading = true;
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
    setTimeout(() => {currentContent = undefined}, 200);
    setTimeout(() => {
      currentContent = x;
      isLoading = false;
    }, 200)
  }

  // Settings
  const settingsClose = () => {
    settingsShow = false;
    document.querySelector('html').style.overflowY = 'auto';
  }
  const settingsToggle = () => {
    settingsShow = !settingsShow;
    document.querySelector('html').style.overflowY = subredditPickerShow ? 'hidden' : 'default';
  }

  // SubredditPicker
  const subredditPickerClose = () => {
    subredditPickerShow = false;
    document.querySelector('html').style.overflowY = 'auto';
  }
  const subredditPickerToggle = () => {
    subredditPickerShow = !subredditPickerShow;
    document.querySelector('html').style.overflowY = subredditPickerShow ? 'hidden' : 'default';
  }
  const subredditPick = async (event, subreddit=undefined, sort='hot') => {
    if (event && Object.keys(event).length) {
      subreddit = event.detail.subreddit;
    }
    try {
      isLoading = true;
      await fetch(`https://i.reddit.com/r/${subreddit}/${sort}.json`)
      .then(res => res.json())
      .then(data => {
        subredditPickerClose();
        subredditContent = data;
        title = subredditContent.data.children[0].data.subreddit_name_prefixed;
        window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
        currentContent = 'subreddit';
        isLoading = false;
      })
    }
    catch(err) {
      console.log("Error: " + err.message)
      isLoading = false;
    }
  }

  const postPick = async (event) => {
    let post = event.detail.post;
    let url = post.data.permalink;
    isLoading = true;
    try {
      await fetch(`https://i.reddit.com${url}.json`)
      .then(res => res.json())
      .then(data => {
        postContent = data;
        postAuthor = post.data.author;
        title = `/r/${post.data.subreddit}/`;
        window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
        currentContent = 'post';
        isLoading = false;
      })
    }
    catch(err) {
      console.log("Error: " + err.message);
    }
    finally {
      isLoading = false;
    }
  }

</script>

<div class="page-container">
  <Navbar title="{title}"
          currentContent="{currentContent}"
          on:subreddit-picker-toggle="{subredditPickerToggle}"
          on:settings-toggle="{settingsToggle}"
          on:title-clicked="{titleClicked}"/>

  {#if isLoading}<LoadingScreen/>{/if}

  {#if settingsShow}
    <Settings on:settings-close="{settingsClose}"/>
  {/if}

  {#if subredditPickerShow}
    <SubredditPicker on:subreddit-picker-close="{subredditPickerClose}"
                     on:subreddit-picker-toggle="{subredditPickerToggle}"
                     on:subreddit-pick="{subredditPick}"/>
  {/if}

  <main class="content-container">
    <div class="container">
        {#if currentContent === 'subreddit'}
          <SubredditDetail subredditContent="{subredditContent}"
                           on:post-pick="{postPick}"/>
        {:else if currentContent === 'post'}
          <PostDetail postContent="{postContent}" postAuthor="{postAuthor}"/>
        {/if}
    </div>
  </main>
  <AppFooter/>
</div>

<style>
.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100vh;
}

.content-container {
  max-width: 60rem;
  max-width: 100vw;
  margin-top: 4rem;
  flex-grow: 1;
}
</style>
