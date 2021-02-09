<script>
  let sDarkMode = true;
</script>

<footer class="mt-4 py-4 footer-container"
        class:is-dark="{sDarkMode}">
  <div class="has-text-centered">
    <div>
      <a href="https://github.com/arcanemachine/svelte-reddit/">
        <svg xmlns="http://www.w3.org/2000/svg"
             width="50" height="50">
          <path fill-rule="evenodd"
                clip-rule="evenodd"
                fill="#181616" 
                class:is-dark="{sDarkMode}"
                d="M25 10c-8.3 0-15 6.7-15 15 0 6.6 4.3 12.2 10.3 14.2.8.1 1-.3 1-.7v-2.6c-4.2.9-5.1-2-5.1-2-.7-1.7-1.7-2.2-1.7-2.2-1.4-.9.1-.9.1-.9 1.5.1 2.3 1.5 2.3 1.5 1.3 2.3 3.5 1.6 4.4 1.2.1-1 .5-1.6 1-2-3.3-.4-6.8-1.7-6.8-7.4 0-1.6.6-3 1.5-4-.2-.4-.7-1.9.1-4 0 0 1.3-.4 4.1 1.5 1.2-.3 2.5-.5 3.8-.5 1.3 0 2.6.2 3.8.5 2.9-1.9 4.1-1.5 4.1-1.5.8 2.1.3 3.6.1 4 1 1 1.5 2.4 1.5 4 0 5.8-3.5 7-6.8 7.4.5.5 1 1.4 1 2.8v4.1c0 .4.3.9 1 .7 6-2 10.2-7.6 10.2-14.2C40 16.7 33.3 10 25 10z"/>
        </svg>
      </a>
    </div>
    <div>Made with <a href="https://svelte.dev/">Svelte</a>.</div>
    <div>Licensed freely under <a href="https://mit-license.org/">MIT License</a>.</div>
    <div class="mt-4">This service is not affiliated with Reddit Inc.</div>
  </div>
</footer>

<style>
.footer-container {
  background-color: #ddd;
  width: 100%;
}

.footer-container.is-dark {
  background: #111;
  color: whitesmoke;
}

path.is-dark {
  fill: whitesmoke;
}
</style>
