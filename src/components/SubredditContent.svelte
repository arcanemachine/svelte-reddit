<script>
  // props
  export let content;

  // methods
  const getFormattedDate = (date) => {
    date = new Date(date*1000);
    return `${date.getFullYear()}/${date.getMonth()+1}/${date.getDay()}`;
  }
</script>

<div class="columns">
  {#if Object.keys(content).length}
    {#if console.log(content)}
    {/if}
    <div class="column">
      {#each content.data.children as post}
        <div class="media">
          <div class="media-left">
            <div class="img-container img is-64x64">
              {#if !post.data.thumbnail.match(/(self|default)/)}
              <img src="{post.data.thumbnail}"
                   height="64"
                   width="64"
                   alt="Post thumbnail">
              {:else}
              <svg xmlns="http://www.w3.org/2000/svg"
                   width="64" height="64"
                   fill="currentColor"
                   class="bi bi-camera-fill"
                   viewBox="0 0 16 16">
                <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z"/>
              </svg> 
              {/if}
              <div class="has-text-centered">{getFormattedDate(post.data.created)}</div>
            </div>
          </div>
          <div class="ml-3 media-content">
            <div class="content">
              <div class="mt-3 level">
                <div>
                  <div class="mb-4 post-link-name">{post.data.title} - [{post.data.domain}]</div>
                  <div class="post-description">
                    {post.data.selftext}
                  </div>
                </div>
                <div class="mt-3 p-3 post-link-comments">{post.data.num_comments} comments</div>
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .post-link-name {
    font-weight: bold;
    text-overflow: ellipsis;
  }

  .post-description {
    max-width: 60vw;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    float: left;
  }

  .post-link-comments {
    margin-top: 2rem;
    max-width: 10rem;
  }
</style>
