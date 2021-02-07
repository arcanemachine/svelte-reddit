<script>
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';

  const dispatch = createEventDispatcher();

  // data

  // refs

  // methods
  const fontSizeUpdate = (index) => {
    console.log(index);
  }
  const settingsClosed = () => {
    emitSettingsClose();
  }

  // events
  function emitSettingsClose(event) {dispatch('settings-close', event)}

</script>

<div class="modal is-active" transition:fade>
  <div class="modal-background"></div>
  <div class="modal-content"></div>
    <div class="card">
      <div class="card-content">
        <button class="p-3 delete"
                on:click="{settingsClosed}"
                aria-label="close"></button>
        <div class="has-text-centered">
          <h3 class="is-size-3 card-text">Settings</h3>
        </div>
        <div class="mt-5 has-text-centered">
          <div class="is-size-4">Text Size</div>
          <div class="text-size-container">
            <button on:click="{fontSizeUpdate(-1)}" class="button cart-quantity-button">-</button>
            <input type="text" class="input cart-quantity-text" disabled>
            <button on:click="{fontSizeUpdate(+1)}" class="button cart-quantity-button">+</button>
          </div>
        </div>
      </div>
    </div>
</div>

<style>
.card {
  margin: 2rem;
  width: 20rem;
}

.delete {
  float: right;
}

.card-text {
  margin-top: 1.5rem;
}
</style>
