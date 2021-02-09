<script>
  import { fade } from 'svelte/transition';
  import { darkModeActive } from '../stores/';
</script>

<div class="modal is-active" transition:fade>
  <div class="modal-background"></div>
  <div class="button is-loading"
       class:is-light="{!darkModeActive}"
       class:is-dark="{$darkModeActive}"></div>
</div>

<style>
.button {
  width: 6rem;
  height: 6rem;
  font-size: 3rem;
  border-radius: 0.75rem;
}

.button.is-loading:after {
-webkit-animation: spinAround 750ms infinite linear;
        animation: spinAround 750ms infinite linear;
}
</style>
