<template>
  <section>
    <div class="loader"></div>
  </section>
</template>

<script>
export default {};
</script>

<style scoped>
section { 
  display: flex;
  width: 100%;
  height: 100%;
  background-color: black;
}
.loader {
  margin: auto;
  width: 50px;
  aspect-ratio: 1.154;
  position: relative;
  background: conic-gradient(
    from 120deg at 50% 64%,
    #c73e3e00,
    #19aeff 1deg 120deg,
    #87868600 121deg
  );
  animation: l27-0 1.5s infinite cubic-bezier(0.3, 1, 0, 1);
}

.loader:before,
.loader:after {
  content: "";
  position: absolute;
  inset: 0;
  background: inherit;
  transform-origin: 50% 66%;
  animation: l27-1 1.5s infinite;
}

.loader:after {
  --s: -1;
}

@keyframes l27-0 {
  0%,
  30% {
    transform: rotate(0);
  }

  70% {
    transform: rotate(120deg);
  }

  70.01%,
  100% {
    transform: rotate(360deg);
  }
}

@keyframes l27-1 {
  0% {
    transform: rotate(calc(var(--s, 1) * 120deg)) translate(0);
  }

  30%,
  70% {
    transform: rotate(calc(var(--s, 1) * 120deg))
      translate(calc(var(--s, 1) * -5px), 10px);
  }

  100% {
    transform: rotate(calc(var(--s, 1) * 120deg)) translate(0);
  }
}
</style>
