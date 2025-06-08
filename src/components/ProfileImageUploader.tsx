import React, { useState, useEffect, useRef } from 'react';
import { Button, Spin, Avatar, Modal, message, Space, Slider, Grid } from 'antd';
import {
  UploadOutlined,
  DeleteOutlined,
  UserOutlined,
  CameraOutlined,
  CheckOutlined,
  CloseOutlined,
  SmileOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../helpers';
import { createAvatar } from '@dicebear/core';
import { avataaars, bottts, pixelArt } from '@dicebear/collection';
import '../index.css'
import { useLanguage } from '../context/LanguageContext';

const LOCAL_STORAGE_KEY = 'profile_image';

interface ProfileImageUploaderProps {
  initialImage: string | null;
  onFinish: () => void;
}

const ProfileImageUploader: React.FC<ProfileImageUploaderProps> = ({
  initialImage,
  onFinish,
}) => {
  const { t } = useLanguage();
  const [imageUrl, setImageUrl] = useState<string | null>(initialImage);
  const [loading, setLoading] = useState(false);
  const [selectionModalVisible, setSelectionModalVisible] = useState(false);
  const [cameraModalVisible, setCameraModalVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraReady, setCameraReady] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) setImageUrl(saved);
  }, []);

  useEffect(() => {
    const startCamera = async () => {
      try {
        if (cameraModalVisible && videoRef.current) {
          setCameraReady(false);
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          streamRef.current = stream;
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (err) {
        console.error('Error al abrir cámara:', err);
        message.error('No se pudo acceder a la cámara.');
        setCameraModalVisible(false);
      }
    };
    startCamera();

    return () => {
      const tracks = streamRef.current?.getTracks();
      tracks?.forEach((track) => track.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
    };
  }, [cameraModalVisible]);

  const capturePhoto = () => {
    if (!videoRef.current) return;

    // Obtener las dimensiones originales del video
    const video = videoRef.current;
    const width = video.videoWidth;
    const height = video.videoHeight;

    // Crear un canvas temporal con las dimensiones originales
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dibujar la imagen original
    ctx.drawImage(video, 0, 0, width, height);

    // Convertir a data URL
    const dataUrl = canvas.toDataURL('image/png');
    setCapturedImage(dataUrl);
    setCameraModalVisible(false);
  };

  const saveCroppedImage = async () => {
    const imageToCrop = capturedImage || imageUrl;
    if (!imageToCrop || !croppedAreaPixels) return;

    try {
      const croppedImg = await getCroppedImg(imageToCrop, croppedAreaPixels);
      setImageUrl(croppedImg);
      localStorage.setItem(LOCAL_STORAGE_KEY, croppedImg);
      setSelectionModalVisible(false);
      setCameraModalVisible(false);
      setCapturedImage(null);
    } catch (e) {
      console.error('Error recortando imagen:', e);
      message.error('No se pudo recortar la imagen.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      message.error('Selecciona una imagen válida.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setCapturedImage(result);
    };
    reader.readAsDataURL(file);
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setLoading(true);
    setTimeout(() => {
      setImageUrl(null);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setLoading(false);
    }, 500);
  };

  const closeSelectionModal = () => {
    setSelectionModalVisible(false);
  };

  const closeCameraModal = () => {
    setCameraModalVisible(false);
    setCapturedImage(null);
    setCameraReady(false);
  };

  const onCropComplete = (_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const [avatarType, setAvatarType] = useState<'avataaars' | 'pixel-art' | 'bottts'>('avataaars');

  const generateRandomAvatar = (type: 'avataaars' | 'pixel-art' | 'bottts', seed?: string) => {
    const options = {
      seed: seed || Math.random().toString(36).substring(2), // semilla aleatoria
      size: 128,
    };

    switch (type) {
      case 'avataaars':
        return createAvatar(avataaars, options).toDataUri();
      case 'pixel-art':
        return createAvatar(pixelArt, options).toDataUri();
      case 'bottts':
        return createAvatar(bottts, options).toDataUri();
      default:
        return createAvatar(avataaars, options).toDataUri();
    }
  };

  const [avatarOptions, setAvatarOptions] = useState<string[]>([]);

  useEffect(() => {
    if (avatarModalVisible) {
      const newAvatars = Array.from({ length: 12 }, () =>
        generateRandomAvatar(avatarType)
      );
      setAvatarOptions(newAvatars);
    }
  }, [avatarModalVisible, avatarType]);

  const iconStyle = {
    fontSize: 28,
    fontWeight: 'bold',  // No afecta el grosor del icono SVG, pero podemos usar un icono diferente si quieres grosor real
    color: 'white',      // Contraste con fondo degradado
  };


  return (
    <div style={{ textAlign: 'center'}}>
      {loading ?
        <Spin spinning={loading} /> :
        <>
          <div
            style={{
              marginBottom: 20,
              display: 'inline-block',
              padding: 3,
              backgroundColor: '#fff',
              borderRadius: '50%',
              border: '4px solid #ADD8E6',
            }}
          >
            <Avatar
              size={160}
              src={imageUrl || undefined}
              icon={!imageUrl ? <UserOutlined style={{ fontSize: 90, lineHeight: '128px' }} /> : undefined}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                lineHeight: 1,
                background: 'linear-gradient(45deg, #d3d3d3, #eaeaea, #cfcfcf)',
              }}
            />
          </div>
          <div>
            <div style={{ marginBottom: 70 }}>
              <Button icon={<SyncOutlined />} style={{ marginRight: 8 }} onClick={() => setSelectionModalVisible(true)}>
                {t('change')}
              </Button>
              <Button danger icon={<DeleteOutlined />} onClick={handleRemove}>
                {t('delete')}
              </Button>
            </div>

            <Button
              type="primary"
              shape="circle"
              icon={<CheckOutlined style={iconStyle} />}
              size="large"
              className="custom-button"
              onClick={onFinish}
            />
            <div
              style={{
                marginTop: 10,
                color: '#333',
                fontSize: 13,
                fontWeight: 400,
                textShadow: '0 0 3px rgba(0,0,0,0.15)',
                userSelect: 'none',
              }}
            >
              {t('pressToFinish')}
            </div>
          </div>
        </>
      }

      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {/* Modal de selección de opción */}
      <Modal
        open={selectionModalVisible}
        onCancel={closeSelectionModal}
        footer={null}
        title={t('selectOption')}
        className={'modal-selection'}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            width: '80%',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            paddingTop: 20,
            paddingBottom: 20
          }}
        >
          <Button
            block
            icon={<UploadOutlined />}
            onClick={() => {
              openFilePicker();
              closeSelectionModal();
            }}
            style={{ height: 50, fontSize: 16 }}
          >
            {t('searchFile')}
          </Button>
          <Button
            block
            icon={<CameraOutlined />}
            onClick={() => {
              closeSelectionModal();
              setCameraModalVisible(true);
            }}
            style={{ height: 50, fontSize: 16 }}
          >
            {t('takePhoto')}
          </Button>
          <Button
            block
            icon={<SmileOutlined />}
            onClick={() => {
              setAvatarModalVisible(true);
              closeSelectionModal();
            }}
            style={{ height: 50, fontSize: 16 }}
          >
            {t('chooseAvatar')}
          </Button>
        </div>
      </Modal>

      {/* Modal de captura de foto */}
      <Modal
        open={cameraModalVisible}
        onCancel={closeCameraModal}
        footer={null}
        title={t('photo')}
        className={'modal-photo'}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 320,
            aspectRatio: '1 / 1',  // Mantiene relación 1:1
            border: '2px solid #1890ff',
            borderRadius: '50%',
            overflow: 'hidden',
            margin: '0 auto',
            backgroundColor: '#000',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onCanPlay={() => setCameraReady(true)}
          />
        </div>
        <canvas ref={canvasRef} width={320} height={320} style={{ display: 'none' }} />
        <Button
          icon={<CameraOutlined />}
          onClick={capturePhoto}
          style={{ marginTop: 12, width: '100%', height: 40 }}
          disabled={!cameraReady}
        >
          {t('capture')}
        </Button>
      </Modal>

      {/* Modal de vista previa y edición */}
      <Modal
        open={!!capturedImage}
        onCancel={() => setCapturedImage(null)}
        footer={null}
        title={t('edit')}
        className={'edit-photo'}
        centered
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: 350,              // o 250, ajustá a gusto
            aspectRatio: '1 / 1',
            margin: '0 auto',
            borderRadius: '16px',      // <-- redondeado
            overflow: 'hidden',
          }}
        >
          <Cropper
            image={capturedImage!}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
        <Slider
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={setZoom}
          className="zoom-slider"
          style={{ marginTop: 40, marginBottom: 40 }}
        />

        <Space style={{ width: '100%', justifyContent: 'center' }}>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={saveCroppedImage}
          >
            {t('usePhoto')}
          </Button>
          <Button
            icon={<CloseOutlined />}
            onClick={() => {
              setCapturedImage(null);
              setCameraModalVisible(false);  // cerrar modal cámara también
              setCameraModalVisible(true)
            }}
          >
            {t('cancel')}
          </Button>
        </Space>
      </Modal>

      {/* Modal de selección de avatares */}
      <Modal
        open={avatarModalVisible}
        onCancel={() => setAvatarModalVisible(false)}
        footer={null}
        title={t('avatar')}
        width="80%"
      >
        <div
          style={{
            marginBottom: 16,
            display: 'flex',
            gap: 8,
            flexDirection: screens.xs ? 'column' : 'row',
          }}
        >
          <Button onClick={() => setAvatarType('avataaars')}>{t('caricature')}</Button>
          <Button onClick={() => setAvatarType('pixel-art')}>{t('pixel')}</Button>
          <Button onClick={() => setAvatarType('bottts')}>{t('robots')}</Button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: 16,
          maxHeight: '60vh',
          overflowY: 'auto'
        }}>
          {avatarOptions.map((avatar, index) => (
            <img
              key={index}
              src={avatar}
              alt={`Avatar ${index}`}
              onClick={() => {
                setImageUrl(avatar); // usar el avatar ya generado
                localStorage.setItem(LOCAL_STORAGE_KEY, avatar);
                setAvatarModalVisible(false);
                message.success('Avatar seleccionado!');
              }}
              style={{
                width: '100%',
                cursor: 'pointer',
                borderRadius: 8,
                border: '2px solid #e0e0e0'
              }}
            />
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default ProfileImageUploader;