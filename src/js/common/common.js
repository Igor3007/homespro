document.addEventListener('DOMContentLoaded', function (event) {


    /* =================================================
    css variable
    =================================================*/

    function css_variable() {
        let vh = window.innerHeight * 0.01;
        let hgtheader = document.querySelector('.header') ? document.querySelector('.header').clientHeight : 64

        document.documentElement.style.setProperty('--vh', vh + 'px');
        document.documentElement.style.setProperty('--hgt-header', hgtheader + 'px');
    }

    window.addEventListener('load', css_variable)
    window.addEventListener('resize', css_variable)

    /* =================================================
    smooth scroll
    ================================================= */

    window.scrollToTargetAdjusted = function (params) {

        let element = typeof params.elem == 'string' ? document.querySelector(params.elem) : params.elem
        let headerOffset = 15;
        let elementPosition = element.getBoundingClientRect().top + window.scrollY

        console.log(elementPosition)

        let offsetPosition = elementPosition - headerOffset - params.offset;



        window.scrollTo({
            top: Number(offsetPosition),
            behavior: "smooth"
        });
    }

    /* =================================================
    preloader
    ================================================= */

    class Preloader {

        constructor() {
            this.$el = this.init()
            this.state = false
        }

        init() {
            const el = document.createElement('div')
            el.classList.add('loading')
            el.innerHTML = '<div class="indeterminate"></div>';
            document.body.append(el)
            return el;
        }

        load() {

            this.state = true;

            setTimeout(() => {
                if (this.state) this.$el.classList.add('load')
            }, 300)
        }

        stop() {

            this.state = false;

            setTimeout(() => {
                if (this.$el.classList.contains('load'))
                    this.$el.classList.remove('load')
            }, 200)
        }

    }

    window.preloader = new Preloader();


    /* ==============================================
    Status
    ============================================== */

    function Status() {

        this.containerElem = '#status'
        this.headerElem = '#status_header'
        this.msgElem = '#status_msg'
        this.btnElem = '#status_btn'
        this.timeOut = 10000,
            this.autoHide = true

        this.init = function () {
            let elem = document.createElement('div')
            elem.setAttribute('id', 'status')
            elem.innerHTML = '<div id="status_header"></div> <div id="status_msg"></div><div id="status_btn"></div>'
            document.body.append(elem)

            document.querySelector(this.btnElem).addEventListener('click', function () {
                this.parentNode.setAttribute('class', '')
            })
        }

        this.msg = function (_msg, _header) {
            _header = (_header ? _header : 'Отлично!')
            this.onShow('complete', _header, _msg)
            if (this.autoHide) {
                this.onHide();
            }
        }
        this.err = function (_msg, _header) {
            _header = (_header ? _header : 'Ошибка')
            this.onShow('error', _header, _msg)
            if (this.autoHide) {
                this.onHide();
            }
        }
        this.wrn = function (_msg, _header) {
            _header = (_header ? _header : 'Внимание')
            this.onShow('warning', _header, _msg)
            if (this.autoHide) {
                this.onHide();
            }
        }

        this.onShow = function (_type, _header, _msg) {
            document.querySelector(this.headerElem).innerText = _header
            document.querySelector(this.msgElem).innerText = _msg
            document.querySelector(this.containerElem).classList.add(_type)
        }

        this.onHide = function () {
            setTimeout(() => {
                document.querySelector(this.containerElem).setAttribute('class', '')
            }, this.timeOut);
        }

    }

    window.STATUS = new Status();
    const STATUS = window.STATUS;
    STATUS.init();

    /* ==============================================
    ajax request
    ============================================== */

    window.ajax = function (params, response) {

        //params Object
        //dom element
        //collback function

        window.preloader.load()

        let xhr = new XMLHttpRequest();
        xhr.open((params.type ? params.type : 'POST'), params.url)

        if (params.headers) {
            for (let key in params.headers) {
                xhr.setRequestHeader(key, params.headers[key]);
            }
        }

        if (params.responseType == 'json') {
            xhr.responseType = 'json';
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.send(JSON.stringify(params.data))
        } else {
            let formData = new FormData()
            for (key in params.data) {
                formData.append(key, params.data[key])
            }
            xhr.send(formData)
        }

        xhr.onload = function () {

            response ? response(xhr.status, xhr.response) : ''
            window.preloader.stop()
            setTimeout(function () {
                if (params.btn) {
                    params.btn.classList.remove('btn-loading')
                }
            }, 300)
        };

        xhr.onerror = function () {
            window.STATUS.err('Error: ajax request failed')
        };

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 3) {
                if (params.btn) {
                    params.btn.classList.add('btn-loading')
                }
            }
        };
    }

    /* ==================================================
    maska
    ==================================================*/
    const {
        MaskInput,
    } = Maska

    function initMaska() {
        new MaskInput("[data-maska]")
    }

    initMaska();


    /* ==================================================
    burgerMenu
    ==================================================*/

    class MainMenu {
        constructor(ctx) {
            this.$el = ctx
            this.btns = this.$el.querySelectorAll('.btn-burger')
            this.container = this.$el.querySelector('[data-menu="container"]')

            this.addEvent()
        }

        toggleMenu(item) {
            item.classList.toggle('open')
            this.container.classList.toggle('is-open')
            this.$el.body.classList.toggle('page-hidden')

            if (!item.classList.contains('open')) this.$el.body.classList.remove('page-hidden')
        }

        closeMenu() {
            this.btns.forEach(item => {
                !item.classList.contains('open') || item.classList.remove('open')
            });

            !this.container.classList.contains('is-open') || this.container.classList.remove('is-open');
            !this.$el.body.classList.contains('page-hidden') || this.$el.body.classList.remove('page-hidden');
        }

        addEvent() {
            this.btns.forEach(item => {
                item.addEventListener('click', e => this.toggleMenu(item))
            })
        }
    }

    if (document.querySelector('.btn-burger')) {
        window.MainMenu = new MainMenu(document)

        document.querySelectorAll('.main-menu__menu').forEach(menu => {
            menu.querySelectorAll('a').forEach(a => a.addEventListener('click', e => window.MainMenu.closeMenu()))
        })
    }



    /* ===========================================
    marquee 
    ===========================================*/

    class Marquee {
        constructor(el) {
            this.$el = el
            this.containerWidth = this.$el.clientWidth
            this.trackWidth = 0
            this.deltaWidth = 0
            this.currentPosition = 0
            this.shift = 2
            this.scrollDirection = '-'

            setTimeout(() => {
                this.init()
            }, 1000)

        }


        init() {

            this.getTrackWidth()
            this.deltaWidth = this.trackWidth - this.containerWidth
            this.run()
            this.scrollHandler()


        }

        getTrackWidth() {
            this.$el.querySelectorAll('.about-block__slide').forEach(li => {
                this.trackWidth += li.offsetWidth
            })

            this.$el.querySelector('.about-block__track').style.width = this.trackWidth + 'px'

        }

        run() {

            let el = this.$el.querySelector('.about-block__track')

            setInterval(() => {

                if (this.currentPosition < this.deltaWidth && this.scrollDirection == '-') {
                    this.currentPosition = this.currentPosition + this.shift;
                } else {
                    this.scrollDirection = '+'
                    this.currentPosition = this.currentPosition - this.shift;

                    if (this.currentPosition <= 0) {
                        this.scrollDirection = '-'
                    }
                }

                el.style.transform = 'translate3d(-' + this.currentPosition + 'px, 0, 0)'
            }, 45)
        }

        scrollHandler() {

            const checkScrollDirection = (event) => {
                this.scrollDirection = checkScrollDirectionIsUp(event) ? '+' : '-'
            }

            const checkScrollDirectionIsUp = (event) => {
                if (event.wheelDelta) {
                    return event.wheelDelta > 0;
                }
                return event.deltaY < 0;
            }

            document.body.addEventListener('wheel', checkScrollDirection);



        }


    }

    // if (document.querySelector('[data-marquee]')) {
    //     document.querySelectorAll('[data-marquee="container"]').forEach(item => new Marquee(item))
    // }

    if (document.querySelector('.about-block__slider')) {

        /*  window.addEventListener('scroll', e => {
             if (document.documentElement.scrollTop > 100) {
                 document.querySelector('.about-block__slider').scrollTo({
                     left: 100,
                     behavior: 'smooth'
                 })
             } else {
                 document.querySelector('.about-block__slider').scrollTo({
                     left: 0,
                     behavior: 'smooth'
                 })
             }
         }) */

        window.addEventListener('scroll', e => {

            let slider = document.querySelector('.about-block__slider')

            if (document.documentElement.scrollTop > 100) {
                slider.classList.add('animate-middle')
            } else {
                !slider.classList.contains('animate-middle') || slider.classList.remove('animate-middle')
            }

            if (document.documentElement.scrollTop > 700) {
                slider.classList.add('animate-middle-top')
            } else {
                !slider.classList.contains('animate-middle-top') || slider.classList.remove('animate-middle-top')
            }
        })


        // const checkScrollDirection = (event) => {
        //     let scrollDirection = checkScrollDirectionIsUp(event) ? '+' : '-'

        //     let evenTotal = 25;
        //     let step = 5


        //     let even = document.querySelectorAll('.about-block__slide:nth-child(2n)')
        //     let odd = document.querySelectorAll('.about-block__slide:nth-child(2n+1)')

        //     even.forEach(item => {
        //         if (checkScrollDirectionIsUp(event)) {
        //             item.style.transform.translateY = (evenTotal + step) + 'px'
        //         } else {
        //             if (evenTotal > 0) {
        //                 item.style.transform.translateY = (evenTotal - step) + 'px'
        //             }
        //         }
        //     })
        //     odd.forEach(item => {

        //     })



        // }

        // const checkScrollDirectionIsUp = (event) => {
        //     if (event.wheelDelta) {
        //         return event.wheelDelta > 0;
        //     }
        //     return event.deltaY < 0;
        // }

        // document.body.addEventListener('wheel', checkScrollDirection);


    }

    /* ==============================================
    videoPlayer
    ==============================================*/

    class VideoYoutubePlaylist {
        constructor(params) {
            this.$el = params.el

            this.title = this.$el.querySelector('[data-video="title"]')
            this.desc = this.$el.querySelector('[data-video="desc"]')
            this.list = this.$el.querySelector('[data-video="list"]')
            this.playBtn = this.$el.querySelector('[data-video="play"]')
            this.preview = this.$el.querySelector('[data-video="preview"]')
            this.player = this.$el.querySelector('[data-id')
            this.buttonFW = this.$el.querySelector('[data-video="fw"')
            this.iframe = null;


            this.addEvent()
        }

        parseYoutubeId(url) {
            var m = url.match(/^.*(?:youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/);
            if (!m || !m[1]) return null;
            return m[1];
        }

        play() {

            if (this.iframe) this.iframe.remove()

            this.player.classList.add('is-play')
            this.iframe = document.createElement('iframe')
            this.iframe.setAttribute('allowfullscreen', '')
            this.iframe.src = '//www.youtube.com/embed/' + this.parseYoutubeId(this.player.dataset.id) + '?autoplay=true'
            this.player.querySelector('.video__iframe').append(this.iframe)

            this.$el.classList.add('is-playing')
        }

        mountPlayer(data) {
            this.title.innerHTML = `<a href="${this.player.dataset.id}" target="_blank" >${data.title}</a>`
            this.desc.innerText = data.desc
            this.player.querySelector('img').src = data.preview;
            this.player.dataset.id = data.link
            this.play()

            if (this.$el.classList.contains('is-fullwidth')) this.scrollTop()
        }

        scrollTop() {
            window.scrollToTargetAdjusted({
                elem: '.section-video-block',
                offset: -100
            })
        }

        addEvent() {
            this.playBtn.addEventListener('click', () => {
                this.play()
            })

            this.list.childNodes.forEach(item => {
                item.addEventListener('click', (e) => {

                    e.preventDefault()

                    this.mountPlayer({
                        title: item.querySelector('.card-playlist__title').innerText,
                        desc: item.querySelector('.card-playlist__desc').innerText,
                        link: item.querySelector('.card-playlist__title a').getAttribute('href'),
                        preview: item.querySelector('[data-bg]').dataset.bg
                    })
                })


            })

            this.buttonFW.addEventListener('click', e => {
                this.$el.classList.toggle('is-fullwidth')
                this.scrollTop()
            })
        }
    }

    if (document.querySelector('.video-block')) {
        window.VideoYoutubePlaylist = new VideoYoutubePlaylist({
            el: document.querySelector('.video-block')
        })
    }

    /* ===============================================
    slider team
    ===============================================*/

    if (document.querySelector('[data-slider="team"]')) {

        document.querySelectorAll('[data-slider="team"]').forEach(slider => {
            slider['splide'] = new Splide(slider, {

                perPage: 4,
                perMove: 1,
                gap: 32,
                pagination: false,

                breakpoints: {
                    1440: {
                        gap: 24,
                    },
                    1024: {
                        perPage: 3,
                        gap: 20
                    },
                    768: {
                        fixedWidth: 300,
                        perPage: 1,
                        pagination: true,
                    },

                },

                arrowPath: 'M13.531 8.523a1.835 1.835 0 012.567 0l10.37 10.213c.71.698.71 1.83 0 2.528l-10.37 10.213a1.835 1.835 0 01-2.566 0 1.768 1.768 0 010-2.528L22.618 20l-9.088-8.949a1.768 1.768 0 010-2.528z'
            });

            const getTopArrowButtons = () => {

                if (slider) {
                    let heigthEl = slider.querySelector('picture').clientHeight
                    slider.querySelectorAll('.splide__arrow').forEach(btn => {
                        btn.style.top = (heigthEl / 2) + 'px'
                    })
                }


            }

            slider['splide'].on('resize', (e) => getTopArrowButtons(e))
            slider['splide'].on('mounted', (e) => getTopArrowButtons(e))

            slider['splide'].mount();
        })


    }

    /* ===============================================
    slider awards
    ===============================================*/

    if (document.querySelector('[data-slider="awards"]')) {

        document.querySelectorAll('[data-slider="awards"]').forEach(slider => {
            slider['splide'] = new Splide(slider, {

                fixedWidth: 300,
                perPage: 1,
                perMove: 1,
                gap: 20,
                pagination: true,
                mediaQuery: 'min',

                breakpoints: {
                    576: {
                        destroy: true
                    }

                },

                arrowPath: 'M13.531 8.523a1.835 1.835 0 012.567 0l10.37 10.213c.71.698.71 1.83 0 2.528l-10.37 10.213a1.835 1.835 0 01-2.566 0 1.768 1.768 0 010-2.528L22.618 20l-9.088-8.949a1.768 1.768 0 010-2.528z'
            });

            const getTopArrowButtons = () => {

                if (slider) {
                    let heigthEl = slider.querySelector('picture').clientHeight
                    slider.querySelectorAll('.splide__arrow').forEach(btn => {
                        btn.style.top = (heigthEl / 2) + 'px'
                    })
                }


            }

            slider['splide'].on('resize', (e) => getTopArrowButtons(e))
            slider['splide'].on('mounted', (e) => getTopArrowButtons(e))

            slider['splide'].mount();
        })

        //hover card


        document.querySelectorAll('.card-awards').forEach(el => {
            el.querySelector('.card-awards__image').addEventListener('mouseenter', () => {
                const rect = el.getBoundingClientRect()

                if (rect.top < 220) {
                    window.scrollToTargetAdjusted({
                        elem: el.querySelector('.card-awards__tip'),
                        offset: 70
                    })
                }
            })
        })

    }

    /* ===============================================
    slider project
    ===============================================*/

    class ProjectSlider {
        constructor() {
            this.sliderProject = null
            this.thumbInstance = null
        }

        setSlider(slide) {
            this.sliderProject = slide
        }

        setThumsSlider(el) {
            this.thumbInstance = el
            this.addEventsThumb()
        }

        addEventsThumb() {
            this.thumbInstance.root.querySelectorAll('.splide__slide').forEach((item, index) => {
                item.addEventListener('click', () => {
                    this.thumbInstance.go(index)
                })
            })
        }

        getElProjectActiveSlide() {
            return this.sliderProject.root.querySelector('.splide__slide.is-active')
        }

        changeImageOnProject(url) {


            let picture = this.getElProjectActiveSlide().querySelector('.card-project__image picture')

            picture.classList.add('change-image-animate--start')

            setTimeout(() => {
                this.getElProjectActiveSlide().querySelector('[data-ps="main-image"]').setAttribute('src', url)
            }, 500)

            setTimeout(() => {
                picture.classList.add('change-image-animate--end')
            }, 600)

            setTimeout(() => {
                picture.setAttribute('class', '')
            }, 1150)


        }

        getTemplateSlide(url) {
            return `
                <div class="splide__slide">
                    <picture> <img src="${url}" ></picture>
                </div>
            `;
        }

        createSlides(slide) {
            let items = slide.querySelectorAll('.card-project__thumb li')

            items.forEach(li => {
                this.thumbInstance.add(this.getTemplateSlide(li.dataset.src))
            })

            this.addEventsThumb()
        }

        changeProjectActive(slide) {

            if (!this.thumbInstance) return false

            this.thumbInstance.remove((item) => true)
            this.createSlides(slide)
        }


    }

    window.PS = new ProjectSlider()



    if (document.querySelector('[data-slider="project"]')) {
        const sliderWrp = document.querySelector('.project-thumb__slider')

        const sliderMain = document.querySelector('[data-slider="project"]')

        sliderMain['sp'] = new Splide('[data-slider="project"]', {

            perPage: 1,
            perMove: 1,
            gap: 42,
            pagination: false,
            arrows: true,
            speed: 800,

            breakpoints: {

                992: {
                    fixedWidth: 360,
                    perPage: 1,
                    gap: 24,
                    pagination: true
                },

                480: {
                    fixedWidth: 305,
                    gap: 12
                },

            },

            arrowPath: 'M13.531 8.523a1.835 1.835 0 012.567 0l10.37 10.213c.71.698.71 1.83 0 2.528l-10.37 10.213a1.835 1.835 0 01-2.566 0 1.768 1.768 0 010-2.528L22.618 20l-9.088-8.949a1.768 1.768 0 010-2.528z'
        });

        sliderMain['sp'].on('ready', (e) => {
            window.PS.setSlider(sliderMain['sp'])
        })

        sliderMain['sp'].on('active', (e) => {
            setTimeout(() => {
                window.PS.changeProjectActive(e.slide)
            }, 100)
        })

        sliderMain['sp'].mount();
    }

    /* ===============================================
    slider project-thumb 
    ===============================================*/

    if (document.querySelector('[data-slider="project-thumb"]')) {
        const item = document.querySelector('[data-slider="project-thumb"]')
        const sliderCarousel = new Splide(item, {

            perPage: 1,
            perMove: 1,
            gap: 8,
            pagination: false,
            fixedWidth: 120,
            updateOnMove: true,
            arrows: false,
            arrowPath: 'M13.531 8.523a1.835 1.835 0 012.567 0l10.37 10.213c.71.698.71 1.83 0 2.528l-10.37 10.213a1.835 1.835 0 01-2.566 0 1.768 1.768 0 010-2.528L22.618 20l-9.088-8.949a1.768 1.768 0 010-2.528z'
        });

        const next = item.closest('.project-thumb').querySelector('[data-slider="project-thumb-next"]')
        const prev = item.closest('.project-thumb').querySelector('[data-slider="project-thumb-prev"]')

        const checkNavButton = () => {

            let slidesWidth = 0
            let containerWidth = sliderCarousel.root.querySelector('.splide__track').clientWidth

            sliderCarousel.root.querySelectorAll('.splide__slide').forEach(item => {
                slidesWidth += (item.clientWidth - 3) + sliderCarousel.options.gap
            })

            next.style.display = (slidesWidth <= containerWidth ? 'none' : 'flex')
            prev.style.display = (slidesWidth <= containerWidth ? 'none' : 'flex')

        }

        sliderCarousel.on('ready', (e) => {
            checkNavButton()
            window.PS.setThumsSlider(sliderCarousel)
        })

        sliderCarousel.on('resized', (e) => {
            checkNavButton()
        })

        sliderCarousel.on('moved', (e) => {
            checkNavButton()
        })

        sliderCarousel.on('active', (e) => {
            window.PS.changeImageOnProject(e.slide.querySelector('img').getAttribute('src'))
        })

        sliderCarousel.mount()

        next.addEventListener('click', e => sliderCarousel.go('>'))
        prev.addEventListener('click', e => sliderCarousel.go('<'))


    }


    /* ===============================================
    slider project-thumb 
    ===============================================*/

    // const items = document.querySelectorAll('.eff-respective');
    // const pushAmount = 5;

    // for (x = 0; x < items.length; x++) {
    //     // Rotate on Hover

    //     items[x].classList.add('animation-mousemove')
    //     items[x].addEventListener('mousemove', (e) => {
    //         // Get Mouse Pos Relative to Element
    //         const target = e.target.closest('.eff-respective');
    //         const rect = target.getBoundingClientRect();
    //         const x = e.clientX - rect.left;
    //         const y = e.clientY - rect.top;

    //         setTimeout(() => {
    //             !target.classList.contains('animation-mousemove') || target.classList.remove('animation-mousemove')
    //         }, 300)

    //         // Normalize
    //         const normalizedX = x / rect.width;
    //         const normalizedY = y / rect.height;

    //         // Convert to value between (-12.5 * 12.5)
    //         const yRotate = -pushAmount + ((pushAmount * 2) * normalizedX);
    //         const xRotate = -pushAmount + ((pushAmount * 2) * normalizedY);

    //         // Apply Rotation
    //         target.style.transform = 'perspective(300px) RotateY(' + yRotate + 'deg) RotateX(' + -xRotate + 'deg)';
    //         //target.style.boxShadow = '0px 0px 62px 9px rgba(53,46,255,0.9), inset 0px 0px 27px 0px rgba(255,255,255,1)';
    //     });

    //     // Restore on Exit
    //     items[x].addEventListener('mouseleave', (e) => {
    //         const target = e.target;
    //         target.classList.add('animation-mouseleave')
    //         setTimeout(() => {
    //             !target.classList.contains('animation-mouseleave') || target.classList.remove('animation-mouseleave')
    //             target.style.transform = 'Rotate(0deg)';
    //             target.style.boxShadow = 'none'
    //             target.classList.add('animation-mousemove')
    //         }, 300)

    //     })
    // }

    /* ==============================================
    button page scroll-top
    ============================================== */

    if (document.querySelector('.float-bar__top')) {
        const btnPageScrollTop = document.querySelector('.float-bar__top')
        const btnFloat = document.querySelector('.float-bar')
        btnPageScrollTop.addEventListener('click', e => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            })
        })

        window.addEventListener('scroll', e => {
            if (document.documentElement.scrollTop > 400) {
                btnFloat.classList.add('is-active')
            } else {
                if (btnFloat.classList.contains('is-active')) btnFloat.classList.remove('is-active')
            }
        })
    }

    /* =================================================
     popups
     =================================================*/

    function popupSuccess() {

        const instansePopup = new afLightbox({
            mobileInBottom: true
        })

        instansePopup.open(`
            
           <div class="popup-thanks" >
           
           <h2> Спасибо! </h2>
           <p>Мы свяжемся с вами в ближайшее время!</p>
           
           </div>

            `, false)

    }

    if (document.querySelector('[data-modal]')) {
        const items = document.querySelectorAll('[data-modal]')

        items.forEach(item => {
            item.addEventListener('click', e => {

                window.ajax({
                    type: 'GET',
                    url: item.dataset.modal
                }, (status, response) => {

                    const instansePopup = new afLightbox({
                        mobileInBottom: true
                    })

                    instansePopup.open(response, (instanse) => {
                        initMaska()

                        if (instanse.querySelector('form')) {
                            const form = instanse.querySelector('form')

                            form.addEventListener('submit', e => {

                                e.preventDefault()

                                const formData = new FormData(e.target)
                                let params = {}
                                let btn = form.querySelector('.btn')

                                for (let [name, value] of formData) {
                                    params[name] = value
                                }

                                btn.classList.add('btn-loading')

                                window.ajax({
                                    type: 'POST',
                                    url: form.getAttribute('action'),
                                    data: params

                                }, (status, response) => {

                                    if (status == 200) {
                                        popupSuccess();
                                        !btn.classList.contains('btn-loading') || btn.classList.remove('btn-loading')
                                        instansePopup.close()
                                    }


                                })
                            })
                        }

                        if (item.dataset.title) {
                            instanse.querySelector('.popup-form__title').innerHTML = item.dataset.title
                        }

                        if (item.dataset.desc) {
                            instanse.querySelector('.popup-form__desc').innerHTML = item.dataset.desc
                        }
                    })
                })

            })
        })
    }

    /* ========================================
    block in viewport
    ========================================*/

    // Получаем нужный элемент


    const Visible = function (target) {
        let targetPosition = {
                top: window.scrollY + target.getBoundingClientRect().top,
                left: window.scrollX + target.getBoundingClientRect().left,
                right: window.scrollX + target.getBoundingClientRect().right,
                bottom: window.scrollY + target.getBoundingClientRect().bottom
            },

            windowPosition = {
                top: window.scrollY,
                left: window.scrollX,
                right: window.scrollX + document.documentElement.clientWidth,
                bottom: window.scrollY + document.documentElement.clientHeight - 100
            };

        if (targetPosition.bottom > windowPosition.top &&
            targetPosition.top < windowPosition.bottom &&
            targetPosition.right > windowPosition.left &&
            targetPosition.left < windowPosition.right) {


            if (!target.classList.contains('animated')) {
                target.classList.add('animated')
            }

        } else {
            // !target.classList.contains('animated') || target.classList.remove('animated')
        };
    };

    if (document.querySelector('.animate')) {
        const items = document.querySelectorAll('.animate');

        const checkVisible = (items) => {
            items.forEach(item => Visible(item))
        }

        window.addEventListener('scroll', function () {
            checkVisible(items);
        });

        checkVisible(items);
    }

    /* ========================================
    sdsjd
    ========================================*/

    class ItemServices {
        constructor(el) {
            this.$el = el
            this.btnShow = this.$el.querySelectorAll('[data-services="show"]')
            this.tabs = this.$el.querySelector('[data-services="tabs"]')
            this.cont = this.$el.querySelector('[data-services="content"]')
            this.btnClose = this.$el.querySelector('[data-services="close"]')
            this.addEvents()
        }

        open() {
            this.$el.classList.toggle('is-open')

            if (document.body.clientWidth < 992) {
                window.scrollToTargetAdjusted({
                    elem: this.$el,
                    offset: 50
                })
            }
        }

        close() {
            !this.$el.classList.contains('is-open') || this.$el.classList.remove('is-open')
        }

        changeTab(tabIndex) {

            Array.from(this.cont.children).forEach((item, index) => {
                !item.classList.contains('is-active') || item.classList.remove('is-active')

                if (tabIndex == index) {
                    item.classList.add('is-active')
                }
            })

            Array.from(this.tabs.children).forEach((item, index) => {
                !item.classList.contains('is-active') || item.classList.remove('is-active')

                if (tabIndex == index) {
                    item.classList.add('is-active')
                }
            })


        }

        addEvents() {
            this.btnShow.forEach(item => {
                item.addEventListener('click', (e) => {
                    if (!e.target.closest('a')) this.open()
                })

                item.addEventListener('mouseenter', () => {
                    this.$el.classList.add('is-hover')
                })

                item.addEventListener('mouseleave', () => {
                    !this.$el.classList.contains('is-hover') || this.$el.classList.remove('is-hover')
                })
            })

            //tab

            this.tabs.querySelectorAll('li').forEach((item, i) => {
                item.addEventListener('click', e => this.changeTab(i))
            })

            //close

            this.btnClose.addEventListener('click', e => {
                e.stopPropagation()
                this.close()
            })
        }
    }

    if (document.querySelector('.item-service')) {
        document.querySelectorAll('.item-service').forEach(item => new ItemServices(item))
    }

    /* =========================================
    filter projects list
    =========================================*/

    class Filter {
        constructor(el) {
            this.$el = el
            this.btnOpen = null;
            this.init()
        }

        init() {
            document.querySelector('.float-bar').prepend(this.getButtonOpenFilter())
        }

        getButtonOpenFilter() {
            this.btnOpen = document.createElement('div')
            this.btnOpen.classList.add('float-bar__filter')
            this.btnOpen.innerHTML = '<span>Фильтр</span>'
            this.btnOpen.addEventListener('click', e => this.toggle())

            return this.btnOpen
        }

        toggle() {
            this.$el.classList.contains('is-open') ? this.close() : this.open()
        }

        open() {
            this.$el.classList.add('is-open')
            this.btnOpen.classList.add('is-open')
        }

        close() {
            !this.$el.classList.contains('is-open') || this.$el.classList.remove('is-open');
            !this.btnOpen.classList.contains('is-open') || this.btnOpen.classList.remove('is-open');
        }
    }

    if (document.querySelector('[data-portfolio="filter"]')) new Filter(document.querySelector('[data-portfolio="filter"]'))


    /* ===============================================
    slider data-slider="other"
    ===============================================*/

    if (document.querySelector('[data-slider="other"]')) {
        const splideProject = new Splide('[data-slider="other"]', {

            perPage: 2,
            perMove: 1,
            gap: 32,
            pagination: false,

            breakpoints: {
                1440: {
                    gap: 24,
                },
                1024: {
                    perPage: 3,
                    gap: 20
                },
                768: {
                    fixedWidth: 300,
                    perPage: 1,
                    pagination: true,
                },
            },

            arrowPath: 'M13.531 8.523a1.835 1.835 0 012.567 0l10.37 10.213c.71.698.71 1.83 0 2.528l-10.37 10.213a1.835 1.835 0 01-2.566 0 1.768 1.768 0 010-2.528L22.618 20l-9.088-8.949a1.768 1.768 0 010-2.528z'
        });

        splideProject.mount();
    }

    /* ========================================
    slider on project details 
    ========================================*/

    if (document.querySelector('[data-slider="main-project"]')) {

        const sliderMain = new Splide('[data-slider="main-project"]', {
            type: 'fade',
            pagination: false,
            arrows: false,
            cover: true,
        });

        const thumbnails = new Splide('[data-slider="thumb-project"]', {
            rewind: true,
            isNavigation: true,
            gap: 6,
            //focus: 'center',
            pagination: false,
            fixedWidth: 120,
            updateOnMove: true,
            cover: true,
            arrows: false,
            dragMinThreshold: {
                mouse: 4,
                touch: 10,
            },

            breakpoints: {
                768: {
                    fixedWidth: 100,
                    gap: 0
                },
            },

        });

        const next = document.querySelector('[data-slider="project-thumb-next"]')
        const prev = document.querySelector('[data-slider="project-thumb-prev"]')

        const checkNavButton = () => {

            let slidesWidth = 0
            let containerWidth = sliderMain.root.querySelector('.splide__track').clientWidth

            sliderMain.root.querySelectorAll('.splide__slide').forEach(item => {
                slidesWidth += (item.clientWidth - 3) + sliderMain.options.gap
            })

            next.style.display = (slidesWidth <= containerWidth ? 'none' : 'flex')
            prev.style.display = (slidesWidth <= containerWidth ? 'none' : 'flex')

        }

        sliderMain.on('ready', (e) => {
            checkNavButton()
        })

        sliderMain.on('resized', (e) => {
            checkNavButton()
        })

        sliderMain.on('moved', (e) => {
            checkNavButton()
        })

        next.addEventListener('click', e => sliderMain.go('>'))
        prev.addEventListener('click', e => sliderMain.go('<'))

        sliderMain.sync(thumbnails);
        sliderMain.mount();
        thumbnails.mount();

    }

    /* ========================================
    data show props
    ========================================*/

    if (document.querySelector('[data-show="props"]')) {

        let btn = document.querySelector('[data-show="props"]')

        btn.addEventListener('click', (e) => {
            let container = e.target.closest('.project-aside').querySelector('.project-aside__props')
            container.classList.toggle('is-open')
            btn.classList.toggle('is-open')
            btn.querySelector('span').innerText = container.classList.contains('is-open') ? 'Скрыть' : 'Больше параметров'
        })
    }


    /* ==============================================
    view all photo
    ============================================== */

    if (document.querySelector('[data-slider="main-project"]')) {

        function openGalleryProduct(index) {
            const img = document.querySelectorAll('[data-slider="main-project"] img')
            const arrImage = [];

            img.forEach(image => {
                arrImage.push(image.getAttribute('src'))
            })

            const instance = new FsLightbox();
            instance.props.dots = true;
            instance.props.type = "image";
            instance.props.sources = arrImage;
            instance.open(index)

        }


        document.querySelectorAll('[data-slider="main-project"] .splide__slide').forEach((item, index) => {
            item.addEventListener('click', e => openGalleryProduct(index))
        })

    }

    /* ========================================
    slider review on project
    ========================================*/

    if (document.querySelector('[data-slider="review-project"]')) {

        const reviewMain = new Splide('[data-slider="review-project"]', {

            pagination: false,
            arrows: false,
            cover: true,
            perPage: 2,
            gap: 32,

            breakpoints: {
                576: {
                    perPage: 1,
                    gap: 16
                },
            },

        });

        const reviewThumbnails = new Splide('[data-slider="thumb-review"]', {
            rewind: true,
            isNavigation: true,
            gap: 6,
            //focus: 'center',
            pagination: false,
            fixedWidth: 120,
            updateOnMove: true,
            cover: true,
            arrows: false,
            dragMinThreshold: {
                mouse: 4,
                touch: 10,
            },

            breakpoints: {
                768: {
                    fixedWidth: 100,
                    gap: 0
                },
            },

        });

        const next = document.querySelector('[data-slider="review-thumb-next"]')
        const prev = document.querySelector('[data-slider="review-thumb-prev"]')

        const checkNavButton = () => {

            let slidesWidth = 0
            let containerWidth = reviewMain.root.querySelector('.splide__track').clientWidth

            reviewMain.root.querySelectorAll('.splide__slide').forEach(item => {
                slidesWidth += (item.clientWidth - 3) + reviewMain.options.gap
            })

            next.style.display = (slidesWidth <= containerWidth ? 'none' : 'flex')
            prev.style.display = (slidesWidth <= containerWidth ? 'none' : 'flex')

        }

        reviewMain.on('ready', (e) => {
            checkNavButton()
        })

        reviewMain.on('resized', (e) => {
            checkNavButton()
        })

        reviewMain.on('moved', (e) => {
            checkNavButton()
        })

        next.addEventListener('click', e => reviewMain.go('>'))
        prev.addEventListener('click', e => reviewMain.go('<'))

        reviewMain.sync(reviewThumbnails);
        reviewMain.mount();
        reviewThumbnails.mount();

    }

    /* =======================================
    floatNavMenu
    =======================================*/

    if (document.querySelector('.about-nav')) {

        const container = document.querySelector('.section-about-autor .container')
        const menu = container.querySelector('.about-nav')


        function calcRightOffset(container, menu) {
            const right = (container.offsetLeft + container.clientWidth) - menu.clientWidth
            menu.style.left = (right - 24) + 'px'
            menu.classList.add('is-init')
        }



        calcRightOffset(container, menu);

        window.addEventListener('resize', () => {
            calcRightOffset(container, menu);
        })

        menu.querySelectorAll('a').forEach(item => {
            item.addEventListener('click', e => {
                e.preventDefault()

                if (document.querySelector(item.getAttribute('href'))) {
                    window.scrollToTargetAdjusted({
                        elem: document.querySelector(item.getAttribute('href')),
                        offset: 20
                    })
                }

                menu.querySelectorAll('a').forEach(link => !link.classList.contains('is-active') || link.classList.remove('is-active'))
                item.classList.add('is-active')


            })
        })

        const isVisible = function (target) {
            let targetPosition = {
                    top: window.scrollY + target.getBoundingClientRect().top,
                    left: window.scrollX + target.getBoundingClientRect().left,
                    right: window.scrollX + target.getBoundingClientRect().right,
                    bottom: window.scrollY + target.getBoundingClientRect().bottom
                },

                windowPosition = {
                    top: window.scrollY,
                    left: window.scrollX,
                    right: window.scrollX + document.documentElement.clientWidth,
                    bottom: window.scrollY + document.documentElement.clientHeight - 100
                };

            if (targetPosition.bottom > windowPosition.top &&
                targetPosition.top < windowPosition.bottom &&
                targetPosition.right > windowPosition.left &&
                targetPosition.left < windowPosition.right) {
                return true
            } else {
                return false
            };
        };

        const items = document.querySelectorAll('section[id]');

        function debounce(method, delay, e) {
            clearTimeout(method._tId);
            method._tId = setTimeout(function () {
                method(e);
            }, delay);
        }

        const checkVisible = (items) => {
            this._tId = false
            items.forEach(item => {
                if (isVisible(item)) {
                    menu.querySelectorAll('a').forEach(link => !link.classList.contains('is-active') || link.classList.remove('is-active'))
                    if (menu.querySelector('a[href="#' + item.id + '"]')) {
                        menu.querySelector('a[href="#' + item.id + '"]').classList.add('is-active')
                    }
                }
            })
        }

        window.addEventListener('scroll', (e) => {

            const resizeHahdler = (e) => {
                checkVisible(items)
            }

            debounce(resizeHahdler, 300, e)
        });

    }

    /* ===============================================
    slider gallery article
    ===============================================*/

    if (document.querySelector('[data-slider="gallery-article"]')) {

        document.querySelectorAll('[data-slider="gallery-article"]').forEach(slider => {

            if (slider.querySelectorAll('.splide__slide').length >= 2) {

                slider['splideInstance'] = new Splide(slider, {

                    perPage: 2,
                    perMove: 1,
                    gap: 12,
                    pagination: true,

                    breakpoints: {
                        768: {

                            perPage: 1,
                            pagination: true,
                        },
                    },

                    arrowPath: 'M13.531 8.523a1.835 1.835 0 012.567 0l10.37 10.213c.71.698.71 1.83 0 2.528l-10.37 10.213a1.835 1.835 0 01-2.566 0 1.768 1.768 0 010-2.528L22.618 20l-9.088-8.949a1.768 1.768 0 010-2.528z'
                });

                slider['splideInstance'].mount();

            }


        })
    }

    /* ==============================================
    details-nav
    ==============================================*/

    class NavDetails {
        constructor(params) {
            this.$el = document.querySelector(params.el)
            this.$article = document.querySelector(params.article)
            this.headers = this.$article.querySelectorAll('h1, h2, h3, h4')

            this.init()
        }

        init() {

            this.headers.forEach(el => {
                this.createNavList(el)
            })

            this.addEvents()
        }

        scrollToEl(header) {
            window.scrollToTargetAdjusted({
                elem: header,
                offset: document.querySelector('.header').clientHeight
            })
        }

        createNavList(el) {
            let li = document.createElement('li')
            li.innerHTML = '<a href="#" >' + el.innerText + '</a>'

            li.addEventListener('click', (e) => {
                e.preventDefault()
                this.scrollToEl(el)
                this.setActiveNav(li)
            })

            this.$el.querySelector('ul').append(li)
        }

        setActiveNav(activeEl) {
            this.$el.querySelectorAll('li').forEach(li => {
                !li.classList.contains('is-active') || li.classList.remove('is-active')
            })

            activeEl.classList.add('is-active')
        }

        isVisible = function (target) {
            let targetPosition = {
                    top: window.scrollY + target.getBoundingClientRect().top,
                    left: window.scrollX + target.getBoundingClientRect().left,
                    right: window.scrollX + target.getBoundingClientRect().right,
                    bottom: window.scrollY + target.getBoundingClientRect().bottom
                },

                windowPosition = {
                    top: window.scrollY,
                    left: window.scrollX,
                    right: window.scrollX + document.documentElement.clientWidth,
                    bottom: window.scrollY + (document.documentElement.clientHeight / 2)
                };

            if (targetPosition.bottom > windowPosition.top &&
                targetPosition.top < windowPosition.bottom &&
                targetPosition.right > windowPosition.left &&
                targetPosition.left < windowPosition.right) {
                return true
            } else {
                return false
            };
        };



        debounce(method, delay, e) {
            clearTimeout(method._tId);
            method._tId = setTimeout(function () {
                method(e);
            }, delay);
        }

        addEvents() {
            window.addEventListener('scroll', (e) => {

                const resizeHahdler = (e) => {
                    this.headers.forEach(item => {
                        if (this.isVisible(item)) {

                            this.$el.querySelectorAll('li').forEach(li => {
                                if (item.innerText == li.innerText) {
                                    li.classList.add('is-active')
                                } else {
                                    !li.classList.contains('is-active') || li.classList.remove('is-active')
                                }
                            })

                        }
                    })
                }

                this.debounce(resizeHahdler, 300, e)
            });
        }
    }

    if (document.querySelector('.blog-details')) {
        new NavDetails({
            el: '.details-nav',
            article: '.article',
        })
    }

    if (document.querySelector('.page-books')) {
        new NavDetails({
            el: '.books-nav',
            article: '.page-books__main',
        })
    }

    /* ===========================================
    book slider
    ===========================================*/

    if (document.querySelector('.book-slider')) {
        class BookSlider {
            constructor(el) {
                this.$el = el
                this.slides = this.$el.querySelectorAll('.book-slider__item')
                this.pagination = this.$el.querySelector('.book-slider__pagination ul')
                this.arrowNext = this.$el.querySelector('[data-bs="next"]')
                this.arrowPrev = this.$el.querySelector('[data-bs="prev"]')

                this.createPagination()
                this.addEvents()

                this.currentSlide = 0;
                this.stateChange = false
                this.loop = true

                this.init()


            }

            init() {
                this.$el.classList.add('is-loaded')

                setTimeout(() => {
                    this.$el.classList.add('is-init')
                }, 1000)

                //this.changeSlide(0)
            }

            createPagination() {

                for (let i = 0; i <= Math.floor((this.slides.length / 2) - 1); i++) {

                    let page = document.createElement('li')

                    page.addEventListener('click', e => {
                        this.currentSlide = i * 2
                        this.changeSlide(i * 2);

                    })

                    this.pagination.append(page)
                }

                this.pagination.querySelector('li').classList.add('is-active')
            }

            changePagination(slide) {

                slide = slide ? slide : this.currentSlide

                this.pagination.querySelectorAll('li').forEach((li, index) => {
                    if ((Math.ceil((slide / 2))) == index) {
                        li.classList.add('is-active')
                    } else {
                        !li.classList.contains('is-active') || li.classList.remove('is-active')
                    }
                })
            }



            changeSlide(index) {

                this.stateChange = true;

                this.slides.forEach(slide => {
                    if (slide.classList.contains('is-active')) {
                        slide.classList.add('animate-hide')
                        setTimeout(() => {
                            slide.classList.remove('is-active')
                        }, 500)
                    }
                })

                setTimeout(() => {
                    this.slides[index].classList.add('is-active');
                    !this.$el.querySelector('.animate-hide') || this.$el.querySelector('.animate-hide').classList.remove('animate-hide');

                    this.stateChange = false;

                }, 500)

                this.changePagination()
            }

            nextSlide() {

                if ((this.currentSlide + 2) < this.slides.length) {
                    this.currentSlide = this.currentSlide + 2
                } else {
                    if (this.loop) this.currentSlide = 0
                }

                if (!this.stateChange) this.changeSlide(this.currentSlide)
            }
            prevSlide() {

                if (this.currentSlide >= 2) {
                    this.currentSlide = this.currentSlide - 2
                }

                if (!this.stateChange) this.changeSlide(this.currentSlide)
            }

            openGallery(item, index) {

                const arrImage = [];

                this.slides.forEach(slide => {
                    arrImage.push(slide.querySelector('img').getAttribute('src'))
                })

                const instance = new FsLightbox();
                instance.props.dots = true;
                instance.props.type = "image";
                instance.props.sources = arrImage;
                instance.open(index)
            }

            addEvents() {

                this.arrowNext.addEventListener('click', e => this.nextSlide())
                this.arrowPrev.addEventListener('click', e => this.prevSlide())

                this.slides.forEach((item, index) => item.addEventListener('click', () => this.openGallery(item, index)))

            }
        }

        document.querySelectorAll('.book-slider').forEach(el => new BookSlider(el))
    }

    /* =========================================
    video youtube
    =========================================*/

    if (document.querySelector('.video')) {
        document.querySelectorAll('.video').forEach(container => {

            if (container.closest('.video-block__yt')) return false

            const getYoutubeId = (url) => {
                var m = url.match(/^.*(?:youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/);
                if (!m || !m[1]) return null;
                return m[1];
            }

            container.querySelector('.video__button').addEventListener('click', e => {
                container.classList.add('is-play')

                let iframe = document.createElement('iframe')
                iframe.setAttribute('allowfullscreen', '')
                iframe.setAttribute('src', '//www.youtube.com/embed/' + getYoutubeId(container.dataset.id) + '?autoplay=true')

                container.querySelector('.video__iframe').append(iframe)
            })


        })
    }




});