<script>
  import { onMount, tick } from 'svelte';
  import { darkModeActive, fontSize, subredditCurrent, subredditDefault, subredditsFavorite,
           subredditsMultiLabels, subredditsPrevious, subredditsRecent } from './stores/';
  // import { mockedSubredditData } from './mockedSubredditData.js';
  // import { mockedPostData } from './mockedPostData4.js';

  import Navbar from './components/Navbar.svelte';
  import Settings from './components/Settings.svelte';
  import LoadingScreen from './components/LoadingScreen.svelte';
  import SubredditPicker from './components/SubredditPicker.svelte';
  import SubredditDetail from './components/SubredditDetail.svelte';
  import PostDetail from './components/PostDetail.svelte';
  import AppFooter from './components/AppFooter.svelte';
  import StatusMessage from './components/StatusMessage.svelte';


  // onMount
  onMount(async() => {

    // if page is not https or dev url, redirect to https + url
    let currentUrl = window.location.href;
    if (!currentUrl.match('https') && !currentUrl.match('192.168')) {
      let splitUrl = currentUrl.split('://');
      window.location = `https://${splitUrl[1]}`
    }

    function initializeState() {

      // if font size saved in localStorage, set the page font size to match it
      if (localStorage.getItem('fontSize')) {
        fontSize.set(Number(localStorage.getItem('fontSize')));
        document.querySelector('html').style.fontSize = `${$fontSize}px`;
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

      // get favorite subreddits
      let localSubredditsFavorite = localStorage.getItem('subredditsFavorite');
      if (localSubredditsFavorite && JSON.parse(localSubredditsFavorite).length) {
        subredditsFavorite.set(JSON.parse(localStorage.getItem('subredditsFavorite')))
      }

      // get multireddit labels
      let localSubredditsMultiLabels = localStorage.getItem('subredditsMultiLabels');
      if (localSubredditsMultiLabels && JSON.parse(localSubredditsMultiLabels).length) {
        subredditsMultiLabels.set(JSON.parse(localStorage.getItem('subredditsMultiLabels')))
      }
      localStorage.getItem('subredditCurrent', $subredditCurrent);
    }
    initializeState();
    if (!$subredditDefault) {
      subredditPick(undefined, 'all');
      // subredditPickerShow = true;
      ;
    };

  })

  // data
  let title = 'Reddit Micro';
  let isLoading = false;
  let settingsShow = false;
  let subredditPickerShow = false;

  let subredditContent = {};
  let postContent = {};
  let postAuthor = '';
  let currentContent = 'subreddit';

  const modalsHideAll = () => {
    settingsShow = false;
    subredditPickerShow = false;
  }

  const titleClicked = (event) => {
    if (currentContent === 'subreddit' && $subredditsPrevious.length) {
      modalsHideAll();
      subredditPick(undefined, $subredditsPrevious.slice(-1)[0]);
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

  // SubredditDetail
  const subredditPick = async (event, subreddit=undefined, count='', after='', sort='', t='') => {

    // if called via dispatch, pass the dispatched event's subreddit name to the 'subreddit' variable
    if (event && Object.keys(event).length) {
      subreddit = event.detail.subreddit;
      count = event.detail.count;
      after = event.detail.after;
    }

    let params = '';
    const paramConcat = () => params === '' ? p = '?' : p += '&';
    if (count) {
      paramConcat();
      params += `count=${count}`;
    }
    else if (after) {
      paramConcat();
      params += `after=${after}`;
    }
    else if (sort) {
      paramConcat();
      params += `sort=${sort}`;
    }
    else if (t) {
      paramConcat();
      params += `t=${t}`;
    }

    // if the user is attempting to navigate to the current page*, just do a quick loading animation
    // *only works if no query params are present
    if (!params && currentContent === 'subreddit' && $subredditCurrent && subreddit.toLowerCase() === $subredditCurrent.toLowerCase()) {
      currentContentIs('subreddit');
      return false;
    }


    try {
      window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
      isLoading = true;
      await fetch(`https://www.reddit.com/r/${subreddit}/${sort}.json${params}`)
      .then(response => {
        if (!response.ok) {
          statusMessageDisplay('We could not find the subreddit you requested.');
          isLoading = false;
          return false;
        }
        else return response.json()
        }
      )
      .then(data => {
        modalsHideAll();
        subredditContent = data; // assign response json to subredditContent
        subredditPickerClose(); // close the picker modal
        if ($subredditsPrevious.length && subreddit.toLowerCase() === $subredditsPrevious.slice(-1)[0].toLowerCase()) {
          // if the subreddit is the last-visited one, then remove it from the end of the subredditsPrevious array
          subredditsPrevious.pop();
        }
        if (currentContent !== undefined && $subredditCurrent !== undefined) {
          subredditsPrevious.push($subredditCurrent);
        }
        subredditCurrent.set(subreddit);
        // localStorage.setItem('subredditCurrent', $subredditCurrent);
        title = `/r/${$subredditCurrent}/`; // set the title
        subredditsRecent.add($subredditCurrent); // add the subreddit to recents
        currentContent = 'subreddit'; // update content view type
        isLoading = false; // disable the loading screen
      })
      .catch(err => {
        console.log('subredditPick(): Error - ' + err);
        statusMessageDisplay('We could not find the subreddit you requested.');
        isLoading = false
        return false;
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
      await fetch(`https://www.reddit.com${url}.json`)
      .then(res => res.json())
      .then(data => {
        modalsHideAll();
        postContent = data;
        postAuthor = post.data.author;
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
      timeout = 5000;
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

  const deleteme = () => {
    debugger;
  }

</script>

<div class="page-container"
     class:is-dark="{$darkModeActive}">
  <Navbar title="{title}"
          currentContent="{currentContent}"
          on:subreddit-picker-toggle="{subredditPickerToggle}"
          on:settings-toggle="{settingsToggle}"
          on:status-message-display="{receiveStatusMessageDisplay}"
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
