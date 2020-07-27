(function() {

    function get(selector) {
        return document.querySelector(selector);
    }

    function getAll(selector) {
        return document.querySelectorAll(selector);
    }

    function scrollToEl(element, duration) {
        duration = duration || 1000;
        var startingY = window.pageYOffset;
        var elementY = window.pageYOffset + element.getBoundingClientRect().top;
        var targetY = document.body.scrollHeight - elementY < window.innerHeight ? document.body.scrollHeight - window.innerHeight : elementY;
        var diff = targetY - startingY;
        var start;
        var easing = function(t) {
            return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        }
        if (!diff) return;
        window.requestAnimationFrame(function step(timestamp) {
            if (!start) start = timestamp;
            var time = timestamp - start;
            var percent = Math.min(time / duration, 1);
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
        var dest;
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
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    var scrollCallback = debounce(function(e) {
        var offset = window.scrollY;
        var height = get('.page').scrollHeight;
        header.sections.forEach(function(section, index) {
            if (offset > (height * index) - (height / 2)) {
                selectSection(section.name);
            }
        });
    }, 10);

    document.addEventListener('scroll', scrollCallback);
    scrollCallback();

    var header = new Vue({
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
                var dest = toArray(getAll('header .section')).indexOf(evt.target);
                scrollToEl(getAll('.page')[dest]);
            }
        }
    });

    var position = new Vue({
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

    var mainBtn = new Vue({
        el: '.main-btn',
        data: {

        },
        methods: {
            progress: function() {
                getAll('header .section')[1].click();
            }
        }
    });

    var supports = {
        serviceWorkers: 'serviceWorker' in navigator,
        pushManager: 'PushManager' in window,
        notifications: 'Notification' in window
    }
    var workerRegistration = null;

    if (supports.serviceWorkers) {
        navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
            workerRegistration = registration;
        }).catch(function(err) {
            console.error('Unable to register service worker.', err);
        });
    }

    get('.copyright-year').innerText = (new Date()).getFullYear();
    console.log('hello')

})();