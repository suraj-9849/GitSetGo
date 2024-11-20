import React, { useState } from 'react';
import { Loader2, Upload } from 'lucide-react';

const HealthInsightsAnalyzer = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const performAnalysis = async () => {
    setLoading(true);
    try {
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAnalysis({
        disease: "Potential Skin Condition",
        preventionMethods: ["Regular skin checks", "Sun protection"],
        homeRemedies: ["Moisturize", "Gentle cleansing"],
        doctor: "Dermatologist",
        foodToAvoid: ["Processed foods", "High sugar items"],
        foodToEat: ["Fresh vegetables", "Lean proteins"]
      });
    } catch (error) {
      console.error(error);
    } finally {-
      setLoading(false);
    }
  };

  
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


  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-gray-200">
          <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-4">
            Health Insights Analyzer
          </h1>
          <p className="text-gray-500 text-center mb-6">
            Upload an image to get personalized health insights
          </p>

          <div className="flex flex-col items-center space-y-4">
            <label 
              htmlFor="image-upload"
              className="w-full cursor-pointer"
            >
              <input 
                id="image-upload"
                type="file" 
                accept="image/*" 
                className="hidden"
                onChange={handleImageUpload}
              />
              <div className="
                w-full 
                border-2 border-dashed border-blue-200 
                rounded-xl 
                p-8 
                text-center
                hover:border-blue-400
                transition-colors
                group"
              >
                <Upload 
                  className="mx-auto mb-4 text-blue-400 group-hover:text-blue-600" 
                  size={48} 
                />
                <p className="text-gray-500 group-hover:text-blue-600">
                  {imagePreview 
                    ? "Image Selected" 
                    : "Click to Upload Image or Drag and Drop"}
                </p>
              </div>
            </label>

            {imagePreview && (
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="max-h-64 rounded-lg shadow-md mt-4"
              />
            )}

            <button
              onClick={performAnalysis}
              disabled={!imagePreview || loading}
              className={`
                w-full 
                py-3 
                rounded-lg 
                text-white 
                font-semibold 
                transition-colors 
                ${!imagePreview || loading 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 animate-spin" />
                  Analyzing...
                </div>
              ) : (
                "Get Health Insights"
              )}
            </button>
          </div>
        </div>

        {analysis && (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Analysis Results
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(analysis).map(([key, value]) => (
                <div 
                  key={key} 
                  className="
                    bg-gray-100 
                    rounded-lg 
                    p-4 
                    shadow-sm 
                    transform 
                    transition 
                    hover:scale-105"
                >
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </h3>
                  {Array.isArray(value) ? (
                    <ul className="list-disc list-inside text-gray-600">
                      {value.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600">{value}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthInsightsAnalyzer;