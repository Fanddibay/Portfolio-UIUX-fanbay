/** sessionStorage flag: the preloader already played in this browser session.
 * Plain module (not 'use client') so the server layout can inline it in a script. */
export const PRELOADER_KEY = 'fb-preloader-seen';

/** Window event fired the moment the preloader curtain starts lifting, so the
 * hero can start its entrance in sync instead of animating unseen underneath. */
export const PRELOADER_EXIT_EVENT = 'fb:preloader-exit';
