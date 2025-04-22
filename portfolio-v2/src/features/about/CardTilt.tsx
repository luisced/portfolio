import React, { useEffect } from 'react';

const CardTilt: React.FC = () => {
  useEffect(() => {
    const cards = document.querySelectorAll('.card');
    const max = 8;
    const damp = 0.25; // deg, stiffness
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        (card as HTMLElement).style.transition = 'none';
      });
      
      card.addEventListener('mousemove', (e: Event) => {
        const mouseEvent = e as MouseEvent;
        const r = card.getBoundingClientRect();
        const x = mouseEvent.clientX - r.left;
        const y = mouseEvent.clientY - r.top;
        const rotX = ((r.height / 2 - y) / (r.height / 2)) * max * damp;
        const rotY = ((x - r.width / 2) / (r.width / 2)) * max * damp;
        
        (card as HTMLElement).style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      });
      
      card.addEventListener('mouseleave', () => {
        (card as HTMLElement).style.transition = 'transform .4s ease';
        (card as HTMLElement).style.transform = 'rotateX(0deg) rotateY(0deg)';
      });
    });
    
    // Cleanup event listeners on component unmount
    return () => {
      cards.forEach(card => {
        card.removeEventListener('mouseenter', () => {});
        card.removeEventListener('mousemove', () => {});
        card.removeEventListener('mouseleave', () => {});
      });
    };
  }, []);
  
  return null;
};

export default CardTilt;
