<script>
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';

  const dispatch = createEventDispatcher();

  // close menu
  const closeSettings = () => emitSettingsClose();
  function emitSettingsClose(event) {dispatch('settings-close', event)}

  // font size
  let htmlRootEl = document.querySelector('html');
  let fontSizeRootDefault = 16;
  let fontSizeRoot = htmlRootEl.style.fontSize ? Number(htmlRootEl.style.fontSize.match(/(\d*\.)?\d+/)[0]) : fontSizeRootDefault
  $: fontSizeDisplay = (fontSizeRoot - fontSizeRootDefault) * 2;
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
  }
  const fontSizeReset = () => {
    fontSizeRoot = fontSizeRootDefault;
    htmlRootEl.style.fontSize = `${fontSizeRoot}px`;
    localStorage.removeItem('fontSize');
  }

  // dark mode
  let darkModeActive = false;
  const darkModeToggle = () => {darkModeActive = !darkModeActive;}


</script>

<div class="modal is-active" transition:fade>
  <div class="modal-background" on:click="{closeSettings}"></div>
  <div class="modal-content"></div>
  <div class="card">
    <div class="card-content">
      <div class="close-button-top-container" on:click="{closeSettings}">
        <button class="delete close-button-top" aria-label="close"></button>
      </div>
      <div class="has-text-centered card-title">
        <h3 class="card-text">Settings</h3>
      </div>
      <div class="has-text-centered settings-item-container-parent">
        <div class="settings-item-container-name">
          <div class="settings-item-name">Font Size</div>
        </div>
        <div class="settings-item-container-widget">
          <div class="settings-item-value font-size-container">
            <button class="button font-size-button"
                    on:click="{() => fontSizeUpdate(-0.5)}">
              -
            </button>
            <button class="button font-size-button-display"
                    on:dblclick="{fontSizeReset}">
              {fontSizeDisplay}
            </button>
            <button class="button font-size-button"
                    on:click="{() => fontSizeUpdate(+0.5)}">
              +
            </button>
          </div>
        </div>
      </div>
      <div class="settings-item-container-parent">
        <div class="settings-item-container-name">
          <div class="settings-item-name">Dark Mode</div>
        </div>
        <div class="settings-item-container-widget">
          <div on:click="{darkModeToggle}"
               class="button toggle-widget-backplate"
               class:is-info="{darkModeActive}">
            <div class="button toggle-widget-slider"
                 class:slider-is-off="{!darkModeActive}"
                 class:slider-is-on="{darkModeActive}">
            </div>
          </div>
        </div>
      </div>
        <button on:click="{closeSettings}" class="button is-info is-large is-fullwidth close-button-bottom">Close</button>
    </div>
  </div>
</div>

<style>

/* override bulma defaults */
.button {
  border: 1px solid black !important;
}

.card {
  margin: 2rem;
  width: 25rem;
  max-width: 90vw;
}

.card-title {
  font-size: 2rem;
  margin: 0.5rem auto 2rem;
  padding-left: 1rem;
}

.close-button-top-container {
  display: flex;
  margin: -1.25rem;
  padding: 1rem;
  float: right;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.close-button-top {
  padding: 0.75rem;
}

.settings-item-container-parent {
  display: flex;
  margin-bottom: 1.25rem;
  flex-direction: row;
  align-items: center;
  justify-content: stretch;
}

.settings-item-container-name {
  display: flex;
  width: 50%;
  align-self: flex-start;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.settings-item-container-widget {
  display: flex;
  width: 50%;
  align-self: flex-end;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.settings-item-name {
  font-size: 1.3rem;
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

.toggle-widget-backplate {
  width: 4rem;
  transition: background-color 0.5s;
  border: 1px solid black;
}

.toggle-widget-slider {
  width: 2.5rem;
  transition: margin 0.3s;
  border: 1px solid black;
}

.slider-is-off {
  margin-left: calc(-1.5em - 1px);
}

.slider-is-on {
  margin-right: calc(-1.5em - 1px);
}

.close-button-bottom {
  margin-top: 2.5rem;
}

/* a11y */
@media (prefers-reduced-motion: reduce) {
  .toggle-widget-backplate {
    transition: non;
  }

  .toggle-widget-slider {
    transition: non;
  }
}

</style>
