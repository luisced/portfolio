import React, { useState } from 'react';
import axios from 'axios';
import { Turnstile } from '@marsidev/react-turnstile';
import { useTheme } from '../../contexts/ThemeContext';
import './Contact.css';
import { FaEnvelope, FaPhone, FaUser, FaPaperPlane, FaTag } from 'react-icons/fa';

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const Contact: React.FC = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [turnstileToken, setTurnstileToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setSubmitError('All fields except phone are required.');
      setIsSubmitting(false);
      return;
    }

    // Validate Turnstile token
    if (!turnstileToken) {
      setSubmitError('Please complete the Turnstile challenge.');
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Sanitize input data to prevent XSS attacks
      const sanitizedData = {
        name: formData.name.replace(/</g, '&lt;').replace(/>/g, '&gt;'),
        email: formData.email.replace(/</g, '&lt;').replace(/>/g, '&gt;'),
        phone: formData.phone.replace(/</g, '&lt;').replace(/>/g, '&gt;'),
        subject: formData.subject.replace(/</g, '&lt;').replace(/>/g, '&gt;'),
        message: formData.message.replace(/</g, '&lt;').replace(/>/g, '&gt;'),
        'cf-turnstile-response': turnstileToken
      };
      
      // Send data to the API
      await axios.post(
        'https://mail.luishomeserver.com/api/contact',
        sanitizedData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Show success message
      setSubmitSuccess(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      // Reset Turnstile token
      setTurnstileToken('');
      
    } catch (error) {
      setSubmitError('There was an error sending your message. Please try again.');
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="contact-section" data-theme={theme}>
      <div className="contact-container">
        <div className="contact-header">
          <h2 className="contact-title">Schedule a Call</h2>
          <p className="contact-subtitle">
            Fill out the form below and I'll get back to you as soon as possible to schedule a call.
          </p>
        </div>
        
        {submitSuccess ? (
          <div className="success-message">
            <h3>Thank you for your message!</h3>
            <p>I'll get back to you as soon as possible to schedule our call.</p>
            <button 
              className="button primary-button"
              onClick={() => setSubmitSuccess(false)}
            >
              Send another message
            </button>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            {submitError && <div className="error-message">{submitError}</div>}
            
            <div className="form-group">
              <label htmlFor="name">
                <FaUser /> Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
                aria-label="Name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">
                <FaEnvelope /> Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email address"
                required
                aria-label="Email"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="subject">
                <FaTag /> Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="What is this regarding?"
                required
                aria-label="Subject"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">
                <FaPhone /> Phone (optional)
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Your phone number"
                aria-label="Phone"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell me about your project or when you'd like to schedule a call"
                rows={5}
                required
                aria-label="Message"
              />
            </div>
            
            <div className="turnstile-container">
              <Turnstile
                siteKey="0x4AAAAAAAe671W_yalogCcB"
                onSuccess={(token) => setTurnstileToken(token)}
              />
            </div>
            
            <button 
              type="submit" 
              className="button primary-button submit-button"
              disabled={isSubmitting}
              aria-label="Send"
            >
              {isSubmitting ? 'Sending...' : (
                <>
                  <FaPaperPlane /> Send Message
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default Contact;
