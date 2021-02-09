<script>
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  import { darkModeActive } from '../stores/';
  const dispatch = createEventDispatcher();
  export let message;
</script>

<div class="status-message-container">
  <div class="has-background-info has-text-white status-message"
          on:click="{() => dispatch('status-message-clear')}"
          transition:fade>{message}</div>
</div>

<style>
.status-message-container {
  position: fixed;
  display: flex;
  width: 100vw;
  top: 0;
  left: 0;
  justify-content: center;
  z-index: 100;
}

.status-message {
  max-width: 20rem;
  margin-top: 5rem;
  padding: 1rem;
  font-size: 1.2rem;
  cursor: pointer;
  text-align: center;
  border-radius: 0.5rem;
}
</style>
