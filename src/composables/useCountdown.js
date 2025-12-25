import { ref } from 'vue'

import useStatus from './useStatus'
const { status, setStatus } = useStatus()

const expire = ref(null)

let interval, expireRes

function tick() {
  const countDownDate = new Date(`${expireRes}+00:00`).getTime()
  const now = new Date().getTime()
  const distance = countDownDate - now
  if (distance < 0) {
    clearInterval(interval)

    expire.value = null

    if (status.value.title !== 'Success') {
      setStatus('Expired', 'expired')
    }
    return
  }
  const days = Math.floor(distance / (1000 * 60 * 60 * 24))
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((distance % (1000 * 60)) / 1000)

  expire.value = (days > 0 ? `${days}d ` : ' ')
    + (hours > 0 ? `${hours}h ` : ' ')
    + (minutes > 0 ? `${minutes}m ` : ' ')
    + `${seconds}s`
}

/**
 * @param {number} aExpireRes initial expire estimation
 */
function countdown(aExpireRes) {
  clearInterval(interval)
  expireRes = aExpireRes
  tick()
  if (expire.value) {
    interval = setInterval(tick, 1000)
  }
}

export default function() {
  return {
    expire,
    countdown,
  }
}