"use client";
import { handleGetQuery } from "../components/packages/PackageUtils";

const BlogShow = ({ selectedBlog, onClose }) => {
    if (!selectedBlog) return null;

    return (
        <section className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 rounded">
            
            {/* Modal Container */}
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl relative">

                {/* Top Image Section (Fixed Height) */}
                <div className="relative w-full overflow-hidden aspect-[4/3] md:aspect-[5/2] flex-shrink-0">
                    <img
                        src={selectedBlog.image}
                        alt={selectedBlog.title}
                        className="w-full h-full object-cover rounded-2xl"
                    />

                    <div className="absolute sm:top-10 top-5 left-3">
                        <span className="px-3 py-1 bg-white text-gray-800 text-xs font-semibold rounded-full">
                            {selectedBlog.category}
                        </span>
                    </div>

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-10 h-10 bg-black/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-300"
                    >
                        ×
                    </button>
                </div>

                {/* Scrollable Content Area */}
                <div className="p-6 overflow-y-auto flex-1">
                    <h3 className="text-2xl font-bold text-red-900 mb-4">
                        {selectedBlog.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
                        <span>{selectedBlog.author}</span>
                        <span>•</span>
                        <span>{selectedBlog.date}</span>
                        <span>•</span>
                        <span>{selectedBlog.readTime}</span>
                    </div>

                    <p className="text-gray-700 mb-6">
                        {selectedBlog.excerpt}
                    </p>

                    <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Tags:</h4>
                        <div className="flex flex-wrap gap-2">
                            {selectedBlog.tags?.map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-full"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => handleGetQuery(selectedBlog)}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105"
                        >
                            Get Query
                        </button>

                        <button
                            onClick={onClose}
                            className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 transition-all duration-300"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BlogShow;