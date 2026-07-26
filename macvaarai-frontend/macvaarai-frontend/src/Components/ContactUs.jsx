import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactUs = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would normally send the form data to a backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        organization: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-gray-900 via-yellow-900 to-gray-900 text-white shadow-2xl border-b-2 border-yellow-500">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 mb-4">
            <ArrowLeft size={20} /> Back
          </button>
          <div className="flex items-center gap-4">
            <img src="/logos/Vijay.jpeg" alt="Logo" className="h-16 w-16 rounded-full border-4 border-yellow-500 object-cover" />
            <div>
              <h1 className="text-4xl font-bold text-yellow-400">Contact Us</h1>
              <p className="text-yellow-300">Get in touch with MasterCheckAI</p>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CONTACT INFO */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg p-6 shadow-lg border-l-4 border-blue-500">
              <div className="flex items-center gap-3 mb-3">
                <Mail className="text-blue-400" size={24} />
                <h3 className="text-lg font-bold text-yellow-400">Email</h3>
              </div>
              <p className="text-gray-300 text-sm">support@mastercheckAI.com</p>
              <p className="text-gray-400 text-xs mt-1">info@mastercheckAI.com</p>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg p-6 shadow-lg border-l-4 border-green-500">
              <div className="flex items-center gap-3 mb-3">
                <Phone className="text-green-400" size={24} />
                <h3 className="text-lg font-bold text-yellow-400">Phone</h3>
              </div>
              <p className="text-gray-300 text-sm">+91-44-XXXX-XXXX</p>
              <p className="text-gray-400 text-xs mt-1">Toll-free: 1800-HEALTH-AI</p>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg p-6 shadow-lg border-l-4 border-red-500">
              <div className="flex items-center gap-3 mb-3">
                <MapPin className="text-red-400" size={24} />
                <h3 className="text-lg font-bold text-yellow-400">Address</h3>
              </div>
              <p className="text-gray-300 text-sm">Chennai, Tamil Nadu</p>
              <p className="text-gray-400 text-xs mt-1">India</p>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg p-6 shadow-lg border-l-4 border-yellow-500">
              <h3 className="text-lg font-bold text-yellow-400 mb-3">Business Hours</h3>
              <p className="text-gray-300 text-sm">Monday - Friday: 9:00 AM - 6:00 PM</p>
              <p className="text-gray-300 text-sm">Saturday: 10:00 AM - 4:00 PM</p>
              <p className="text-gray-300 text-sm">Sunday: Closed</p>
            </div>
          </div>

          {/* CONTACT FORM */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg p-8 shadow-lg border-l-4 border-yellow-500">
              <h2 className="text-2xl font-bold text-yellow-400 mb-6">Send us a Message</h2>

              {submitted && (
                <div className="bg-green-600/20 border border-green-500 text-green-300 px-4 py-3 rounded-lg mb-6">
                  ✓ Thank you! Your message has been sent successfully. We'll get back to you soon.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-yellow-300 font-semibold mb-2 text-sm">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:border-yellow-500 focus:outline-none transition"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-yellow-300 font-semibold mb-2 text-sm">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:border-yellow-500 focus:outline-none transition"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-yellow-300 font-semibold mb-2 text-sm">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:border-yellow-500 focus:outline-none transition"
                      placeholder="+91-XXXXXXXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-yellow-300 font-semibold mb-2 text-sm">Organization</label>
                    <input
                      type="text"
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:border-yellow-500 focus:outline-none transition"
                      placeholder="Hospital / School / District"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-yellow-300 font-semibold mb-2 text-sm">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:border-yellow-500 focus:outline-none transition"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-yellow-300 font-semibold mb-2 text-sm">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:border-yellow-500 focus:outline-none transition resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <Send size={20} /> Send Message
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* TEAM SECTION */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-yellow-400 mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* CEO */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg shadow-lg overflow-hidden border border-yellow-500/30 hover:shadow-xl transition group cursor-pointer">
              <div className="aspect-square bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center overflow-hidden relative">
                <img
                  src="/logos/team/ceo.jpeg"
                  alt="CEO"
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  onError={(e) => {e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'}}
                />
                <div className="hidden w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-6xl">👔</div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-yellow-300">Anbalagan Lakshmanan</h3>
                <div className="space-y-1 mt-2">
                  <p className="text-yellow-200 text-sm font-semibold">CEO</p>
                  <p className="text-yellow-200 text-sm font-semibold">Chief AI Officer</p>
                </div>
                <p className="text-gray-400 text-xs mt-3">Founder & Visionary Leader of MasterCheckAI</p>
              </div>
            </div>

            {/* CTO */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg shadow-lg overflow-hidden border border-blue-500/30 hover:shadow-xl transition group cursor-pointer">
              <div className="aspect-square bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center overflow-hidden relative">
                <div className="w-full h-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-6xl">💻</div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-yellow-300">&nbsp;</h3>
                <p className="text-yellow-200 text-sm font-semibold">CTO & Co-Founder</p>
                <p className="text-gray-400 text-xs mt-2">AI & Technology Expert</p>
              </div>
            </div>

            {/* Head of Product */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg shadow-lg overflow-hidden border border-green-500/30 hover:shadow-xl transition group cursor-pointer">
              <div className="aspect-square bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center overflow-hidden relative">
                <div className="w-full h-full bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center text-6xl">🎯</div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-yellow-300">&nbsp;</h3>
                <p className="text-yellow-200 text-sm font-semibold">Head of Product</p>
                <p className="text-gray-400 text-xs mt-2">Product Strategy & Design</p>
              </div>
            </div>

            {/* Head of Operations */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg shadow-lg overflow-hidden border border-red-500/30 hover:shadow-xl transition group cursor-pointer">
              <div className="aspect-square bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center overflow-hidden relative">
                <div className="w-full h-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-6xl">📊</div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-yellow-300">&nbsp;</h3>
                <p className="text-yellow-200 text-sm font-semibold">Head of Operations</p>
                <p className="text-gray-400 text-xs mt-2">Healthcare Operations</p>
              </div>
            </div>

            {/* ML Engineer */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg shadow-lg overflow-hidden border border-cyan-500/30 hover:shadow-xl transition group cursor-pointer">
              <div className="aspect-square bg-gradient-to-br from-cyan-600 to-cyan-800 flex items-center justify-center overflow-hidden relative">
                <div className="w-full h-full bg-gradient-to-br from-cyan-600 to-cyan-800 flex items-center justify-center text-6xl">🧠</div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-yellow-300">&nbsp;</h3>
                <p className="text-yellow-200 text-sm font-semibold">ML Engineer</p>
                <p className="text-gray-400 text-xs mt-2">Machine Learning & AI</p>
              </div>
            </div>

            {/* Healthcare Advisor */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg shadow-lg overflow-hidden border border-pink-500/30 hover:shadow-xl transition group cursor-pointer">
              <div className="aspect-square bg-gradient-to-br from-pink-600 to-pink-800 flex items-center justify-center overflow-hidden relative">
                <div className="w-full h-full bg-gradient-to-br from-pink-600 to-pink-800 flex items-center justify-center text-6xl">⚕️</div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-yellow-300">&nbsp;</h3>
                <p className="text-yellow-200 text-sm font-semibold">Healthcare Advisor</p>
                <p className="text-gray-400 text-xs mt-2">Medical & Clinical Expert</p>
              </div>
            </div>

            {/* Customer Success */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg shadow-lg overflow-hidden border border-orange-500/30 hover:shadow-xl transition group cursor-pointer">
              <div className="aspect-square bg-gradient-to-br from-orange-600 to-orange-800 flex items-center justify-center overflow-hidden relative">
                <div className="w-full h-full bg-gradient-to-br from-orange-600 to-orange-800 flex items-center justify-center text-6xl">🤝</div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-yellow-300">&nbsp;</h3>
                <p className="text-yellow-200 text-sm font-semibold">Customer Success Lead</p>
                <p className="text-gray-400 text-xs mt-2">Support & Implementation</p>
              </div>
            </div>

            {/* DevOps Engineer */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg shadow-lg overflow-hidden border border-indigo-500/30 hover:shadow-xl transition group cursor-pointer">
              <div className="aspect-square bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center overflow-hidden relative">
                <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center text-6xl">🔧</div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-yellow-300">&nbsp;</h3>
                <p className="text-yellow-200 text-sm font-semibold">DevOps Engineer</p>
                <p className="text-gray-400 text-xs mt-2">Infrastructure & Cloud</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-yellow-400 mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg p-6 shadow-lg border-l-4 border-blue-500">
              <h3 className="text-lg font-bold text-yellow-300 mb-2">How do I get started with MasterCheckAI?</h3>
              <p className="text-gray-400 text-sm">Contact our sales team to schedule a demo and discuss your organization's specific healthcare needs.</p>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg p-6 shadow-lg border-l-4 border-green-500">
              <h3 className="text-lg font-bold text-yellow-300 mb-2">What support do you provide?</h3>
              <p className="text-gray-400 text-sm">We offer 24/7 technical support, training, and regular updates to ensure optimal platform performance.</p>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg p-6 shadow-lg border-l-4 border-purple-500">
              <h3 className="text-lg font-bold text-yellow-300 mb-2">Is my data secure?</h3>
              <p className="text-gray-400 text-sm">Yes, we implement enterprise-grade security measures and comply with all healthcare data protection regulations.</p>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg p-6 shadow-lg border-l-4 border-red-500">
              <h3 className="text-lg font-bold text-yellow-300 mb-2">Can the platform scale?</h3>
              <p className="text-gray-400 text-sm">Absolutely! MasterCheckAI is built to scale from single PHCs to entire state-level health administration.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
