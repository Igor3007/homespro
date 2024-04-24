document.addEventListener('DOMContentLoaded', function (event) {


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


});