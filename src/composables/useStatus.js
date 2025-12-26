import { ref } from 'vue'

const status = ref({ title: 'Loading' })

/**
 * @param {string} title 
 * @param {string} description 
 */
function setStatus(title, description) {
  status.value = {
    title,
    description,
  }
}

export default function() {
  return {
    status,
    setStatus,
  }
}