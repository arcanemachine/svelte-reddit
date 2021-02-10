<script>
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  import { darkModeActive } from '../stores/';
  const dispatch = createEventDispatcher();
  export let message;
</script>

<div class="has-background-info has-text-white status-message"
        on:click="{() => dispatch('status-message-clear')}"
        transition:fade>
  {message}
</div>

<style>
.status-message {
  position: fixed;
  font-size: 1.2rem;
  text-align: center;
  cursor: pointer;
  top: 5rem;
  margin-left: auto;
  max-width: 20rem;
  padding: 1rem;
  border-radius: 0.5rem;
  z-index: 100;
}
</style>
