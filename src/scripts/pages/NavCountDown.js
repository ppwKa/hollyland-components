/**
 * Hollyland Nav Count Down Manager
 * 全局导航栏倒计时管理器
 */
class NavCountDownManager {
    constructor() {
        this.SELECTORS = {
            //加前缀：hl-nav-count-down，避免与其他组件的类名冲突
            navCountDown: '.hl-nav-count-down .nav-count-down'
        }

        this.init();
    }

    /**
     * 初始化页面功能
     */
    init() {
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initAfterDOMLoaded());
        } else {
            this.initAfterDOMLoaded();
        }
    }


    /**
     * DOM加载完成后的初始化
     */
    initAfterDOMLoaded() {
        this.initCountdown();
    }

    /**
     * 初始化倒计时
     */
    initCountdown() {
        const navCountDown = document.querySelector(this.SELECTORS.navCountDown);
        if (!navCountDown) return;

        this.startCountdown(this.SELECTORS.navCountDown, new Date(Date.UTC(2025, 9, 15, 13)));
    }

    /**
     * 开始倒计时
     * @param {*} selector 选择器 格式：'.nav-count-down'
     * @param {*} endTime 结束时间 格式：Date.UTC(2025, 9, 15, 13)
     */
    startCountdown(selector, endTime) {
        const second = 1000,
            minute = second * 60,
            hour = minute * 60,
            day = hour * 24;

        let lastUpdate = 0;
        const countDown = new Date(endTime).getTime();
        const selectorEl = document.querySelector(selector);
        if (!selectorEl) return;

        function updateFrame(timestamp) {
            if (!lastUpdate || timestamp - lastUpdate >= 1000) {
                const now = Date.now();
                const distance = countDown - now;

                const daysEl = selectorEl.querySelector('.days-number');
                const hoursEl = selectorEl.querySelector('.hours-number');
                const minutesEl = selectorEl.querySelector('.minutes-number');
                const secondsEl = selectorEl.querySelector('.seconds-number');

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
}

// 初始化页面管理器
const navCountDownManager = new NavCountDownManager();

// 导出管理器实例（如果需要在其他地方使用）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NavCountDownManager;
}