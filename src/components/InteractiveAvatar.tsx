import React from 'react';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useLanguage } from '../context/LanguageContext';
import '../index.css'

interface InteractiveAvatarProps {
	imageUrl: string | null;
	onClick: () => void;
}

const InteractiveAvatar: React.FC<InteractiveAvatarProps> = ({ imageUrl, onClick }) => {
	const { t } = useLanguage();

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
			<div
				style={{
					marginBottom: 24,
					color: '#444',
					fontSize: 15,
					fontWeight: 400,
					textShadow: '0 0 3px rgba(0,0,0,0.15)',
					userSelect: 'none',
				}}
			>
				{t('pressToStart')}
			</div>
			<div
				onClick={onClick}
				className="interactive-avatar"
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
						background: 'linear-gradient(45deg, #d3d3d3, #eaeaea, #cfcfcf)',
					}}
				/>
			</div>
		</div>
	);
};

export default InteractiveAvatar;
