import React from "react";

const GallerySimple = () => {
  const images = [
    "https://lh3.googleusercontent.com/pw/ABLVV87lYwjkMjuCH9pBxTOhTHgv7WFOlhWRrzYjt7O9pLaNNcq-Z6wqiDi_GGTfjQV8aF8csaoCcSPxeT-wq6BG4TJieHVX0Lsn0LQDfRNSBBJnPaV6weFZ2i5dYyzsh3sPPUdoPd-PT1BbgmuNfjpUfiiasA=w1236-h927-s-no?authuser=0",
    "https://lh3.googleusercontent.com/pw/ABLVV87V-fDIQqhJA1enDa8DeZ8verpnSxTNEdKNqOSXzvjmDI0wA4zO2K3BQPN5k9sTthdDzNp4sQVRQMk_iq-ec5o_qFfaM4uS6i6XcOsFIzahPRc_WzZhUeKxliLCxtLHy3UnWTdsPnqUokKFlfk14sIgnw=w1236-h927-s-no?authuser=0",
    "https://lh3.googleusercontent.com/pw/ABLVV8439HiM7FiIGz-k3Qq3_8KlzooowWXHGhA1OJ_q7aBFhXJ6jHXo9n30RQELtWf_aHmKXG9Xb67DayFc6MyrADulqVbs0PdyT7WE8afka7tLr5jJUcoP_QYiBS5La31SHLtlPZlsrhcK1spH2LxA5TanOQ=w1231-h927-s-no?authuser=0",
    "https://lh3.googleusercontent.com/pw/ABLVV84ydFt4-YaP3MOt-84nPLm3YnAo1ePScicqz10ZnLWtkfYX5IbaicPVpWJlfkrBsT4p_T-HEXjgJA3ASb2v0fVd4wKiCtSkEjJqWlc9NqTUV5J8rvu30wPOWhuD3FbGldLU0qwZonaMvPEeUxrzSmredA=w1236-h927-s-no?authuser=0",
    "https://lh3.googleusercontent.com/pw/ABLVV840K07O4FOmIN1sCPJGnRrlP0b21jyhrAE7gtBqvi1eUAd2m-nXB3psRXG8lFHJuB8FVG-64bKdIe6_xBFod0Smqnb0U6_iRQ2EbroWQu-oQxZ9P51FRPrDgj230wL07HfEpkgex4ZDq0_5IY6B5z5ZRQ=w1231-h927-s-no?authuser=0",
    "https://lh3.googleusercontent.com/pw/ABLVV86luu6pfW12nE90I1_sz9mmyWWzL09GsDlYTqHJJKFtqZ0LNlgsEL7NoWIC04X8nWX82mt8z5f_Txracg3OlOlh1ASqwgZ5bqbtBkgA-GkQw0ezciHbpzUdbQgT87z98NeiXBvkg6DMGWLcAKuSDq_G6Q=w1231-h927-s-no?authuser=0",
  ];

  const placeholder =
    "http://localhost:3000/images/institute-of-engineering-and-technology-logo.png";

    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {images.map((src, i) => (
          <div key={i} className="group relative overflow-hidden rounded-2xl shadow-lg cursor-pointer">
            <div className="aspect-w-4 aspect-h-3 w-full h-64">
              <img
                alt={`gallery-${i}`}
                className="w-full h-full object-cover object-center transform transition-transform duration-500 group-hover:scale-110"
                src={src}
                onError={(e) => (e.currentTarget.src = placeholder)}
                loading="lazy"
              />
            </div>
            {/* Overlay effect */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
          </div>
        ))}
      </div>
    </div>
};

export default GallerySimple;
