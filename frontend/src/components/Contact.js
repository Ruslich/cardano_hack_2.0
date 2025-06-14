import React, { useState } from 'react';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Handles form submission
  const handleSubmit = (e) => {
    setSubmitting(true);
    // Let the form submit to Formsubmit.io, but show the success message after a short delay
    setTimeout(() => {
      setSubmitted(true);
      setSubmitting(false);
    }, 1200);
  };

  if (submitted) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-lg w-full text-center">
          <h2 className="text-3xl font-bold text-blue-900 mb-4">Thank you for contacting DocVerify!</h2>
          <p className="text-lg text-gray-700 mb-8">We'll get back to you shortly.</p>
          <a href="/" className="text-blue-600 hover:underline font-semibold">Return to Home</a>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white py-20">
      <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-10">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-blue-900 mb-3">🤝 Get in Touch with DocVerify</h1>
          <p className="text-lg text-gray-700 mb-6">
            Whether you're a university, investor, partner, or curious about credential verification — we're happy to hear from you.
          </p>
          <p className="text-sm text-gray-500 mb-2">📧 You can also email us directly at:</p>
          <a href="mailto:contact@docverify.io" className="text-blue-600 hover:underline text-sm font-medium mb-6 block">contact@docverify.io</a>
        </div>
        <form
          action="https://formsubmit.co/fff74229fd7fff2893b79fdfee6c9ea6"
          method="POST"
          className="space-y-6"
          onSubmit={handleSubmit}
        >
          {/* Honeypot field for spam protection */}
          <input type="text" name="_honey" style={{ display: 'none' }} tabIndex="-1" autoComplete="off" />
          {/* Redirect to thank you page if you want: <input type="hidden" name="_next" value="/thank-you" /> */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Your Name"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-1">Message</label>
            <textarea
              id="message"
              name="message"
              placeholder="How can we help you?"
              rows={5}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          <button
            type="submit"
            className={`w-full py-3 rounded-lg font-semibold text-white transition-colors ${submitting ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            disabled={submitting}
          >
            {submitting ? 'Sending…' : 'Send Message'}
          </button>
          <p className="text-xs text-gray-400 text-center mt-4">
            🔒 We respect your privacy. Your information will only be used for communication purposes and will not be shared with third parties.
          </p>
        </form>
      </div>
    </section>
  );
};

export default Contact; 