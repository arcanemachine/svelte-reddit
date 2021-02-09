import { writable } from 'svelte/store';

export const darkModeActive = writable(false);
export const fontSize = writable(16);
export const thumbnailsDisabled = writable(false);
export const voteCountDisabled = writable(false);
