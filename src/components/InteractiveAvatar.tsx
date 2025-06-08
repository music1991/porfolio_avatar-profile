import React, { useState } from 'react';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useLanguage } from '../context/LanguageContext';

interface InteractiveAvatarProps {
	imageUrl: string | null;
	onClick: () => void;
}

const InteractiveAvatar: React.FC<InteractiveAvatarProps> = ({ imageUrl, onClick }) => {
	const { t } = useLanguage();
	const [pressing, setPressing] = useState(false);

	return (
		<div
			style={{
				height: '100vh',
				width: '100vw',
				background: `linear-gradient(
					to bottom, 
					#a3d8f4 0%,        /* azul celeste muy claro */
					#c8b6ff 40%,       /* violeta pastel suave */
					#e0e7ff 70%,       /* lavanda muy claro */
					#f9fafb 90%,       /* gris muy claro */
					white 100%
				)`,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				userSelect: 'none',
			}}
		>
			{/* Texto arriba */}
			<div
				style={{
					marginBottom: 24,
					color: '#333',
					fontSize: 20,
					fontWeight: 400,
					textShadow: '0 0 3px rgba(0,0,0,0.15)',
					userSelect: 'none',
				}}
			>
				{t('pressToStart')}
			</div>

			{/* Avatar grande, con efecto touch */}
			<div
				onClick={() => {
					setPressing(true);
					setTimeout(() => {
						setPressing(false);
						onClick();
					}, 150);
				}}
				onMouseDown={() => setPressing(true)}
				onMouseUp={() => setPressing(false)}
				onMouseLeave={() => setPressing(false)}
				onTouchStart={() => setPressing(true)}
				onTouchEnd={() => setPressing(false)}
				style={{
					cursor: 'pointer',
					borderRadius: '50%',
					padding: 6,
					background: 'white',
					boxShadow: pressing
						? '0 0 10px 3px rgba(100, 108, 255, 0.6)'
						: '0 4px 12px rgba(0,0,0,0.1)',
					transition: 'all 150ms ease',
					display: 'inline-block',
				}}
			>
				<Avatar
					size={180}
					src={imageUrl || undefined}
					icon={!imageUrl ? <UserOutlined style={{ fontSize: 120, lineHeight: '180px' }} /> : undefined}
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						lineHeight: 1,
						
					}}
				/>
			</div>
		</div>
	);
};

export default InteractiveAvatar;
