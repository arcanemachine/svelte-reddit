<script>
  import { onMount } from 'svelte';
  import { readable } from 'svelte/store';
  import { darkModeActive } from './stores/';
  import { mockedSubredditData } from './mockedSubredditData.js';
  import { mockedPostData } from './mockedPostData2.js';

  import Navbar from './components/Navbar.svelte';
  import Settings from './components/Settings.svelte';
  import LoadingScreen from './components/LoadingScreen.svelte';
  import SubredditPicker from './components/SubredditPicker.svelte';
  import SubredditDetail from './components/SubredditDetail.svelte';
  import PostDetail from './components/PostDetail.svelte';
  import AppFooter from './components/AppFooter.svelte';
  import StatusMessage from './components/StatusMessage.svelte';


  // onMount
  onMount(() => {
    // if font size saved in localStorage, set the page font size to match it

    // DELETEME
    // document.querySelector('html').style.fontSize = `15px`;
    
    if (localStorage.getItem('fontSize')) {
      document.querySelector('html').style.fontSize = `${localStorage.getItem('fontSize')}px`;
    }
    // if dark mode enabled, then turn it on
    if (localStorage.getItem('darkModeActive') == true) {
      darkModeActive.set(true);
    }

    // subredditPick(undefined, 'AskReddit');
  })

  // data
  let title = 'Reddit μReader';
  let subredditContent = mockedSubredditData;
  let postContent = mockedPostData;
  // let subredditContent;
  // let postContent;
  let postAuthor = '';
  let currentContent = 'subreddit';

  // data - modals
  let isLoading = false;

  const titleClicked = () => {currentContentIs('subreddit')}
  const currentContentIs = (x) => {
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
    isLoading = true;
    setTimeout(() => {
      currentContent = undefined;
    }, 150)
    setTimeout(() => {
      currentContent = x;
      isLoading = false;
    }, 150)
  }

  // StatusMessage
  let statusMessage = '';
  let statusMessageTimeout;
  const statusMessageDisplay = (message, timeout=undefined) => {
    if (timeout === undefined) {
      timeout = 4000;
    } else if (timeout === -1) {
      timeout = 1000000;
    }
    clearTimeout(statusMessageDisplay);
    statusMessage = message
    statusMessageTimeout = setTimeout(() => statusMessage = '', timeout);
  }
  const statusMessageClear = () => {
    statusMessage = '';
    clearTimeout(statusMessageTimeout);
    statusMessageDisplay('', 0);
  }

  // Settings
  let settingsShow = false;
  const settingsClose = () => {
    settingsShow = false;
    document.querySelector('html').style.overflowY = 'auto';
  }
  const settingsToggle = () => {
    settingsShow = !settingsShow;
    document.querySelector('html').style.overflowY = settingsShow ? 'hidden' : 'default';
  }

  // SubredditPicker
  let subredditPickerShow = false;
  const subredditPickerClose = () => {
    subredditPickerShow = false;
    document.querySelector('html').style.overflowY = 'auto';
  }
  const subredditPickerToggle = () => {
    subredditPickerShow = !subredditPickerShow;
    document.querySelector('html').style.overflowY = subredditPickerShow ? 'hidden' : 'default';
  }

  // SubredditDetail
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

  // PostDetail
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
  // this is a hack to refresh PostDetail comments if dark mode is turned off while in the PostDetail view
  const darkModeToggled = () => {
    if (currentContent === 'post') {
      currentContent = undefined;
      currentContentIs('post');
    }
  }


</script>

<div class="page-container"
     class:is-dark="{$darkModeActive}">
  {#if statusMessage}
    <StatusMessage message="{statusMessage}"
                   on:status-message-clear="{statusMessageClear}"/>
  {/if}
  <Navbar title="{title}"
          currentContent="{currentContent}"
          on:subreddit-picker-toggle="{subredditPickerToggle}"
          on:settings-toggle="{settingsToggle}"
          on:title-clicked="{titleClicked}"/>

  {#if isLoading}<LoadingScreen/>{/if}

  {#if settingsShow}
    <Settings on:settings-close="{settingsClose}"
              on:dark-mode-toggled="{darkModeToggled}"/>
  {/if}

  {#if subredditPickerShow}
    <SubredditPicker on:subreddit-picker-close="{subredditPickerClose}"
                     on:subreddit-picker-toggle="{subredditPickerToggle}"
                     on:subreddit-pick="{subredditPick}"/>
  {/if}

  <main class="content-container">
    {#if currentContent === 'subreddit'}
      <SubredditDetail subredditContent="{subredditContent}"
                       on:post-pick="{postPick}"/>
    {:else if currentContent === 'post'}
      <PostDetail postContent="{postContent}" postAuthor="{postAuthor}"/>
    {/if}
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

.is-dark {
  background: black;
  color: whitesmoke;
}
</style>
