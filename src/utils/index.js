/**
 * 防抖
 * @param {*} fn 函数
 * @param {*} delay 延迟时间
 * @returns 
 */
export function debounce(fn, delay = 200) {
    let timer = null;
    return function () {
        clearTimeout(timer);
        timer = setTimeout(fn, delay);
    };
}

/**
 * 倒计时
 * @param {*} selector 选择器 格式：'.nav-count-down'
 * @param {*} endTime 结束时间 格式：Date.UTC(2024, 3, 24, 13)
 */
export function startCountdown(selector, endTime) {
    const second = 1000,
        minute = second * 60,
        hour = minute * 60,
        day = hour * 24;

    let lastUpdate = 0;
    const countDown = new Date(endTime).getTime();
    if (!document.querySelector(selector)) return;

    function updateFrame(timestamp) {
        if (!lastUpdate || timestamp - lastUpdate >= 1000) {
            const now = Date.now();
            const distance = countDown - now;

            const daysEl = document.querySelector(selector + ' .days');
            const hoursEl = document.querySelector(selector + ' .hours');
            const minutesEl = document.querySelector(selector + ' .minutes');
            const secondsEl = document.querySelector(selector + ' .seconds');

            if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

            if (distance <= 0) {
                daysEl.innerText = hoursEl.innerText = minutesEl.innerText = secondsEl.innerText = "00";
            } else {
                daysEl.innerText = String(Math.floor(distance / day)).padStart(2, '0');
                hoursEl.innerText = String(Math.floor((distance % day) / hour)).padStart(2, '0');
                minutesEl.innerText = String(Math.floor((distance % hour) / minute)).padStart(2, '0');
                secondsEl.innerText = String(Math.floor((distance % minute) / second)).padStart(2, '0');
            }

            lastUpdate = timestamp;
        }

        requestAnimationFrame(updateFrame);
    }

    updateFrame();
}