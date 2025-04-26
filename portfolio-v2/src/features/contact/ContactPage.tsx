import React from 'react';
import Background from '../../components/common/Background';
import ContactForm from './Contact';

const ContactPage: React.FC = () => {
  return (
    <div className="contact-page">
      <Background />
      <div className="page-container">
        <ContactForm />
      </div>
    </div>
  );
};

export default ContactPage;
