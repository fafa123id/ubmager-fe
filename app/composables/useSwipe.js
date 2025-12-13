export const useSwipe = () => {
  const startX = ref(0);
  const startY = ref(0);
  const endX = ref(0);
  const endY = ref(0);
  const swiping = ref(false);

  const SWIPE_THRESHOLD = 35; // px (boleh kamu naikkan 40-60 biar lebih "niat")
  const SWIPE_RESTRAINT = 80; // toleransi gerak arah lain

  function onTouchStart(e) {
    const t = e.touches[0];
    startX.value = t.clientX;
    startY.value = t.clientY;
    endX.value = t.clientX;
    endY.value = t.clientY;
    swiping.value = false;
  }

  function onTouchMove(e) {
    const t = e.touches[0];
    endX.value = t.clientX;
    endY.value = t.clientY;

    const dx = endX.value - startX.value;
    const dy = endY.value - startY.value;

    // kalau gerak sudah lumayan, anggap sedang swipe (buat blok click)
    if (Math.abs(dx) > 10 || Math.abs(dy) > 10) swiping.value = true;
  }

  function onTouchEnd(right, left, up = undefined, down = undefined) {
    const dx = endX.value - startX.value;
    const dy = endY.value - startY.value;

    // swipe horizontal
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_RESTRAINT) {
      if (dx > 0) {
        right();
      } else {
        left();
      }
      return;
    }

    if (up && down) {
      if (Math.abs(dy) > SWIPE_THRESHOLD && Math.abs(dx) < SWIPE_RESTRAINT) {
        if (dy > 0) down();
        else up();
      }
    }
  }

  function onClickGuard(e) {
    // kalau swipe terdeteksi, batalkan navigate NuxtLink
    if (swiping.value) {
      e.preventDefault();
      e.stopPropagation();
    }
  }
  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onClickGuard,
  };
};
