(function() {

    function YOURAPPNAME(doc) {
        var _self = this;

        _self.doc = doc;
        _self.window = window;

        _self.bootstrap();
    }

    YOURAPPNAME.prototype.bootstrap = function() {
        var _self = this;

    };

    // Window load types (loading, dom, full)
    YOURAPPNAME.prototype.appLoad  = function (type, callback) {
        var _self = this;

        switch(type) {
            case 'loading':
                if (_self.doc.readyState === 'loading') callback();

                break;
            case 'dom':
                _self.doc.onreadystatechange = function () {
                    if (_self.doc.readyState === 'complete') callback();
                };

                break;
            case 'full':
                _self.window.onload = function(e) {
                    callback(e);
                };

                break;
            default:
                callback();
        }
    };

    YOURAPPNAME.prototype.initSwitcher = function () {
        var _self = this;

        var switchers = _self.doc.querySelectorAll('[data-switcher]');

        if(switchers && switchers.length > 0) {
            for(var i=0; i<switchers.length; i++) {
                var switcher = switchers[i],
                    switcherOptions = _self.options(switcher.dataset.switcher),
                    switcherElems = switcher.children,
                    switcherTargets = _self.doc.querySelector('[data-switcher-target="' + switcherOptions.target + '"]').children;

                for(var y=0; y<switcherElems.length; y++) {
                    var switcherElem = switcherElems[y],
                        parentNode = switcher.children,
                        switcherTarget = switcherTargets[y];

                    if(switcherElem.classList.contains('active')) {
                        for(var z=0; z<parentNode.length; z++) {
                            parentNode[z].classList.remove('active');
                            switcherTargets[z].classList.remove('active');
                        }
                        switcherElem.classList.add('active');
                        switcherTarget.classList.add('active');
                    }

                    switcherElem.children[0].addEventListener('click', function (elem, target, parent, targets) {
                        return function (e) {
                            e.preventDefault();
                            if(!elem.classList.contains('active')) {
                                for(var z=0; z<parentNode.length; z++) {
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

    YOURAPPNAME.prototype.str2json = function(str, notevil) {
        try {
            if (notevil) {
                return JSON.parse(str
                    .replace(/([\$\w]+)\s*:/g, function(_, $1){return '"'+$1+'":';})
                    .replace(/'([^']+)'/g, function(_, $1){return '"'+$1+'"';})
                );
            } else {
                return (new Function("", "var json = " + str + "; return JSON.parse(JSON.stringify(json));"))();
            }
        } catch(e) { return false; }
    };

    YOURAPPNAME.prototype.options = function(string) {
        var _self = this;

        if (typeof string !='string') return string;

        if (string.indexOf(':') != -1 && string.trim().substr(-1) != '}') {
            string = '{'+string+'}';
        }

        var start = (string ? string.indexOf("{") : -1), options = {};

        if (start != -1) {
            try {
                options = _self.str2json(string.substr(start));
            } catch (e) {}
        }

        return options;
    };

    var app = new YOURAPPNAME(document);

    app.appLoad('loading', function () {
        console.log('App is loading... Paste your app code here.');
        // App is loading... Paste your app code here. 4example u can run preloader event here and stop it in action appLoad dom or full
    });

    app.appLoad('dom', function () {
        console.log('DOM is loaded! Paste your app code here (Pure JS code).');
        // DOM is loaded! Paste your app code here (Pure JS code).
        // Do not use jQuery here cause external libs do not loads here...

        app.initSwitcher(); // data-switcher="{target='anything'}" , data-switcher-target="anything"
    });

    app.appLoad('full', function (e) {
        var header = $('.header');
        var burgerBtn = $('.header  .burger__bth');
        var burgerMenu = $('.burger-menu');
        var wrapOver = $('.wrap__overlay');
        var wrapSubTp = $('.wrap__substrate-tp');
        var navToggle = $('.burger-menu .nav__toggle');
        var langToggle= $('.lang__toggle');
        var langDD= $('.lang-dropdown');

        $('.slider').owlCarousel(
            {
                items: 1,
                nav: false,
                dots: true,
                autoHeight: true
            }
        );

        burgerBtn.click(function (e) {
            e.preventDefault();
            if (burgerMenu.hasClass('open')) {
                burgerMenu.removeClass('open');
                burgerBtn.removeClass('active');
                wrapOver.stop().fadeOut(300);
            }
            else {
                burgerMenu.addClass('open');
                burgerBtn.addClass('active');
                wrapOver.stop().fadeIn(300);
            }
        });

        $(wrapOver).click(function (e) {
            e.preventDefault();
            wrapOver.stop().fadeOut(300);
            burgerMenu.removeClass('open');
            burgerBtn.removeClass('active');
            return false;
        });

        $(wrapSubTp).click(function (e) {
            e.preventDefault();
            langDD.fadeOut(300);
            langDD.removeClass('open');
            langToggle.removeClass('active');
            wrapSubTp.removeClass('active');
            return false;
        });

        navToggle.click(function () {
            var navListDD = $(this).closest('.nav__item').find('.nav__list_dropdown');
            var navItem = $(this).closest('.nav__item');

            if (navItem.hasClass('dropdown-open')) {
                navListDD.stop().slideUp(300);
                navItem.removeClass('dropdown-open');
            }
            else {
                navListDD.stop().slideDown('300');
                navItem.addClass('dropdown-open');
            }
        });

        langToggle.click(function (e) {
            e.preventDefault();
            if (langDD.hasClass('open') && langToggle.hasClass('active')) {
                langDD.removeClass('open');
                langToggle.removeClass('active');
                wrapSubTp.removeClass('active');
                langDD.stop().fadeOut(300);
            }
            else {
                langDD.stop().fadeIn(300);
                langDD.addClass('open');
                langToggle.addClass('active');
                wrapSubTp.addClass('active');
            }
            return false;
        });

        $(window).scroll (function () {
            var scrollTop = $('body').scrollTop();

            if (scrollTop ===  0) {
                $(header).removeClass('header_shadow');
            }
            else {
                $(header).addClass('header_shadow');
            }
        });

        if ($('input.data-inputmask, .inputmask-phone').length > 0) {
            $('input.data-inputmask, .inputmask-phone').mask("+7 (999) 999-99-99");
        }
        if ($('input.data-inputmask, .inputmask-bithday').length > 0) {
            $('input.data-inputmask, .inputmask-bithday').mask("99 99 999");
        }
    });
})();