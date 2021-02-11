<script>
  import { onMount } from 'svelte';
  import { darkModeActive, fontSize, subredditsRecent } from './stores/';
  import { mockedSubredditData } from './mockedSubredditData.js';
  import { mockedPostData } from './mockedPostData2.js';

  import Navbar from './components/Navbar.svelte';
  import Settings from './components/Settings.svelte';
  import LoadingScreen from './components/LoadingScreen.svelte';
  import SubredditPicker from './components/SubredditPicker.svelte';
  import SubredditSearch from './components/SubredditSearch.svelte';
  import SubredditDetail from './components/SubredditDetail.svelte';
  import PostDetail from './components/PostDetail.svelte';
  import AppFooter from './components/AppFooter.svelte';
  import StatusMessage from './components/StatusMessage.svelte';


  // onMount
  onMount(() => {
    function initializeStore() {
      // if font size saved in localStorage, set the page font size to match it
      if (localStorage.getItem('fontSize')) {
        fontSize.set(Number(localStorage.getItem('fontSize')));
        document.querySelector('html').style.fontSize = `${get(fontSize)}px`;
      }
      // set dark mode
      if (localStorage.getItem('darkModeActive')) {
        darkModeActive.set(true);
      }
      // get recent subreddits
      let localSubredditsRecent = localStorage.getItem('subredditsRecent');
      if (localSubredditsRecent && JSON.parse(localSubredditsRecent).length) {
        subredditsRecent.set(JSON.parse(localStorage.getItem('subredditsRecent')))
      }
    }
    initializeStore();
    currentContent = 'post';
    // subredditPick(undefined, currentSubreddit);
  })

  // data
  let title = 'Reddit μReader';
  let isLoading = false;
  let settingsShow = false;
  let subredditPickerShow = true;
  let subredditSearchShow = false;

  let previousSubreddits = [];
  let currentSubreddit = 'all';
  let subredditContent = mockedSubredditData;
  let postContent = mockedPostData;
  let postAuthor = '';
  let currentContent = undefined;

  const titleClicked = (event) => {
    if (previousSubreddits.length) {
      debugger;
      let previousSubreddit = previousSubreddits.splice(previousSubreddits.length - 1, 1);
      if (previousSubreddit !== currentSubreddit) {
        titleClicked(event);
      }
      subredditPick(undefined, previousSubreddit);
    } else {
      currentContentIs('subreddit');
    }
  }
  const currentContentIs = (x) => {
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
    isLoading = true;
    setTimeout(() => {
      currentContent = undefined;
    }, 200)
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
    document.querySelector('html').style.overflowY = settingsShow ? 'hidden' : 'default';
  }

  // SubredditPicker
  const subredditPickerClose = () => {
    subredditPickerShow = false;
    document.querySelector('html').style.overflowY = 'auto';
  }
  const subredditPickerToggle = () => {
    console.log('subredditPickerToggle()');
    subredditPickerShow = !subredditPickerShow;
    document.querySelector('html').style.overflowY = subredditPickerShow ? 'hidden' : 'default';
  }

  // SubredditSearch
  const subredditSearchClose = () => {
    subredditSearchShow = false;
    document.querySelector('html').style.overflowY = 'auto';
  }
  const subredditSearchToggle = () => {
    subredditSearchShow = !subredditSearchShow;
    document.querySelector('html').style.overflowY = subredditSearchShow ? 'hidden' : 'default';
  }

  // SubredditDetail
  const subredditPick = async (event, subreddit=undefined, sort='hot') => {
    if (event && Object.keys(event).length) {
      subreddit = event.detail.subreddit;
    }
    if (currentContent === 'subreddit' && subreddit.toLowerCase() === currentSubreddit.toLowerCase()) {
      currentContentIs('subreddit');
      return false;
    }
    try {
      isLoading = true;
      await fetch(`https://i.reddit.com/r/${subreddit}/${sort}.json`)
      .then(res => res.json())
      .then(data => {
        subredditContent = data; // assign response json to subredditContent
        subredditSearchClose(); // close the search modal
        previousSubreddits.push(currentSubreddit);
        currentSubreddit = subreddit;
        title = `/r/${currentSubreddit}/`; // set the title
        subredditsRecent.add(currentSubreddit); // add the subreddit to recents
        window.scrollTo({top: 0, left: 0, behavior: 'smooth'}); // scroll to top
        currentContent = 'subreddit'; // update content view type
        isLoading = false; // disable the loading screen
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
        // title = `/r/${post.data.subreddit}/`;
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
  // this is a hack to refresh PostDetail comments if dark mode is toggled while in the PostDetail view
  const darkModeToggled = () => {
    if (currentContent === 'post') {
      currentContent = undefined;
      currentContentIs('post');
    }
  }

  // StatusMessage
  let statusMessage = '';
  let statusMessageTimeout;
  const statusMessageDisplay = (message, timeout=undefined) => {
    // if a status message is already present, clear it
    if (statusMessage) {
      statusMessage = '';
      clearTimeout(statusMessageTimeout);
      setTimeout(() => {
        statusMessageDisplay(message, timeout);
      }, 500);
      return false;
    }

    clearTimeout(statusMessageTimeout);
    if (timeout === undefined) {
      timeout = 4000;
    } else if (timeout === -1) {
      timeout = 1000000;
    }

    statusMessage = message
    statusMessageTimeout = setTimeout(() => statusMessage = '', timeout);
  }
  const statusMessageClear = () => {
    statusMessage = '';
    clearTimeout(statusMessageTimeout);
    statusMessageDisplay('', 0);
  }
  const receiveStatusMessageDisplay = (event) => {
    if (typeof(event.detail) === 'string') {
      statusMessageDisplay(event.detail);
    } else {
      statusMessageDisplay(event.detail.message, event.detail.timeout);
    }
  }


</script>

<div class="page-container"
     class:is-dark="{$darkModeActive}">
  <Navbar title="{title}"
          currentContent="{currentContent}"
          previousSubreddit="{previousSubreddits.length ? previousSubreddits.last : undefined}"
          on:subreddit-picker-toggle="{subredditPickerToggle}"
          on:subreddit-search-toggle="{subredditSearchToggle}"
          on:settings-toggle="{settingsToggle}"
          on:title-clicked="{titleClicked}"/>

  {#if isLoading}<LoadingScreen/>{/if}

  {#if settingsShow}
    <Settings on:settings-close="{settingsClose}"
              on:status-message-display="{receiveStatusMessageDisplay}"
              on:dark-mode-toggled="{darkModeToggled}"/>
  {:else if subredditPickerShow}
    <SubredditPicker on:subreddit-picker-close="{subredditPickerClose}"
                     on:subreddit-picker-toggle="{subredditPickerToggle}"
                     on:status-message-display="{receiveStatusMessageDisplay}"
                     on:subreddit-pick="{subredditPick}"/>
  {/if}

  <main class="content-container">
    {#if currentContent === 'subreddit'}
      <SubredditDetail subredditContent="{subredditContent}"
                       on:post-pick="{postPick}"
                       on:subreddit-pick="{subredditPick}"/>
    {:else if currentContent === 'post'}
      <PostDetail postContent="{postContent}"
                  postAuthor="{postAuthor}"
                  on:subreddit-pick="{subredditPick}"/>
    {/if}
  </main>
  <AppFooter/>
  {#if statusMessage}
    <StatusMessage message="{statusMessage}"
                   on:status-message-clear="{statusMessageClear}"/>
  {/if}
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
