import React, { useState } from 'react';
import axios from 'axios';
import { Turnstile } from '@marsidev/react-turnstile';
import { useTheme } from '../../contexts/ThemeContext';
import { useForm, SubmitHandler } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './Contact.css';
import { FaEnvelope, FaPhone, FaUser, FaPaperPlane, FaTag, FaExclamationCircle } from 'react-icons/fa';

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const Contact: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [turnstileToken, setTurnstileToken] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Check if user prefers reduced motion
  const prefersReducedMotion = 
    typeof window !== 'undefined' 
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
      : false;
  
  // React Hook Form setup
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting }, 
    reset,
    setError,
    clearErrors
  } = useForm<FormData>({
    mode: 'onBlur',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    }
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    // Clear any previous errors
    clearErrors();
    
    // Validate Turnstile token
    if (!turnstileToken) {
      setError('root.turnstile', { 
        type: 'manual',
        message: t('contact.form.turnstileError')
      });
      return;
    }
    
    try {
      // Sanitize input data to prevent XSS attacks
      const sanitizedData = {
        name: data.name.replace(/</g, '&lt;').replace(/>/g, '&gt;'),
        email: data.email.replace(/</g, '&lt;').replace(/>/g, '&gt;'),
        phone: data.phone ? data.phone.replace(/</g, '&lt;').replace(/>/g, '&gt;') : '',
        subject: data.subject.replace(/</g, '&lt;').replace(/>/g, '&gt;'),
        message: data.message.replace(/</g, '&lt;').replace(/>/g, '&gt;'),
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
      reset();
      
      // Reset Turnstile token
      setTurnstileToken('');
      
    } catch (error) {
      setError('root.serverError', { 
        type: 'manual',
        message: t('contact.form.error')
      });
      console.error('Form submission error:', error);
    }
  };

  return (
    <section className="contact-section" data-theme={theme}>
      <motion.div 
        className="contact-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.5 }
        }}
      >
        <div className="contact-header">
          <h2 className="contact-title">{t('contact.title')}</h2>
          <p className="contact-subtitle">
            {t('contact.subtitle')}
          </p>
        </div>
        
        <AnimatePresence mode="wait">
          {submitSuccess ? (
            <motion.div 
              className="success-message"
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                transition: { duration: 0.3 }
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.9,
                transition: { duration: 0.2 }
              }}
            >
              <h3>{t('contact.form.success')}</h3>
              <p>{t('contact.form.successMessage')}</p>
              <motion.button 
                className="button primary-button"
                onClick={() => setSubmitSuccess(false)}
                whileHover={!prefersReducedMotion ? { scale: 1.05 } : {}}
                whileTap={!prefersReducedMotion ? { scale: 0.95 } : {}}
              >
                {t('contact.form.sendAnother')}
              </motion.button>
            </motion.div>
          ) : (
            <motion.form 
              className="contact-form" 
              onSubmit={handleSubmit(onSubmit)}
              key="form"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                transition: { duration: 0.3 }
              }}
              exit={{ 
                opacity: 0,
                transition: { duration: 0.2 }
              }}
            >
              {/* Root errors display */}
              <AnimatePresence>
                {(errors.root?.serverError || errors.root?.turnstile) && (
                  <motion.div 
                    className="error-message"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ 
                      opacity: 1, 
                      height: 'auto',
                      transition: { duration: 0.2 }
                    }}
                    exit={{ 
                      opacity: 0, 
                      height: 0,
                      transition: { duration: 0.1 }
                    }}
                  >
                    <FaExclamationCircle /> {errors.root?.serverError?.message || errors.root?.turnstile?.message}
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="form-group">
                <label htmlFor="name">
                  <FaUser /> {t('contact.form.name')}
                </label>
                <input
                  id="name"
                  placeholder="Your name"
                  aria-label="Name"
                  aria-invalid={errors.name ? "true" : "false"}
                  {...register("name", { 
                    required: t('contact.form.validation.nameRequired'),
                    minLength: {
                      value: 2,
                      message: t('contact.form.validation.nameMinLength')
                    }
                  })}
                  className={errors.name ? "input-error" : ""}
                />
                {errors.name && (
                  <motion.p 
                    className="error-text"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <FaExclamationCircle /> {errors.name.message}
                  </motion.p>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="email">
                  <FaEnvelope /> {t('contact.form.email')}
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Your email address"
                  aria-label="Email"
                  aria-invalid={errors.email ? "true" : "false"}
                  {...register("email", { 
                    required: t('contact.form.validation.emailRequired'),
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: t('contact.form.validation.emailInvalid')
                    }
                  })}
                  className={errors.email ? "input-error" : ""}
                />
                {errors.email && (
                  <motion.p 
                    className="error-text"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <FaExclamationCircle /> {errors.email.message}
                  </motion.p>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="subject">
                  <FaTag /> {t('contact.form.subject')}
                </label>
                <input
                  id="subject"
                  placeholder="What is this regarding?"
                  aria-label="Subject"
                  aria-invalid={errors.subject ? "true" : "false"}
                  {...register("subject", { 
                    required: t('contact.form.validation.subjectRequired'),
                    minLength: {
                      value: 3,
                      message: t('contact.form.validation.subjectMinLength')
                    }
                  })}
                  className={errors.subject ? "input-error" : ""}
                />
                {errors.subject && (
                  <motion.p 
                    className="error-text"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <FaExclamationCircle /> {errors.subject.message}
                  </motion.p>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">
                  <FaPhone /> {t('contact.form.phone')}
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="Your phone number"
                  aria-label="Phone"
                  {...register("phone", {
                    pattern: {
                      value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/i,
                      message: t('contact.form.validation.phoneInvalid')
                    }
                  })}
                  className={errors.phone ? "input-error" : ""}
                />
                {errors.phone && (
                  <motion.p 
                    className="error-text"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <FaExclamationCircle /> {errors.phone.message}
                  </motion.p>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="message">{t('contact.form.message')}</label>
                <textarea
                  id="message"
                  placeholder="Tell me about your project or when you'd like to schedule a call"
                  rows={5}
                  aria-label="Message"
                  aria-invalid={errors.message ? "true" : "false"}
                  {...register("message", { 
                    required: t('contact.form.validation.messageRequired'),
                    minLength: {
                      value: 10,
                      message: t('contact.form.validation.messageMinLength')
                    }
                  })}
                  className={errors.message ? "input-error" : ""}
                />
                {errors.message && (
                  <motion.p 
                    className="error-text"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <FaExclamationCircle /> {errors.message.message}
                  </motion.p>
                )}
              </div>
              
              <div className="turnstile-container">
                <Turnstile
                  siteKey="0x4AAAAAAAe671W_yalogCcB"
                  onSuccess={(token) => setTurnstileToken(token)}
                />
              </div>
              
              <motion.button 
                type="submit" 
                className="button primary-button submit-button"
                disabled={isSubmitting}
                aria-label="Send"
                whileHover={!isSubmitting && !prefersReducedMotion ? { scale: 1.05 } : {}}
                whileTap={!isSubmitting && !prefersReducedMotion ? { scale: 0.95 } : {}}
              >
                {isSubmitting ? t('contact.form.sending') : (
                  <>
                    <FaPaperPlane /> {t('contact.form.send')}
                  </>
                )}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default Contact;
