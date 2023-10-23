import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import "../styles/sass/banner-principal.scss"
function BannerPrincipal() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true
    };
    return (
        <div className="container-slider">
            <Slider {...settings}>
        <div>
            <img className="slider-img" src="https://fundacionsentidos.org/wp-content/uploads/2018/04/8673664599_e9df03de73_b.jpg" alt="Image 1" />
            <div className="slider-text">
                <h3 div className="slider-title">Title 1</h3>
                <p className="slider-description">Description for Image 1</p>
            </div>
        </div>
        <div>
            <img className="slider-img" src="https://www.webpurify.com/site/wp-content/uploads/2020/08/comnunity-guidelines.jpg" alt="Image 2" />
            <div className="slider-text">
                <h3 className="slider-title">Title 2</h3>
                <p className="slider-description">Description for Image 2</p>
            </div>
        </div>
        <div>
            <img className="slider-img" src="https://www.utahsafetycouncil.org/uploads/Sq.Logo_Web(1).jpg" alt="Image 3" />
            <div className="slider-text">
                <h3 className="slider-title">Title 3</h3>
                <p className="slider-description">Description for Image 3</p>
            </div>
        </div>
        {/* Add more slides as needed */}
    </Slider>

        </div>
    )
}

export default BannerPrincipal;