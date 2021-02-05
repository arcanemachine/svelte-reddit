<script>
  import { fade } from 'svelte/transition';
</script>

<div class="modal is-active" transition:fade>
  <div class="modal-background"></div>
  <div class="button is-light is-loading"></div>
</div>

<style>
.button {
  width: 20vw;
  height: 20vw;
  font-size: 3rem;
  border-radius: 0.75rem;
}
</style>
