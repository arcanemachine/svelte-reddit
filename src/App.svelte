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

  // onMount
  onMount(() => {
    // subredditPick(undefined, 'Pine64Official');
  })

  // data
  let title = 'Micro Reddit Client';
  let isLoading = false;
  let settingsShow = true;
  let subredditPickerShow = false;

  let subredditContent = mockedSubredditData;
  let postContent = mockedPostData;
  // let subredditContent;
  // let postContent;
  let postAuthor = '';
  let currentContent = 'post';

  function titleClicked() {
    console.log('outer: titleClicked()');
    if (currentContent === 'post') {
      currentContentIs('subreddit');
    }
  }

  function currentContentIs(x) {
    isLoading = true;
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
    setTimeout(() => {currentContent = undefined}, 200);
    setTimeout(() => {
      currentContent = x;
      isLoading = false;
    }, 200)
  }

  const settingsToggle = () => {
    ;
  }
  const subredditPickerClose = () => {
    console.log('subredditPickerClose()');
    subredditPickerShow = false;
    document.querySelector('html').style.overflowY = 'auto';
  }
  const subredditPickerToggle = () => {
    console.log('subredditPickerToggle()');
    subredditPickerShow = !subredditPickerShow;
    document.querySelector('html').style.overflowY = subredditPickerShow ? 'hidden' : 'default';
  }
  const subredditPick = async (event, subreddit=undefined, sort='hot') => {
    if (event && Object.keys(event).length) {
      subreddit = event.detail.subreddit;
    }
    console.log(`subredditPick(), ${subreddit}`);
    try {
      isLoading = true;
      await fetch(`https://i.reddit.com/r/${subreddit}/${sort}.json`)
      .then(res => res.json())
      .then(data => {
        subredditPickerToggle(false);
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
    console.log(`postPick(), ${url}`);
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
  <footer class="mt-4 py-4 footer-container">
    <div class="has-text-centered">
      <div>
        <a href="https://github.com/arcanemachine/svelte-reddit/">
          <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50"><path fill-rule="evenodd" clip-rule="evenodd" fill="#181616" d="M25 10c-8.3 0-15 6.7-15 15 0 6.6 4.3 12.2 10.3 14.2.8.1 1-.3 1-.7v-2.6c-4.2.9-5.1-2-5.1-2-.7-1.7-1.7-2.2-1.7-2.2-1.4-.9.1-.9.1-.9 1.5.1 2.3 1.5 2.3 1.5 1.3 2.3 3.5 1.6 4.4 1.2.1-1 .5-1.6 1-2-3.3-.4-6.8-1.7-6.8-7.4 0-1.6.6-3 1.5-4-.2-.4-.7-1.9.1-4 0 0 1.3-.4 4.1 1.5 1.2-.3 2.5-.5 3.8-.5 1.3 0 2.6.2 3.8.5 2.9-1.9 4.1-1.5 4.1-1.5.8 2.1.3 3.6.1 4 1 1 1.5 2.4 1.5 4 0 5.8-3.5 7-6.8 7.4.5.5 1 1.4 1 2.8v4.1c0 .4.3.9 1 .7 6-2 10.2-7.6 10.2-14.2C40 16.7 33.3 10 25 10z"/></svg>
        </a>
      </div>
      <div>Made with <a href="https://svelte.dev/">Svelte</a>.</div>
      <div>Licensed freely under <a href="https://mit-license.org/">MIT License</a>.</div>
      <div class="mt-4">This service is not affiliated with Reddit Inc.</div>
    </div>
  </footer>
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
  margin-top: 4rem;
  flex-grow: 1;
}

.footer-container {
  margin-top: 2rem;
  padding-top: 0.5rem;
  background-color: #ddd;
  width: 100%;
}
</style>
