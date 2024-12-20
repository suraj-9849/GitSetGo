import React from 'react';
import { Video, Stethoscope, FileText, Languages } from 'lucide-react';

export default function Home() {

  return (
    <div className="mx-auto ">
      <div className="mb-16 w-">
        <video
          src="./video.mp4"
          width="100%"
          autoPlay
          loop
          muted
          height="100%"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <Video className="h-12 w-12 text-rose-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Video Consultation</h3>
          <p className="text-gray-600">Connect with doctors face-to-face through video calls</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <Stethoscope className="h-12 w-12 text-rose-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Expert Doctors</h3>
          <p className="text-gray-600">Get treatment from experienced healthcare professionals</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <FileText className="h-12 w-12 text-rose-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">E-Prescriptions</h3>
          <p className="text-gray-600">Receive digital prescriptions right after consultation</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <Languages className="h-12 w-12 text-rose-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Multi-language</h3>
          <p className="text-gray-600">Services available in multiple local languages</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-rose-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-rose-600">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Describe Your Symptoms</h3>
            <p className="text-gray-600">Tell us what's troubling you using our simple form</p>
          </div>
          <div className="text-center">
            <div className="bg-rose-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-rose-600">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Connect with Doctor</h3>
            <p className="text-gray-600">Have a video consultation with a qualified doctor</p>
          </div>
          <div className="text-center">
            <div className="bg-rose-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-rose-600">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Get Your Prescription</h3>
            <p className="text-gray-600">Receive your e-prescription and start treatment</p>
          </div>
        </div>
      </div>
    </div>
  );
}