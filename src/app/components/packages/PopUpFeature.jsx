"use client";
import { getPackageGradient, handleGetQuery } from "./PackageUtils";

const PopUpFeature = ({ selectedPackage, onClose }) => {
    const handleCloseDetails = () => {
        if (onClose) {
            onClose();
        }
    };

    console.log(selectedPackage)

    if (!selectedPackage) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl relative">
                <div className={`h-67 ${getPackageGradient(selectedPackage.category)} flex items-center justify-center relative`}>
                    {/* Image Container */}
                    <div className="relative w-full overflow-hidden bg-blue-5">
                        {/* Image Container */}
<div className="relative w-full overflow-hidden 
                aspect-[4/3] 
                md:aspect-[5/2]
">

  <img
    src={selectedPackage.image}
    alt={selectedPackage.title}
    className="w-full h-full object-covern bg-red-500"
  />

</div>

                        {/* Duration Badge */}
                        <div className="absolute sm:top-10 top-5 left-3">
                            <span className="px-3 py-1  bg-white/100 backdrop-blur-sm text-gray-800 text-xs font-semibold rounded-full">
                                {selectedPackage.duration}
                            </span>
                        </div>

                        {/* Discount Badge */}
                        {/* {selectedPackage.discount && (
              <div className="absolute top-[30vh] right-3">
                <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                  {selectedPackage.discount}% OFF
                </span>
              </div>
            )} */}
                    </div>

                    <button
                        onClick={handleCloseDetails}
                        className="absolute top-4 right-4 w-10 h-10 bg-black/20 font-weight backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-300"
                    >
                        ×
                    </button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-192px)]">
                    <h3 className="text-2xl font-bold text-red-900 mb-4">{selectedPackage.title}</h3>

                    <div className="flex items-center gap-4 mb-2">
                        <div className="flex items-center gap-2">
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} className={`w-5 h-5 ${i < Math.floor(selectedPackage.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                        <span className="text-gray-600">{selectedPackage.rating}</span>
                        {/* <span className="text-gray-400">•</span>
            <span className="text-gray-600">{selectedPackage.duration}</span> */}
                    </div>

                    <p className="text-gray-700 mb-3">{selectedPackage.description}</p>

                    <div className="mb-2">
                        <h4 className="font-semibold text-gray-900 mb-3">Package Inclusions:</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {selectedPackage.inclusions.map((inclusion, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    {inclusion}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* <div className="flex items-center justify-between mb-6">
            {/* <div>
              <span className="text-3xl font-bold text-gray-900">{selectedPackage.price}</span>
              {selectedPackage.originalPrice && (
                <span className="text-lg text-gray-400 line-through ml-2">{selectedPackage.originalPrice}</span>
              )}
            </div> */}
                    {/* {selectedPackage.discount && (
              <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
                {selectedPackage.discount}% OFF
              </span>
            )} */}
                    {/* </div> */}

                    <div className="flex gap-3">
                        <button
                            onClick={() => handleGetQuery(selectedPackage)}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105"
                        >
                            Get Query
                        </button>
                        <button
                            onClick={handleCloseDetails}
                            className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 transition-all duration-300"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PopUpFeature;