<script>
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  import { darkModeActive } from '../stores/';
  const dispatch = createEventDispatcher();
  export let message;
</script>

<div class="status-message-container">
  <button class="button is-info status-message"
          on:click="{() => dispatch('status-message-clear')}"
          transition:fade>{message}</button>
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
  margin-top: 5rem;
  padding: 1.5rem;
  font-size: 1.2rem;
  align-self: flex-start;
  overflow: break-word;
  border-radius: 0.5rem;
}
</style>
