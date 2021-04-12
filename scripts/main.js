(function() {

    function get(selector) {
        return document.querySelector(selector);
    }

    function getAll(selector) {
        return document.querySelectorAll(selector);
    }

    function scrollToEl(element, duration) {
        duration = duration || 1000;
        let startingY = window.pageYOffset;
        let elementY = window.pageYOffset + element.getBoundingClientRect().top;
        let targetY = document.body.scrollHeight - elementY < window.innerHeight ? document.body.scrollHeight - window.innerHeight : elementY;
        let diff = targetY - startingY;
        let start;
        let easing = function(t) {
            return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        }
        if (!diff) return;
        window.requestAnimationFrame(function step(timestamp) {
            if (!start) start = timestamp;
            let time = timestamp - start;
            let percent = Math.min(time / duration, 1);
            percent = easing(percent);
            window.scrollTo(0, startingY + diff * percent);
            if (time < duration) {
                window.requestAnimationFrame(step);
            }
        });
    }

    function toArray(thing) {
        return Array.prototype.slice.call(thing);
    }

    function selectSection(name) {
        let dest;
        header.sections.forEach(function(section, index) {
            section.selected = section.name === name;
            if (section.selected) {
                dest = index;
            }
        });
        position.boxes.forEach(function(box) {
            box.selected = box.name === name;
        })
        return dest;
    }

    function debounce(func, wait, immediate) {
        let timeout;
        return function() {
            let context = this, args = arguments;
            let later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            let callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    let scrollCallback = debounce(function(e) {
        let offset = window.scrollY;
        let height = get('.page').scrollHeight;
        header.sections.forEach(function(section, index) {
            if (offset > (height * index) - (height / 2)) {
                selectSection(section.name);
            }
        });
    }, 10);

    document.addEventListener('scroll', scrollCallback);
    scrollCallback();

    let header = new Vue({
        el: 'header',
        data: {
            sections: [
                {name: 'Home', selected: true},
                {name: 'About', selected: false},
                {name: 'My projects', selected: false},
                {name: 'Contact me', selected: false}
            ]
        },
        methods: {
            changeSection: function(evt) {
                let dest = toArray(getAll('header .section')).indexOf(evt.target);
                scrollToEl(getAll('.page')[dest]);
            }
        }
    });

    let position = new Vue({
        el: '.position',
        data: {
            boxes: header.sections
        },
        methods: {
            changeSection: function(name) {
                get('header .section[name="'+name+'"]').click();
            }
        }
    })

    let mainBtn = new Vue({
        el: '.main-btn',
        data: {

        },
        methods: {
            progress: function() {
                getAll('header .section')[1].click();
            }
        }
    });

    let supports = {
        serviceWorkers: 'serviceWorker' in navigator,
        pushManager: 'PushManager' in window,
        notifications: 'Notification' in window
    }
    let workerRegistration = null;
    const loadServiceWorker = false;

    if (supports.serviceWorkers && loadServiceWorker) {
        navigator.serviceWorker.register('service-worker.js').then(function(registration) {
            workerRegistration = registration;
        }).catch(function(err) {
            console.error('Unable to register service worker.', err);
        });
    }

    get('.copyright-year').innerText = (new Date()).getFullYear();

})();