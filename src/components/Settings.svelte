<script>
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';

  const dispatch = createEventDispatcher();

  // data
  let htmlRootEl = document.querySelector('html');
  let fontSizeRoot = htmlRootEl.style.fontSize ? Number(htmlRootEl.style.fontSize.match(/(\d*\.)?\d+/)[0]) : 16;

  // declarations
  $: fontSizeDisplay = (fontSizeRoot - 16) * 2;
  $: lsFontSize = localStorage.getItem('fontSize');

  // refs

  // methods
  const fontSizeUpdate = (index) => {
    if (Math.abs(index + fontSizeDisplay) <= 16) {
      fontSizeRoot += index;
      htmlRootEl.style.fontSize = `${fontSizeRoot}px`;
      localStorage.setItem('fontSize', fontSizeRoot);
    }
    console.log(`amount: ${index}, actual: ${fontSizeRoot}, display: ${fontSizeDisplay}`);
  }
  const closeButtonClicked = () => {
    emitSettingsClose();
  }

  // events
  function emitSettingsClose(event) {dispatch('settings-close', event)}

</script>

<div class="modal is-active" transition:fade>
  <div class="modal-background" on:click="{closeButtonClicked}"></div>
  <div class="modal-content"></div>
  <div class="card">
    <div class="card-content">
      <div class="button-close-container" on:click="{closeButtonClicked}">
        <button class="delete button-close" aria-label="close"></button>
      </div>
      <div class="has-text-centered">
        <h3 class="is-size-3 card-text card-name">Settings</h3>
      </div>
      <div class="mt-6 has-text-centered settings-item-container">
        <div class="is-size-5 settings-item-name">Font Size</div>
        <div class="settings-item-value font-size-container">
          <button on:click="{() => fontSizeUpdate(-0.5)}" class="button font-size-button">-</button>
          <input type="font" class="input font-size-input-text" bind:value="{fontSizeDisplay}" disabled>
          <button on:click="{() => fontSizeUpdate(+0.5)}" class="button font-size-button">+</button>
        </div>
      </div>
      <div class="settings-item-container">
        Font Size: {lsFontSize}
      </div>
    </div>
  </div>
</div>

<style>
.card {
  margin: 2rem;
  width: 20rem;
  max-width: 90vw;
}

.settings-item-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
}

.font-size-container {
  display: flex;
  max-width: 9rem;
  flex-direction: row;
  align-items: center;
}

.font-size-button {
  background-color: #ddd;
  width: 2rem;
  border: 1px solid black;
}

.font-size-input-text {
  background-color: #eee;
  width: 3.5rem;
  margin: auto 0.5rem;
  text-align: center;
  pointer-events: none;
  border: 1px solid black;
}

.button-close-container {
  display: flex;
  margin: -1rem;
  padding: 1rem;
  float: right;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
element {
}
.button-close {
  padding: 0.5rem;
}

.card-name {
  margin-top: 0.5rem;
  padding-left: 1rem;
}
</style>
