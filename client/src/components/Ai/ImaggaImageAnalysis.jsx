import React, { useState, useEffect } from "react";
import axios from "axios";

const ImaggaImageAnalysis = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showResults, setShowResults] = useState(false);  // New state for visibility control

  // API credentials
  const apiKey = "acc_824b3548032a8d7";
  const apiSecret = "2f934b0070d58f0054e3c1374bbb0a24";
  const encodedCredentials = btoa(`${apiKey}:${apiSecret}`);

  // Debug useEffect to monitor response state
  useEffect(() => {
    if (response) {
      console.log("Response received:", response);
      setShowResults(true);
    }
  }, [response]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setShowResults(false); // Reset results when new image is selected

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit clicked"); // Debug log

    if (!image) {
      setError("Please select an image first.");
      return;
    }

    setLoading(true);
    setShowResults(false);
    setError(null);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const res = await axios({
        method: "post",
        url: "https://api.imagga.com/v2/tags",
        data: formData,
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("API Response:", res.data); // Debug log

      if (res.data && res.data.result) {
        setResponse(res.data.result);
        setShowResults(true);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "An error occurred while analyzing the image."
      );
    } finally {
      setLoading(false);
    }
  };

  // Determine recommended specialist based on tags
  const getRecommendedSpecialist = () => {
    if (!response || !response.tags) return "General Practitioner";

    const tagToSpecialistMap = {
      "skin": "Dermatologist",
      "eye": "Ophthalmologist",
      "heart": "Cardiologist",
    };

    for (const tag of response.tags) {
      const specialist = tagToSpecialistMap[tag.tag.en.toLowerCase()];
      if (specialist) {
        return specialist;
      }
    }

    return "General Practitioner";
  };

  const handleConsultSpecialist = () => {
    const specialist = getRecommendedSpecialist();
    console.log(`Consulting with: ${specialist}`); // Debug log
    // Add your consultation logic here
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Image Analysis with Image
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Select an image to analyze
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>

          {imagePreview && (
            <div className="mt-4 flex justify-center">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-64 rounded-lg shadow-md"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !image}
            className={`w-full py-2 px-4 rounded-md text-white font-medium
              ${
                loading || !image
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } transition-colors duration-200`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                Analyzing...
              </div>
            ) : (
              "Analyze Image"
            )}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Analysis Results Section */}
        {showResults && response && (
          <>
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Analysis Results
              </h3>
              <div className="space-y-2">
                {response.tags &&
                  response.tags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm"
                    >
                      <span className="font-medium text-gray-700">
                        {tag.tag.en}
                      </span>
                      <span className="text-gray-500">
                        {(tag.confidence || 0).toFixed(2)}%
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Consultation Button - Separate Section */}
            
          </>
        )}
      </div>
    </div>
  );
};

export default ImaggaImageAnalysis;