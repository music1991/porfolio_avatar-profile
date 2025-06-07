import { useEffect, useState } from 'react';
import InteractiveAvatar from './components/InteractiveAvatar';
import ProfileImageUploader from './components/ProfileImageUploader';

const App = () => {
  const [showUploader, setShowUploader] = useState(false);
  const [savedImage, setSavedImage] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('profile_image');
    if (saved) setSavedImage(saved);
  }, [showUploader]);

  const handleAvatarClick = () => {
    setShowUploader(true);
  };


  return (
    <>
      {showUploader ? (
        <div
          style={{
            position: 'fixed',
            inset: 0, // equivale a top:0, bottom:0, left:0, right:0 para ocupar toda la pantalla sin scroll
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 24,
            boxSizing: 'border-box',
            background: `linear-gradient(
              to bottom, 
              #a3d8f4 0%,       
              #c8b6ff 40%,      
              #e0e7ff 70%,      
              #f9fafb 90%,      
              white 100%
            )`,
            overflow: 'hidden', // evita scroll por contenido sobrante
          }}
        >
          <ProfileImageUploader
            initialImage={savedImage}
            onFinish={() => setShowUploader(false)}
          />
        </div>
      ) : (
        <InteractiveAvatar imageUrl={savedImage} onClick={handleAvatarClick} />
      )}
    </>
  );
};

export default App;
