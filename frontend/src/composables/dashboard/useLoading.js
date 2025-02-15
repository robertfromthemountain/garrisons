// src/composables/useLoading.js
import { ref } from 'vue';

/**
 * A useLoading composable célja, hogy egy központi, globális loading állapotot kezeljen,
 * amelyet az alkalmazás bármely komponense használhat.
 *
 * @returns {Object} - Egy objektum, amely tartalmazza:
 *   - loading: A reaktív loading állapot.
 *   - startLoading: Függvény a loading true értékre állításához.
 *   - stopLoading: Függvény a loading false értékre állításához.
 *   - toggleLoading: Opcionális függvény, amely váltogatja a loading állapotot.
 */
const loading = ref(false);

function startLoading() {
  loading.value = true;
}

function stopLoading() {
  loading.value = false;
}

function toggleLoading() {
  loading.value = !loading.value;
}

export function useLoading() {
  return { loading, startLoading, stopLoading, toggleLoading };
}
