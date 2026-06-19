import styles from './profilePhotoSelector.module.css';

interface ProfilePhotoSelectorProps {
  onSelect: (imageUrl: string) => void;
  selectedImage?: string;
}

export const ProfilePhotoSelector = ({ onSelect, selectedImage }: ProfilePhotoSelectorProps) => {
  const profileOptions = [
    {
      id: 1,
      name: 'Hombre',
      url: '/man.png',
    },
    {
      id: 2,
      name: 'Mujer',
      url: '/woman.png',
    },
  ];

  const handleSelect = (imageUrl: string) => {
    onSelect(imageUrl);
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.pageTitle}>Crear Cuenta</h1>
      <p className={styles.pageSubtitle}>¡Necesitamos saber un poco más de ti!</p>
      
      <div className={styles.container}>
        <h3 className={styles.title}>Selecciona tu foto de perfil</h3>
        
        <div className={styles.optionsGrid}>
          {profileOptions.map((option) => (
            <div
              key={option.id}
              className={`${styles.option} ${selectedImage === option.url ? styles.selected : ''}`}
              onClick={() => handleSelect(option.url)}
            >
              <img 
                src={option.url} 
                alt={option.name}
                className={styles.avatar}
              />
              <div className={styles.checkmark}>
                {selectedImage === option.url && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
