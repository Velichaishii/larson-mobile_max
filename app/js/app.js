var LARSON = (function () {

    function LARSON() {
        var _self = this;

        _self.doc = document;
        _self.window = window;
        _self.html = _self.doc.querySelector('html');

        _self.bootstrap();
    }

    LARSON.prototype.bootstrap = function () {
        var _self = this;

        _self.menu();
        _self.langs();
        _self.popupsApp = _self.popups();
        _self.countdown('.counter-signature');
        _self.upButton('.upButton');
        _self.initSwitcher();
    };

    // Window load types (loading, dom, full)
    LARSON.prototype.appLoad = function (type, callback) {
        var _self = this;

        switch (type) {
            case 'loading':
                if (_self.doc.readyState === 'loading') callback();

                break;
            case 'dom':
                _self.doc.onreadystatechange = function () {
                    if (_self.doc.readyState === 'complete') callback();
                };

                break;
            case 'full':
                _self.window.onload = function (e) {
                    callback(e);
                };

                break;
            default:
                callback();
        }
    };

    LARSON.prototype.initSwitcher = function () {
        var _self = this;

        var switchers = _self.doc.querySelectorAll('[data-switcher]');

        if (switchers && switchers.length > 0) {
            for (var i = 0; i < switchers.length; i++) {
                var switcher = switchers[i],
                    switcherOptions = _self.options(switcher.dataset.switcher),
                    switcherElems = switcher.children,
                    switcherTargets = _self.doc.querySelector('[data-switcher-target="' + switcherOptions.target + '"]').children;

                for (var y = 0; y < switcherElems.length; y++) {
                    var switcherElem = switcherElems[y],
                        parentNode = switcher.children,
                        switcherTarget = switcherTargets[y];

                    if (switcherElem.classList.contains('active')) {
                        for (var z = 0; z < parentNode.length; z++) {
                            parentNode[z].classList.remove('active');
                            switcherTargets[z].classList.remove('active');
                        }
                        switcherElem.classList.add('active');
                        switcherTarget.classList.add('active');
                    }

                    switcherElem.children[0].addEventListener('click', function (elem, target, parent, targets) {
                        return function (e) {
                            // e.preventDefault();
                            if (!elem.classList.contains('active')) {
                                for (var z = 0; z < parentNode.length; z++) {
                                    parent[z].classList.remove('active');
                                    targets[z].classList.remove('active');
                                }
                                elem.classList.add('active');
                                target.classList.add('active');
                            }
                        };

                    }(switcherElem, switcherTarget, parentNode, switcherTargets));
                }
            }
        }
    };

    LARSON.prototype.str2json = function (str, notevil) {
        try {
            if (notevil) {
                return JSON.parse(str
                    .replace(/([\$\w]+)\s*:/g, function (_, $1) {
                        return '"' + $1 + '":';
                    })
                    .replace(/'([^']+)'/g, function (_, $1) {
                        return '"' + $1 + '"';
                    })
                );
            } else {
                return (new Function("", "var json = " + str + "; return JSON.parse(JSON.stringify(json));"))();
            }
        } catch (e) {
            return false;
        }
    };

    LARSON.prototype.options = function (string) {
        var _self = this;

        if (typeof string != 'string') return string;

        if (string.indexOf(':') != -1 && string.trim().substr(-1) != '}') {
            string = '{' + string + '}';
        }

        var start = (string ? string.indexOf("{") : -1), options = {};

        if (start != -1) {
            try {
                options = _self.str2json(string.substr(start));
            } catch (e) {
            }
        }

        return options;
    };

    LARSON.prototype.menu = function () {
        var _self = this;
        var burgerBtn = _self.doc.querySelector('.burger__btn');
        var burgerMenu = _self.doc.querySelector('.burger-menu');
        var wrapOver = _self.doc.querySelector('.wrap__overlay');
        var navToggle = _self.doc.querySelectorAll('.burger-menu .nav__toggle');
        var html = _self.doc.querySelector('html');

        burgerBtn.addEventListener('click', function (e) {
            e.preventDefault();
            if (burgerMenu.classList.contains('open')) {
                burgerMenu.classList.remove('open');
                burgerBtn.classList.remove('active');
                html.classList.remove('modal-open');
            } else {
                burgerMenu.classList.add('open');
                burgerBtn.classList.add('active');
                html.classList.add('modal-open');
            }
        });

        wrapOver.addEventListener('click', function (e) {
            e.preventDefault();
            burgerMenu.classList.remove('open');
            burgerBtn.classList.remove('active');
            html.classList.remove('modal-open');
        });

        for (i = 0; i < navToggle.length; i++) {
            navToggle[i].addEventListener('click', function (e) {
                e.preventDefault();

                var navItem = $(this).closest('.nav__item');
                var navListDD = navItem.find('.nav__list_dropdown');

                if (navItem.hasClass('dropdown-open')) {
                    navListDD.stop().slideUp(300);
                    navItem.removeClass('dropdown-open');
                } else {
                    navListDD.stop().slideDown('300');
                    navItem.addClass('dropdown-open');
                }
            });
        }
    };

    LARSON.prototype.popups = function () {
        var _self = this;
        var popup = {};

        popup.popupBtnClose = _self.doc.querySelectorAll(".js-close-modal");
        popup.popupBtnCall = _self.doc.querySelectorAll(".js-open-modal");

        popup.init = function () {
            popup.bindings();
        };

        popup.bindings = function () {
            for (i = 0; i < popup.popupBtnClose.length; i++) {
                popup.popupBtnClose[i].addEventListener('click', function (e) {
                    e.preventDefault();

                    var popupName = this.closest('.popup').getAttribute('data-popup');
                    popup.closePopup(popupName);
                });
            }

            for (i = 0; i < popup.popupBtnCall.length; i++) {
                popup.popupBtnCall[i].addEventListener('click', function (e) {
                    e.preventDefault();

                    if (this.hasAttribute('data-open-popup')) {
                        e.preventDefault();

                        var popupName = this.getAttribute('data-open-popup');
                        popup.openPopup(popupName);
                    }
                });
            }
        };

        popup.openPopup = function (popupName) {
            var popups = _self.doc.querySelectorAll('[data-popup="' + popupName + '"]');

            _self.html.classList.add('modal-open');
            for (i = 0; i < popups.length; i++) {
                popups[i].classList.add('active');
            }
        };

        popup.closePopup = function (popupName) {
            var popups = _self.doc.querySelectorAll('[data-popup="' + popupName + '"]');

            _self.html.classList.remove('modal-open');
            for (i = 0; i < popups.length; i++) {
                popups[i].classList.remove('active');
            }
        };

        popup.init();

        return popup;
    };

    LARSON.prototype.langs = function () {
        var _self = this;

        var wrapSubTp = _self.doc.querySelector('.wrap__substrate-tp');
        var langToggle = _self.doc.querySelector('.lang__toggle');
        var langDD = _self.doc.querySelector('.lang-dropdown');

        langToggle.addEventListener('click', function (e) {
            e.preventDefault();
            if (langDD.classList.contains('open') && langToggle.classList.contains('active')) {
                langDD.classList.remove('open');
                langToggle.classList.remove('active');
                wrapSubTp.classList.remove('active');
            } else {
                langDD.classList.add('open');
                langToggle.classList.add('active');
                wrapSubTp.classList.add('active');
            }
        });

        wrapSubTp.addEventListener('click', function (e) {
            e.preventDefault();
            langDD.classList.remove('open');
            langToggle.classList.remove('active');
            wrapSubTp.classList.remove('active');
        });
    };

    LARSON.prototype.countdown = function (className) {
        var _self = this;

        var countDowns = _self.doc.querySelectorAll(className);
        if (countDowns) {

            for (i = 0; i < countDowns.length; i++) {
                var time;
                if (countDowns[i].hasAttribute('data-countdown'))
                    time = countDowns[i].getAttribute('data-countdown')
                else
                    time = "June 7, 2087 15:03:25"
                new Countdown(countDowns[i], {
                    date: time,
                    render: function (date) {
                        this.el.innerHTML = '' +
                            '<div class="counter-signature__list">' +
                            '<div class="counter-signature__item">' +
                            '<div class="counter-signature__numeral">' + date.days + '</div>' +
                            '<div class="counter-signature__text">дней</div>' +
                            '</div>' +
                            '<div class="counter-signature__item">' +
                            '<div class="counter-signature__numeral">' + this.leadingZeros(date.hours) + '</div>' +
                            '<div class="counter-signature__text">часов</div>' +
                            '</div>' +
                            '<div class="counter-signature__item">' +
                            '<div class="counter-signature__numeral">' + this.leadingZeros(date.min) + '</div>' +
                            '<div class="counter-signature__text">минут</div>' +
                            '</div>' +
                            '<div class="counter-signature__item">' +
                            '<div class="counter-signature__numeral counter-signature__numeral_c-ls">' + this.leadingZeros(date.sec) + '</div>' +
                            '<div class="counter-signature__text">секунд</div>' +
                            '</div>' +
                            '</div>';
                    }
                });
            }
        }

        var newsTimer = _self.doc.querySelectorAll('.news-counter__time');
        if(newsTimer) {
            for (i = 0; i < newsTimer.length; i++) {
                var newsTime;
                if (newsTimer[i].hasAttribute('data-countdown'))
                    newsTime = newsTimer[i].getAttribute('data-countdown')
                else
                    newsTime = "June 7, 2087 15:03:25"
                new Countdown(newsTimer[i], {
                    date: newsTime,
                    render: function (date) {
                        this.el.innerHTML = '' +
                            '<div class="counter__numeral">'+date.hours+'</div>' +
                            ':' +
                            '<div class="counter__numeral">'+this.leadingZeros(date.min)+'</div>' +
                            ':' +
                            '<div class="counter__numeral">'+this.leadingZeros(date.sec)+'</div>';
                    }
                });
            }
        }
    };

    LARSON.prototype.upButton = function (className) {
        var _self = this;

        var button = _self.doc.querySelector(className);

        button.addEventListener('click', function (e) {
            e.preventDefault();

            $('body, html').animate({scrollTop: 0}, 500);
        });

        _self.window.onscroll = function () {
            if(_self.window.scrollY > 100) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        };
    };

    return LARSON;
})();

var app = new LARSON();

app.appLoad('full', function (e) {

    // app.menu();

    $('.slider').owlCarousel({
        items: 1,
        nav: false,
        dots: true
        // autoHeight: true
    });

    var header = $('.header');
    $(window).scroll(function () {
        var scrollTop = $('body').scrollTop();

        if (scrollTop === 0) {
            header.removeClass('header_shadow');
        } else {
            header.addClass('header_shadow');
        }
    });

    if ($('input.data-inputmask, .inputmask-phone').length > 0) {
        $('input.data-inputmask, .inputmask-phone').mask("+7 (999) 999-99-99");
    }
    if ($('input.data-inputmask, .inputmask-bithday').length > 0) {
        $('input.data-inputmask, .inputmask-bithday').mask("99 99 999");
    }

    // app.popupsApp.openPopup('success');
});