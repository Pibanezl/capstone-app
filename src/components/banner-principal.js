import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import "../styles/sass/banner-principal.scss";
import "../styles/sass/general.scss";

function BannerPrincipal() {
    const [imagesLoaded, setImagesLoaded] = useState(false);

    /*const handleImageLoad = () => {
        setImagesLoaded(true);
    };*/

    useEffect(() => {
        const imagesToPreload = [
            "https://web.larioja.org/landing/convivencia-escolar/img/convivencia-escolar---IMAGEN-PRINCIPAL-MOVIL.jpg",
            "https://www.webpurify.com/site/wp-content/uploads/2020/08/comnunity-guidelines.jpg",
            "https://www.utahsafetycouncil.org/uploads/Sq.Logo_Web(1).jpg"
        ];

        let loadedImages = 0;

        const preloadImages = () => {
            imagesToPreload.forEach((src) => {
                const img = new Image();
                img.onload = () => {
                    loadedImages++;
                    if (loadedImages === imagesToPreload.length) {
                        setImagesLoaded(true);
                    }
                };
                img.src = src;
            });
        };

        preloadImages();
    }, []);

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
            {imagesLoaded && (
                <Slider {...settings}>
                    <div>
                        <img
                            className="slider-img"
                            src="https://web.larioja.org/landing/convivencia-escolar/img/convivencia-escolar---IMAGEN-PRINCIPAL-MOVIL.jpg"
                            alt="nosotros"
                        />
                        <div className="slider-text">
                            <h3 className="slider-title" style={{fontSize: 35+"px", background: "#314196", borderRadius:  ".15rem", paddingInline:  ".2rem", width: "fit-content" }}>Guias para la convivencia sana</h3>
                            <p className="slider-description" style={{fontSize: 20+"px", background: "#314196", borderRadius:  ".15rem", paddingInline:  ".2rem", width: "fit-content"}}>Infórmate más acerca de como contribuir a tu entorno y la convivencia con tu comunidad</p>
                        </div>
                    </div>
                    <div>
                        <img
                            className="slider-img"
                            src="https://www.webpurify.com/site/wp-content/uploads/2020/08/comnunity-guidelines.jpg"
                            alt="nobullyng"
                        />
                        <div className="slider-text">
                            <h3 className="slider-title" style={{fontSize: 35+"px", background: "#314196", borderRadius:  ".15rem", paddingInline:  ".2rem", width: "fit-content"}}>Guias para la convivencia sana</h3>
                            <p className="slider-description" style={{fontSize: 20+"px", background: "#314196", borderRadius:  ".15rem", paddingInline:  ".2rem", width: "fit-content"}}>Infórmate más acerca de como contribuir a tu entorno y la convivencia con tu comunidad</p>
                        </div>
                    </div>
                    <div>
                        <img
                            className="slider-img"
                            src="https://www.utahsafetycouncil.org/uploads/Sq.Logo_Web(1).jpg"
                            alt="otros"
                        />
                        <div className="slider-text">
                            <h3 className="slider-title" style={{fontSize: 35+"px", background: "#314196", borderRadius:  ".15rem", paddingInline:  ".2rem", width: "fit-content"}}>Guias para la convivencia sana</h3>
                            <p className="slider-description" style={{fontSize: 20+"px", background: "#314196", borderRadius:  ".15rem", paddingInline:  ".2rem", width: "fit-content"}}>Infórmate más acerca de como contribuir a tu entorno y la convivencia con tu comunidad</p>
                        </div>
                    </div>
                    {/* Add more slides as needed */}
                </Slider>
            )}
        </div>
    );
}

export default BannerPrincipal;