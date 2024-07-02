import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Home() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
  };

  return (
    <div className="py-5 bg-[url('https://quanildivo.vn/wp-content/uploads/2023/10/Artboard-2-scaled.jpg')]">
      <div className="text-center">
        <h2 className="text-[rgb(240,248,255)] font-bold text-6xl">ILDIVO</h2>
        <h2 className="mt-5 text-[rgb(242,237,215)] text-4xl">
          MÓN ĂN "PHẢI THỬ"
        </h2>
      </div>
      <div className="mt-8">
        <div className="container">
          <Slider {...settings}>
            <div>
              <img src="https://quanildivo.vn/wp-content/uploads/2023/10/Muc-nuong-thom-cay-400x400.jpg" alt="Image 1" />
            </div>
            <div>
              <img src="https://quanildivo.vn/wp-content/uploads/2023/10/Muc-nuong-thom-cay-400x400.jpg" alt="Image 2" />
            </div>
            <div>
              <img src="https://quanildivo.vn/wp-content/uploads/2023/10/Muc-nuong-thom-cay-400x400.jpg" alt="Image 3" />
            </div>
          </Slider>
        </div>
      </div>
    </div>
  );
}

export default Home;
