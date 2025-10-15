import React from 'react';
import ContactForm from './ContactForm';
import { CiMail as MailIcon } from 'react-icons/ci';

const Contact = () => {
  return (
    <div
      className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#f5f1ea]"
      style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
    >
      <section className="flex flex-1 flex-col items-center py-16 px-4">
        <div className="w-full max-w-2xl text-center">
          <h1 className="text-5xl font-bold tracking-wide-">İletişim</h1>
          <ContactForm />
          <div className="my-12 flex justify-center">
            <span className="text-9xl text-[#d3deda]">
              <MailIcon />
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
