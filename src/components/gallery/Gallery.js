import GalleryMix from "./GalleryMix";
import GallerySimple  from "./GallerySimple";

const Gallery = () => {
    return (
        <section className="pt-[80px] min-h-screen bg-gray-50 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 mt-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                        Campus Gallery
                    </h1>
                    <div className="w-24 h-1.5 bg-gradient-to-r from-blue-400 to-indigo-500 mx-auto rounded-full"></div>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                        Explore the vibrant life at IET Agra, from academic excellence to cultural events and campus infrastructure.
                    </p>
                </div>

                <GalleryMix />
                <GallerySimple />
            </div>
        </section>
    );
}

export default Gallery;