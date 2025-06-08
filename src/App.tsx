import { useEffect, useState } from 'react';
import InteractiveAvatar from './components/InteractiveAvatar';
import EditAvatar from './components/EditAvatar';
import { LanguageProvider } from './context/LanguageContext';
import { LanguageSelector } from './components/LanguajeSelector';

const App = () => {
  const [showUploader, setShowUploader] = useState(false);
  const [savedImage, setSavedImage] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('avatar_image');
    setSavedImage(saved);
  }, [showUploader]);

  const handleAvatarClick = () => {
    setShowUploader(true);
  };


  return (
    <LanguageProvider>
      <LanguageSelector />
      {showUploader ? (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxSizing: 'border-box',
            background: `linear-gradient(
              to bottom, 
              #a3d8f4 0%,       
              #c8b6ff 40%,      
              #e0e7ff 70%,      
              #f9fafb 90%,      
              white 100%
            )`,
            overflow: 'hidden',
          }}
        >
          <EditAvatar
            initialImage={savedImage}
            onFinish={() => setShowUploader(false)}
          />
        </div>
      ) : (
        <InteractiveAvatar imageUrl={savedImage} onClick={handleAvatarClick} />
      )}
    </LanguageProvider>
  );
};

export default App;
