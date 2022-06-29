<template>
  <div class="lds">
    <div v-for="index in 12" :key="index" class="lds__elem"></div>
  </div>
</template>

<style scoped>
.lds {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}

.lds .lds__elem {
  position: absolute;
  width: 6px;
  height: 6px;
  background: #5d8ab9;
  border-radius: 50%;
  animation: lds 1.2s linear infinite;
}

.lds .lds__elem:nth-child(1) {
  animation-delay: 0s;
  top: 37px;
  left: 66px;
}

.lds .lds__elem:nth-child(2) {
  animation-delay: -0.1s;
  top: 22px;
  left: 62px;
}

.lds .lds__elem:nth-child(3) {
  animation-delay: -0.2s;
  top: 11px;
  left: 52px;
}

.lds .lds__elem:nth-child(4) {
  animation-delay: -0.3s;
  top: 7px;
  left: 37px;
}

.lds .lds__elem:nth-child(5) {
  animation-delay: -0.4s;
  top: 11px;
  left: 22px;
}

.lds .lds__elem:nth-child(6) {
  animation-delay: -0.5s;
  top: 22px;
  left: 11px;
}

.lds .lds__elem:nth-child(7) {
  animation-delay: -0.6s;
  top: 37px;
  left: 7px;
}

.lds .lds__elem:nth-child(8) {
  animation-delay: -0.7s;
  top: 52px;
  left: 11px;
}

.lds .lds__elem:nth-child(9) {
  animation-delay: -0.8s;
  top: 62px;
  left: 22px;
}

.lds .lds__elem:nth-child(10) {
  animation-delay: -0.9s;
  top: 66px;
  left: 37px;
}

.lds .lds__elem:nth-child(11) {
  animation-delay: -1s;
  top: 62px;
  left: 52px;
}

.lds .lds__elem:nth-child(12) {
  animation-delay: -1.1s;
  top: 52px;
  left: 62px;
}

@keyframes lds {
  0%, 20%, 80%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5);
  }
}
</style>
