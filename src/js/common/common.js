$(document).ready(function () {


    function scrollElement(container, elem) {

        var rect = elem.getBoundingClientRect();
        var rectContainer = container.getBoundingClientRect();

        let elemOffset = {
            top: rect.top + document.body.scrollTop,
            left: rect.left + document.body.scrollLeft
        }

        let containerOffset = {
            top: rectContainer.top + document.body.scrollTop,
            left: rectContainer.left + document.body.scrollLeft
        }

        let leftPX = elemOffset.top - containerOffset.top + container.scrollTop - (container.offsetWidth / 2) + (elem.offsetWidth / 2)

        container.scrollTo({
            top: leftPX,
            behavior: 'smooth'
        });

    }

    const thumbContainer = document.querySelector('[data-slider-thumb="gallery"]')

    $('[data-slider="gallery"]').slick({
        arrows: false
    });

    $('[data-slider="gallery"]').on('beforeChange', function (event, slick, currentSlide, nextSlide) {
        thumbContainer.querySelectorAll('li').forEach((item, index) => {
            if (item.classList.contains('is-active')) {
                item.classList.remove('is-active')
            }

            if (nextSlide == index) {
                item.classList.add('is-active')
                scrollElement(thumbContainer, item)
            }

        })


    });

    thumbContainer.querySelectorAll('li').forEach((item, i) => {
        item.addEventListener('click', e => {
            $('[data-slider="gallery"]').slick('slickGoTo', i)
        })
    })




});

document.addEventListener("DOMContentLoaded", function (event) {




})