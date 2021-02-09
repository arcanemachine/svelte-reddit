<script>
  import { createEventDispatcher, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';
  import { darkModeActive, fontSize } from '../stores/';

  const dispatch = createEventDispatcher();

  // font size
  let htmlRootEl = document.querySelector('html');
  let fontSizeDefault = 16;
  let fontSizeMin = 8;
  let fontSizeMax = 24;
  // check for modified font size, or use 16px if the font size has not been adjusted
  $: fontSizeDisplay = ($fontSize - fontSizeDefault) * 2;

  const fontSizeUpdate = (crement) => {
    let fontSizeCurrent = $fontSize;
    if (crement === 0) {
      return false;
    }
    if (crement < 0 && $fontSize + crement >= fontSizeMin || crement > 0 && $fontSize + crement <= fontSizeMax) {
      fontSizeCurrent += crement;
      htmlRootEl.style.fontSize = `${fontSizeCurrent}px`;
      if (fontSizeCurrent !== fontSizeDefault) {
        localStorage.setItem('fontSize', fontSizeCurrent);
        fontSize.set(fontSizeCurrent);
      }
      else if (fontSizeCurrent === fontSizeDefault) {
        localStorage.removeItem('fontSize');
        fontSize.set(fontSizeCurrent, fontSizeDefault);
      }
    }
    fontSizeDisplay = ($fontSize - fontSizeDefault) * 2;
  }
  const fontSizeReset = () => {
    if ($fontSize !== fontSizeDefault) {
      fontSize.set(fontSizeDefault);
      htmlRootEl.style.fontSize = `${$fontSize}px`;
      localStorage.removeItem('fontSize');
      dispatch('status-message-display', "Font size reset");
    }
  }

  // dark mode
  const darkModeToggle = () => {
    if (!localStorage.getItem('darkModeActive')) {
      localStorage.setItem('darkModeActive', true);
      darkModeActive.set(true);
    } else {
      localStorage.removeItem('darkModeActive');
      darkModeActive.set(false);
    }
    dispatch('dark-mode-toggled');
  }

</script>

<div class="modal is-active" transition:fade>
  <div class="modal-background" on:click="{() => dispatch('settings-close')}"></div>
  <div class="modal-content"></div>
  <div class="card"
       class:is-dark="{$darkModeActive}">
    <div class="card-content">
      <div class="close-button-top-container" on:click="{() => dispatch('settings-close')}">
        <button class="delete close-button-top" aria-label="close"></button>
      </div>
      <div class="has-text-centered card-title"
             class:is-dark="{$darkModeActive}">
        <h3 class="card-text">Settings</h3>
      </div>
      <div class="has-text-centered settings-item-container-parent">
        <div class="settings-item-container-name"
             class:is-dark="{$darkModeActive}">
          <div class="settings-item-name">Font Size</div>
          <div class="settings-item-name-secondary"><!-- {$fontSize} --></div>
        </div>
        <div class="settings-item-container-widget">
          <div class="settings-item-value font-size-container">
            <button class="button font-size-button font-size-button-left"
                    class:is-disabled="{$fontSize <= fontSizeMin ? true : false}"
                    on:click="{() => fontSizeUpdate(-0.5)}">
              -
            </button>
            <button class="button font-size-button-display"
                    class:is-light="{fontSizeDisplay === 0}"
                    class:is-info="{fontSizeDisplay !== 0}"
                    on:dblclick="{fontSizeReset}">
              {fontSizeDisplay}
            </button>
            <button class="button font-size-button font-size-button-right"
                    class:is-disabled="{$fontSize >= fontSizeMax ? true : false}"
                    on:click="{() => fontSizeUpdate(+0.5)}">
              +
            </button>
          </div>
        </div>
      </div>
      <div class="settings-item-container-parent">
        <div class="settings-item-container-name"
             class:is-dark="{$darkModeActive}">
          <div class="settings-item-name">Dark Mode</div>
          <div class="settings-item-name-secondary"><!-- {$darkModeActive} --></div>
        </div>
        <div class="settings-item-container-widget">
          <div on:click="{darkModeToggle}"
               class="button toggle-widget-backplate"
               class:is-light="{!$darkModeActive}"
               class:is-info="{$darkModeActive}">
            <div class="button toggle-widget-slider"
                 class:slider-is-off="{!$darkModeActive}"
                 class:slider-is-on="{$darkModeActive}">
            </div>
          </div>
        </div>
      </div>
      <button on:click="{() => dispatch('settings-close')}" class="button is-info is-large is-fullwidth close-button-bottom">Close</button>
    </div>
  </div>
</div>

<style>

.button {
  border: 1px solid black !important;
  border-radius: 0.5rem;
}

.card {
  margin: 2rem;
  width: 25rem;
  max-width: 90vw;
}

.card.is-dark {
  background: #111;
}

.card-title {
  font-size: 2rem;
  margin: 0.5rem auto 2rem;
  padding-left: 1rem;
}

.card-title.is-dark {
  color: whitesmoke;
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
  margin-bottom: 1.75rem;
  flex-direction: row;
  align-items: center;
  justify-content: stretch;
}

.settings-item-container-name {
  display: flex;
  width: 50%;
  align-self: flex-start;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.settings-item-container-name.is-dark {
  color: whitesmoke;
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

.settings-item-name-secondary {
  font-size: 0.8rem;
}

.font-size-container {
  display: flex;
  max-width: 9rem;
  flex-direction: row;
  align-items: center;
}

.font-size-button {
  width: 2.5rem;
  border: 1px solid black;
}

.font-size-button-left {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.font-size-button-display {
  width: 3.5rem;
  margin: auto -1px;
  text-align: center;
  border: 1px solid black;
  border-radius: 0;
  transition: background 0.3s !important;
  transition: color 0.3s;
}

.font-size-button-right {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.toggle-widget-backplate {
  width: 4.5rem;
  transition: background 0.5s;
  border: 1px solid black;
}

@media (prefers-reduced-motion: reduce) {
  .toggle-widget-backplate {
    transition: none;
  }

  .toggle-widget-slider {
    transition: none;
  }
}

.toggle-widget-slider {
  width: 2.5rem;
  transition: margin 0.3s;
  border: 1px solid black;
}

.slider-is-off {
  margin-left: calc(-2em - 1px);
}

.slider-is-on {
  margin-right: calc(-2em - 1px);
}

.close-button-bottom {
  margin-top: 2.5rem;
  border: none !important;
  border-radius: 0.25rem;
}
</style>
