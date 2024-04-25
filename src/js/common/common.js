document.addEventListener('DOMContentLoaded', function (event) {

    /* =================================================
    smooth scroll
    ================================================= */

    window.scrollToTargetAdjusted = function (params) {

        let element = typeof params.elem == 'string' ? document.querySelector(params.elem) : params.elem
        let headerOffset = 15;
        let elementPosition = element.offsetTop
        let offsetPosition = elementPosition - headerOffset - params.offset;


        if (document.querySelector('header')) offsetPosition - document.querySelector('header').height

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    }


    if (document.querySelector('.btn-burger')) {
        document.querySelector('.btn-burger').addEventListener('click', e => {
            document.querySelector('.btn-burger').classList.toggle('open')
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
            this.shift = 17
            this.scrollDirection = '-'

            setTimeout(() => {
                this.init()
            }, 3000)

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

                this.$el.querySelector('.about-block__track').style.transform = 'translateX(-' + this.currentPosition + 'px)'
            }, 290)
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

    if (document.querySelector('[data-marquee]')) {
        document.querySelectorAll('[data-marquee="container"]').forEach(item => new Marquee(item))
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
            this.iframe.src = '//www.youtube.com/embed/' + this.parseYoutubeId(this.player.dataset.id) + '?autoplay=true'
            this.player.querySelector('.video__iframe').append(this.iframe)

            this.$el.classList.add('is-playing')
        }

        mountPlayer(data) {
            this.title.innerText = data.title
            this.desc.innerText = data.desc
            this.player.querySelector('img').src = data.preview;
            this.player.dataset.id = data.link
            this.play()

            if (this.$el.classList.contains('is-fullwidth')) this.scrollTop()
        }

        scrollTop() {
            window.scrollToTargetAdjusted({
                elem: '.section-video-block',
                offset: -120
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
        const splideProject = new Splide('[data-slider="team"]', {

            perPage: 4,
            perMove: 1,
            gap: 32,
            pagination: false,

            breakpoints: {
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

    /* ===============================================
    slider project
    ===============================================*/

    if (document.querySelector('[data-slider="project"]')) {
        const splideThumb = new Splide('[data-slider="project"]', {

            perPage: 1,
            perMove: 1,
            gap: 24,
            pagination: false,
            isNavigation: false,
            arrowPath: 'M13.531 8.523a1.835 1.835 0 012.567 0l10.37 10.213c.71.698.71 1.83 0 2.528l-10.37 10.213a1.835 1.835 0 01-2.566 0 1.768 1.768 0 010-2.528L22.618 20l-9.088-8.949a1.768 1.768 0 010-2.528z'
        });

        splideThumb.mount();
    }

    /* ===============================================
    slider project-thumb 
    ===============================================*/

    if (document.querySelector('[data-slider="project-thumb"]')) {
        var splide = new Splide('[data-slider="project-thumb"]', {

            perPage: 1,
            perMove: 1,
            gap: 12,
            pagination: false,
            fixedWidth: 100,
            isNavigation: false,
            arrowPath: 'M13.531 8.523a1.835 1.835 0 012.567 0l10.37 10.213c.71.698.71 1.83 0 2.528l-10.37 10.213a1.835 1.835 0 01-2.566 0 1.768 1.768 0 010-2.528L22.618 20l-9.088-8.949a1.768 1.768 0 010-2.528z'
        });

        splide.mount();
    }




});