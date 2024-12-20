import React, { useState } from 'react';
import Groq from "groq-sdk";
import { collection, doc, getDocs, getFirestore, query, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const groq = new Groq({
  apiKey: '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',
  dangerouslyAllowBrowser: true
});

const Search = () => {
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConsultClick = async (doctorType) => {
    const specialist = doctorType;

    const db = getFirestore();
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
        console.error("No user logged in.");
        return;
    }

    try {
        // 1. Get all doctors' UIDs from the specialization collection
        const specializationRef = collection(db, specialist.toUpperCase());
        const specializationQuery = query(specializationRef);
        const specializationSnapshot = await getDocs(specializationQuery);

        if (specializationSnapshot.empty) {
            console.log(`No doctors found under specialization: ${specialist}`);
            return;
        }

        const doctorUIDs = specializationSnapshot.docs.map(doc => doc.id);

        // 2. Update each doctor's document in the "doctors" collection
        for (const doctorUID of doctorUIDs) {
            const doctorDocRef = doc(db, "doctors", doctorUID);

            // Add incoming request subcollection
            const incomingRequestRef = collection(doctorDocRef, "incoming requests");
            const newRequestDocRef = doc(incomingRequestRef, currentUser.uid); // Use current user's UID as doc ID

            await setDoc(newRequestDocRef, {
                requestId: currentUser.uid, // Add additional details if needed
                timestamp: new Date(),
                status: "pending", // Example additional field
            });

            console.log(`Added request to doctor UID: ${doctorUID}`);
        }

        console.log("All requests added successfully.");
    } catch (error) {
        console.error("Error consulting specialist:", error);
    }
};


  const analyzeSymptoms = async (symptomDescription) => {
    const prompt = `Analyze these symptoms and provide a medical classification. 
    Symptoms: "${symptomDescription}"
    
    Respond ONLY with a JSON object in this exact format:
    {
      "disease": "name of the likely condition",
      "doctor": "medical specialty that should be consulted , has to only one word "
    }`;

    try {
      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama3-70b-8192",
        temperature: 0.2,
        max_tokens: 1000,
        top_p: 1,
        stream: false  // Changed to false for simpler handling
      });

      const responseContent = completion.choices[0]?.message?.content || '';
      
      // Find JSON in the response
      const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No valid JSON found in response");
      }

      // Parse the JSON
      try {
        const parsedResult = JSON.parse(jsonMatch[0]);
        if (!parsedResult.disease || !parsedResult.doctor) {
          throw new Error("Invalid response format");
        }
        return parsedResult;
      } catch (parseError) {
        throw new Error("Failed to parse response as JSON");
      }
    } catch (error) {
      throw new Error(`Analysis failed: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Input validation
    if (!symptoms.trim()) {
      setError('Please enter your symptoms');
      return;
    }

    // Reset states
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const analysisResult = await analyzeSymptoms(symptoms);
      setResult(analysisResult);
    } catch (err) {
      setError(err.message || 'Failed to analyze symptoms. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Medical Symptom Analyzer
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="symptoms" 
                className="block text-lg font-medium text-gray-700 mb-2"
              >
                Describe your symptoms
              </label>
              <textarea
                id="symptoms"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Please describe your symptoms in detail..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-32 text-gray-900"
                disabled={loading}
              />
              <p className="mt-2 text-sm text-gray-500">
                Please provide detailed information about your symptoms for better analysis.
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200
                ${loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Analyzing Symptoms...
                </div>
              ) : (
                'Analyze Symptoms'
              )}
            </button>
          </form>

          {result && (
            <div className="mt-8 space-y-6">
              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Analysis Results</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <span className="font-medium text-gray-700 min-w-28">Possible Condition:</span>
                    <span className="text-gray-900 ml-2">{result.disease}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-medium text-gray-700 min-w-28">Recommended Specialist:</span>
                    <span className="text-gray-900 ml-2">{result.doctor}</span>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-700">
                    Note: This is an AI-powered analysis and should not be considered as a replacement for professional medical advice. 
                    Please consult with a healthcare provider for proper diagnosis and treatment.
                  </p>
                </div>
              </div>

              {/* New Consult Doctor Card */}
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Ready to Consult a Doctor?</h2>
                <p className="text-gray-700 mb-4">
                  Based on your symptoms, we recommend consulting a {result.doctor} specialist.
                </p>
                <button
                  onClick={() => handleConsultClick(result.doctor)}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Consult {result.doctor} Specialist
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;