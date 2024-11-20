import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';

const GoogleTranslate = () => {
  const [isTranslateReady, setIsTranslateReady] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');

    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    script.onload = () => console.log('Google Translate script loaded');
    script.onerror = () => console.error('Error loading Google Translate script');
    document.body.appendChild(script);
const googleLogo = document.querySelector('img[src="https://www.gstatic.com/images/branding/googlelogo/1x/googlelogo_color_68x28dp.png"]');
    
    if (googleLogo) {
      const parentElement = googleLogo.parentElement;
      
      parentElement.remove();
    } else {
      console.log('Google logo image not found');
    }   
    window.googleTranslateElementInit = () => {
      console.log('Google Translate initialization');
      setIsTranslateReady(true);
    };

    return () => {
      document.body.removeChild(script);
      delete window.googleTranslateElementInit;
    };
  }, []);

  useEffect(() => {
    if (isModalOpen && isTranslateReady) {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,es,fr,de,it,pt,ar,zh-CN,ja,ko,hi,te',
          layout: window.google.translate.TranslateElement.InlineLayout.SELECT,
          autoDisplay: false,
          disableAutoFrame: true,
        },
        'google_translate_element'
      );
    }
  }, [isModalOpen, isTranslateReady]);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <>
      <button
        onClick={toggleModal}
        className="text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white p-2 rounded-full transition-colors"
        aria-label="Translate"
      >
        <Globe size={24} />
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={toggleModal}
              aria-hidden="true"
            ></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Globe className="h-6 w-6 text-blue-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Translate This Page
                    </h3>
                    <div className="mt-2">
                      {isTranslateReady ? (
                        <div id="google_translate_element" className="w-full" />
                      ) : (
                        <p className="text-sm text-gray-500">Loading translation options...</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={toggleModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GoogleTranslate;
