<script>
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';

  const dispatch = createEventDispatcher();

  // data
  let htmlRootEl = document.querySelector('html');
  let fontSizeRootDefault = 16;
  let fontSizeRoot = htmlRootEl.style.fontSize ? Number(htmlRootEl.style.fontSize.match(/(\d*\.)?\d+/)[0]) : fontSizeRootDefault;

  // declarations
  $: fontSizeDisplay = (fontSizeRoot - fontSizeRootDefault) * 2;

  // refs

  // methods
  const closeSettings = () => emitSettingsClose();
  const fontSizeUpdate = (index) => {
    if (Math.abs(index + fontSizeDisplay) <= 16) {
      fontSizeRoot += index;
      htmlRootEl.style.fontSize = `${fontSizeRoot}px`;
      if (fontSizeRoot !== fontSizeRootDefault) {
        localStorage.setItem('fontSize', fontSizeRoot);
      }
      else if (fontSizeRoot === fontSizeRootDefault) {
        localStorage.removeItem('fontSize');
      }
    }
    // console.log(localStorage.getItem('fontSize'));
    // console.log(`amount: ${index}, actual: ${fontSizeRoot}, display: ${fontSizeDisplay}`);
  }
  const fontSizeReset = () => {
    fontSizeRoot = fontSizeRootDefault;
    htmlRootEl.style.fontSize = `${fontSizeRoot}px`;
    localStorage.removeItem('fontSize');
  }

  // events
  function emitSettingsClose(event) {dispatch('settings-close', event)}

</script>

<div class="modal is-active" transition:fade>
  <div class="modal-background" on:click="{closeSettings}"></div>
  <div class="modal-content"></div>
  <div class="card">
    <div class="card-content">
      <div class="button-close-container" on:click="{closeSettings}">
        <button class="delete button-close" aria-label="close"></button>
      </div>
      <div class="has-text-centered">
        <h3 class="is-size-3 card-text card-name has-text-decoration-underline">Settings</h3>
      </div>
      <div class="mt-6 has-text-centered settings-item-container">
        <div class="is-size-5 settings-item-name">Font Size</div>
        <div class="settings-item-value font-size-container">
          <button on:click="{() => fontSizeUpdate(-0.5)}" class="button font-size-button">-</button>
          <button on:click="{fontSizeReset}" class="button font-size-button-display">{fontSizeDisplay}</button>
          <button on:click="{() => fontSizeUpdate(+0.5)}" class="button font-size-button">+</button>
        </div>
      </div>
        <button on:click="{closeSettings}" class="mt-6 button is-info is-large is-fullwidth">Close</button>
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
  width: 2.5rem;
  border: 1px solid black;
}

.font-size-button-display {
  background-color: #eee;
  width: 3.5rem;
  margin: auto 0.5rem;
  text-align: center;
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

.button-close {
  padding: 0.5rem;
}

.card-name {
  margin-top: 0.5rem;
  padding-left: 1rem;
}
</style>
