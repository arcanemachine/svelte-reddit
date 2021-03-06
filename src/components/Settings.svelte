<script>
  import { createEventDispatcher, onDestroy } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { darkModeActive, fontSize } from '../stores/';

  const dispatch = createEventDispatcher();

  // font size
  let htmlRootEl = document.querySelector('html');
  let fontSizeDefault = 16;
  let fontSizeMin = 8;
  let fontSizeMax = 24;
  let fontSizeResetTimeout = undefined;
  let settingsResetTimeout = undefined;
  $: fontSizeDisplay = ($fontSize - fontSizeDefault) * 2;

  // modals
  let exportModalShow = false;
  let jsonSaverModalShow = false;

  const fontSizeUpdate = (crement) => {
    let fontSizeCurrent = $fontSize;
    if (crement === 0) {
      return false;
    }
    // if the font is within the allowable range, adjust it accordingly
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

  const fontSizeResetMessage = () => {
    clearTimeout(fontSizeResetTimeout);
    fontSizeResetTimeout = setTimeout(() => {
      dispatch('status-message-display', "Double click the font number to reset the font size.")
    }, 1000)
  }
  const fontSizeReset = () => {
    clearTimeout(fontSizeResetTimeout);
    if ($fontSize !== fontSizeDefault) {
      fontSize.set(fontSizeDefault);
      htmlRootEl.style.fontSize = `${$fontSize}px`;
      localStorage.removeItem('fontSize');
      dispatch('status-message-display', "Font size reset");
    }
  }

  // export settings
  const exportModalToggle = () => exportModalShow = !exportModalShow;

  // reset settings
  const settingsAllShow = () => {
    if (!Object.entries(localStorage).length) {
      alert('There are no saved settings on this device.\n\n');
    }
    else {
      let message = 'The following settings are saved on this device:\n\n';
      let entries = Object.entries(localStorage);

      for (let i = 0; i < entries.length; i++) {
        message += `${entries[i][0]}: ${entries[i][1]}\n\n`;
      }
      alert(message);
    }
  }
  const settingsResetMessage = () => {
    clearTimeout(settingsResetTimeout);
    settingsResetTimeout = setTimeout(() => {
      dispatch('status-message-display', "Double click the reset button to reset all saved settings.\n\n")
    }, 1000)
  }
  const settingsReset = () => {
    clearTimeout(settingsResetTimeout);
    if (confirm("Are you sure you want to clear all your settings?\n\nThe page will be reloaded and no local history of your usage will remain.\n\n")) {
      localStorage.clear();
      window.location.reload();
    }
  }

  // toggles
  const darkModeToggle = () => {
    if (!localStorage.getItem('darkModeActive')) {
      localStorage.setItem('darkModeActive', true);
      darkModeActive.set(true);
      dispatch('status-message-display', "Dark mode enabled");
    } else {
      localStorage.removeItem('darkModeActive');
      darkModeActive.set(false);
      dispatch('status-message-display', "Dark mode disabled");
    }
    dispatch('dark-mode-toggled');
  }

  // export settings
  const localStorageBackup = () => {
    let result = {}
    let entries = Object.entries(localStorage);
    for (let i = 0; i < entries.length; i++) {
      result[entries[i][0]] = JSON.parse(entries[i][1]);
    }
    return result;
  }

  const copySettingsToClipboard = () => {
    let text = JSON.stringify(localStorageBackup(), null, 2);
    var textArea = document.createElement("textarea");

    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = 0;
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';

    textArea.value = text;

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      var successful = document.execCommand('copy');
      if (successful) {
        dispatch('status-message-display', "Your settings have been copied to the system clipboard.")
      } else {
        dispatch('status-message-display', "Your settings were not copied to the system clipboard.")
      }
    } catch (err) {
      console.log('We were unable to copy your settings to the clipboard.');
    }
    document.body.removeChild(textArea);
  }

  const saveTemplateAsFile = (filename, jsonToWrite) => {
      const blob = new Blob([jsonToWrite], { type: "text/json" });
      const link = document.createElement("a");

      link.download = filename;
      link.href = window.URL.createObjectURL(blob);
      link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");

      const evt = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
      });

      link.dispatchEvent(evt);
  };
  
  // JsonSaver
  const jsonSaverStatusMessageDescription = () => {
    dispatch('status-message-display', "JSONSaver is a free service that allows you to easily (and securely) backup JSON snippets, such as your Reddit Micro settings.", 15000);
  }

  const jsonSaverModalToggle = () => {
    return false;    
  }

  let jsonSaverForm = {
    email: 'a@b.com',
    password1: 'password',
    password2: 'password'
  }
  let jsonSaverResult = undefined;

  const jsonSaverFormSubmit = async() => {
    let form = jsonSaverForm;
    let loginButton = document.querySelector('#jsonsaver-button-submit');
    loginButton.classList.add('is-loading');

    // if passwords don't match, display error message
    if (form.password1 !== form.password2) {
      dispatch('status-message-display', "The passwords do not match.", 15000);
    }
    else if (form.password1.length < 8) {
      dispatch('status-message-display', "Passwords must be 8 characters or more.", 15000);
    }
    // send info to jsonSaver
    let url = 'http://jsonsaver.com/api/v1/save/';
    try {
      loginButton.classList.add('is-loading');
      jsonSaverResponse = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      })
      .then(response => {
        if (!response.ok) {
          console.log(`Error  - jsonSaverFormSubmit(): (${response.status})`);
        }
        return response.json()
      })
    }
    catch(err) {
      console.log(`Error - jsonSaverFormSubmit(): ${err.message}`);
    }
    loginButton.classList.remove('is-loading');
  }


</script>

<div class="modal is-active" transition:fade>
  <div class="modal-background" on:click="{() => dispatch('settings-close')}"></div>
  <div class="modal-content"></div>
  <div class="card"
       class:is-dark="{$darkModeActive}">
    <div class="has-text-centered card-content">
      <div class="close-button-top-container" on:click="{() => dispatch('settings-close')}">
        <button class="delete close-button-top" aria-label="close"></button>
      </div>

      <div class="card-title"
             class:is-dark="{$darkModeActive}">
        <h3 class="card-text">Settings</h3>
      </div>

      <div class="settings-category-name">
        Appearance
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
                    on:click="{fontSizeResetMessage}"
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

      <div class="settings-category-name">
        Manage Your Data
      </div>

      <div class="settings-item-container-parent">
        <div class="settings-item-container-name"
             class:is-dark="{$darkModeActive}">
          <div class="settings-item-name">
            Export settings
            <svg class="ml-1 bi bi-question-circle cursor-url"
               on:click="{() => {dispatch('status-message-display', `Backup your data for safe keeping, or for viewing on another device.`)}}"
              xmlns="http://www.w3.org/2000/svg"
              width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
            </svg>
          </div>
        </div>
        <div class="settings-item-container-widget">
          <button class="button is-info border-none"
                  on:click="{exportModalToggle}">
            Export
          </button>
        </div>
      </div>

      <div class="settings-item-container-parent">
        <div class="settings-item-container-name"
             class:is-dark="{$darkModeActive}">
          <div class="settings-item-name">
            Reset Settings
            <!-- icon question circle -->
            <svg class="ml-1 bi bi-question-circle cursor-url"
              on:click="{settingsAllShow}"
              xmlns="http://www.w3.org/2000/svg"
              width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
            </svg>
          </div>
        </div>
        <div class="settings-item-container-widget">
          <button class="button is-info border-none"
                  on:click="{settingsResetMessage}"
                  on:dblclick="{settingsReset}">
            Reset
          </button>
        </div>
      </div>

      <button on:click="{() => dispatch('settings-close')}" class="button is-info is-large is-fullwidth close-button-bottom">Close</button>

      {#if exportModalShow}
          <div class="modal is-active" transition:fade>
            <div class="modal-background" on:click="{() => exportModalShow = false}"></div>
            <div class="modal-content"></div>
            <div class="card"
                 class:is-dark="{$darkModeActive}"
                 in:fly>
              <div class="has-text-centered card-content">
                <div class="close-button-top-container" on:click="{() => exportModalShow = false}">
                  <button class="delete close-button-top" aria-label="close"></button>
                </div>

                <div class="card-title"
                       class:is-dark="{$darkModeActive}">
                  <h3 class="card-text">
                    Export Settings
                  </h3>
                </div>

                <div class="card-text card-description"
                     class:is-dark="{$darkModeActive}">
                  Please choose your desired method of exporting your settings.
                </div>

                <div class="has-text-centered settings-item-container-parent">
                  <div class="settings-item-container-name"
                       class:is-dark="{$darkModeActive}">
                    <div class="settings-item-name">Raw JSON</div>
                  </div>
                  <div class="settings-item-container-widget">
                    <button class="button is-info button-icon"
                            on:click="{copySettingsToClipboard}">
                      <!-- copy icon -->
                      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="16" height="16">
                        <path d="M0 0h24v24H0z" fill="none"/>
                        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                      </svg>
                    </button>
                    <button class="ml-1 button is-info button-icon"
                            on:click="{() => saveTemplateAsFile('settings.json', JSON.stringify(localStorageBackup(), null, 2))}">
                      <!-- download icon -->
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                        <path d="M5,20h14v-2H5V20z M19,9h-4V3H9v6H5l7,7L19,9z"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="has-text-centered settings-item-container-parent">
                  <div class="settings-item-container-name"
                       class:is-dark="{$darkModeActive}">
                    <div class="settings-item-name">
                      Save to jsonSaver
                      <!-- icon question circle -->
                      <svg class="ml-1 bi bi-question-circle cursor-url"
                           on:click="{jsonSaverStatusMessageDescription}"
                        xmlns="http://www.w3.org/2000/svg"
                        width="15" height="15" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                      <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
                      </svg>
                    </div>
                  </div>
                  <div class="settings-item-container-widget">
                    <button class="button is-info button-icon"
                            on:click="{() => jsonSaverModalShow = true}">
                      Save
                    </button>
                  </div>
                </div>

                <button class="button is-info is-large is-fullwidth close-button-bottom"
                        on:click="{() => exportModalShow = false}">
                  Close
                </button>
              </div>
            </div>
          </div>
        {#if jsonSaverModalShow}
          <div class="modal is-active" transition:fade>
            <div class="modal-background" on:click="{() => jsonSaverModalShow = false}"></div>
            <div class="modal-content"></div>
            <div class="card"
                 class:is-dark="{$darkModeActive}">
              <div class="has-text-centered card-content">
                <div class="close-button-top-container" on:click="{() => jsonSaverModalShow = false}">
                  <button class="delete close-button-top" aria-label="close"></button>
                </div>

                <div class="card-title"
                     class:is-dark="{$darkModeActive}">
                  <h3 class="card-text">
                    Save to jsonSaver
                  </h3>
                </div>

                <form method="post">
                  <div class="field">
                    <div class="control">
                      <input type="email" disabled
                             id="login-input-email"
                             class="input is-large form-element"
                             on:click="{e => e.key === 'Enter' && jsonSaverFormSubmit()}"
                             bind:value="{jsonSaverForm.email}"
                             placeholder="Email"
                             required>
                    </div>
                    <div class="control">
                      <input type="password" disabled
                             id="login-input-password"
                             class="input is-large form-element"
                             on:click="{e => e.key === 'Enter' && jsonSaverFormSubmit()}"
                             bind:value="{jsonSaverForm.password1}"
                             placeholder="Password"
                             required>
                    </div>
                    <div class="control">
                      <input type="password" disabled
                             on:click="{e => e.key === 'Enter' && jsonSaverFormSubmit()}"
                             bind:value="{jsonSaverForm.password2}"
                             id="login-input-password"
                             class="input is-large form-element"
                             placeholder="Confirm password"
                             required>
                    </div>
                  </div>
                  <button type="submit"
                          id="jsonsaver-button-submit"
                          on:click|preventDefault="{jsonSaverFormSubmit}"
                          class="button is-secondary is-large is-disabled form-element">Coming Soon</button>
                </form>

              </div>
            </div>
          </div>
        {/if}
      {/if}
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
  width: 30rem;
  max-width: 95vw;
  border-radius: 0.5rem;
}

.card.is-dark {
  background: #111;
  border: 1px solid white !important;
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

.card-title {
  font-size: 2rem;
  margin: 0.5rem auto 1rem;
  padding-left: 1rem;
}

.card-description {
  margin: 0.5rem auto 2rem;
  font-size: 1.1rem;
}

.card-title.is-dark {
  color: whitesmoke;
}

.card-text.is-dark {
  color: whitesmoke;
}

.close-button-top {
  padding: 0.75rem;
}

.settings-category-name {
  font-style: italic;
  margin: 0.5rem auto;
}

.settings-item-container-parent {
  display: flex;
  margin-top: 1rem;
  margin-bottom: 1.5rem;
  flex-direction: row;
  align-items: center;
  justify-content: stretch;
}

.settings-item-container-name {
  display: flex;
  width: 66%;
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
  padding-top: 0.2rem;
  font-size: 1.2rem;
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

/* jsonSaver */
.form-element {
	width: 80%;
	max-width: 40rem;
	margin: 0.5rem 2rem;
}

::placeholder {
  color: #444;
}

</style>
