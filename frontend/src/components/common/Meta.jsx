import React, { useEffect } from 'react';

export const Meta = ({ title, description, keywords }) => {
  useEffect(() => {
    // Set page title
    document.title = title ? `${title} | Namokriti Foundation` : 'Namokriti International Foundation | Empowering Communities';

    // Set page description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        description || 'Namokriti International Foundation is a non-profit NGO dedicated to education, healthcare, and rural development.'
      );
    }

    // Set keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute(
        'content',
        keywords || 'NGO, charity, education, healthcare, donation, volunteer'
      );
    }
  }, [title, description, keywords]);

  return null;
};

export default Meta;
