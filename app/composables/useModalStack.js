import { ref, reactive, readonly } from "vue"; // Import readonly

// State global untuk semua modal
const baseZ = 1000;
const stack = ref([]); // Array ID modal yang terbuka, urutan terakhir = paling atas
const zMap = reactive({}); // Map ID modal ke nilai z-index-nya
let scrollLockCount = 0; // Counter sederhana untuk body lock

// Fungsi internal untuk update z-index berdasarkan urutan stack
function refreshZ() {
    stack.value.forEach((id, idx) => {
        // Setiap modal baru akan 10 unit lebih tinggi
        zMap[id] = baseZ + (idx + 1) * 10;
    });
}

// Fungsi internal untuk lock/unlock scroll body
function lockBody() {
    // Hanya lock jika ada modal yang terbuka
    document.body.style.overflow = scrollLockCount > 0 ? "hidden" : "";
}

// Composable function
export function useModalStack() {
    function open(id) {
        // Cek dulu apakah ID sudah ada
        const idx = stack.value.indexOf(id);
        if (idx !== -1) {
            // Jika sudah ada, pindahkan ke depan saja (sama seperti bringToFront)
            bringToFront(id);
            return; // Tidak perlu increment scrollLockCount lagi
        }

        // Jika ID baru, tambahkan ke stack
        stack.value.push(id);
        scrollLockCount++; // Hanya increment jika modal baru dibuka
        refreshZ();
        lockBody();
    }

    function close(id) {
        const idx = stack.value.indexOf(id);
        if (idx !== -1) {
            stack.value.splice(idx, 1);
            delete zMap[id]; // Hapus dari map
            scrollLockCount = Math.max(0, scrollLockCount - 1); // Pastikan tidak negatif
            refreshZ(); // Hitung ulang Z untuk yang tersisa
            lockBody();
        }
    }

    function bringToFront(id) {
        const idx = stack.value.indexOf(id);
        // Hanya pindahkan jika ada dan BUKAN sudah paling depan
        if (idx !== -1 && idx < stack.value.length - 1) {
            stack.value.splice(idx, 1); // Hapus dari posisi lama
            stack.value.push(id); // Tambahkan ke paling akhir (paling atas)
            refreshZ(); // Update semua z-index
        }
    }

    // Kita return zMap sebagai readonly agar komponen tidak bisa mengubahnya langsung
    return { zMap: readonly(zMap), open, close, bringToFront };
}
