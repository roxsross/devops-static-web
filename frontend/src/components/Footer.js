import React from 'react';

const Footer = () => {
  const socialLinks = [
    {
      name: 'GitHub',
      url: 'https://github.com/roxsross',
      icon: '🐙',
      color: '#333'
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/roxsross',
      icon: '💼',
      color: '#0077b5'
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/roxsross',
      icon: '🐦',
      color: '#1da1f2'
    },
    {
      name: 'YouTube',
      url: 'https://youtube.com/@295devops',
      icon: '📺',
      color: '#ff0000'
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com/roxsross',
      icon: '📸',
      color: '#e4405f'
    }
  ];

  const currentDay = Math.floor((Date.now() - new Date('2025-06-07').getTime()) / (1000 * 60 * 60 * 24)) + 1;

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-main">
          <div className="challenge-section">
            <div className="challenge-badge">
              <span className="badge-emoji">🚀</span>
              <div className="badge-text">
                <h3>90 Días de DevOps</h3>
                <p>por Roxs</p>
              </div>
            </div>
            
            <div className="progress-section">
              <div className="progress-info">
                <span className="progress-label">Día {currentDay} de 90</span>
                <span className="progress-percentage">{Math.round((currentDay / 90) * 100)}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${Math.min((currentDay / 90) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            <p className="challenge-description">
              Explorando el mundo DevOps paso a paso. De desarrollo a producción, 
              construyendo el futuro de la tecnología. 🔥
            </p>
          </div>

          <div className="social-section">
            <h4>¡Sígueme en mis redes! 🌟</h4>
            <div className="social-links">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  style={{ '--social-color': social.color }}
                  title={`Sígueme en ${social.name}`}
                >
                  <span className="social-icon">{social.icon}</span>
                  <span className="social-name">{social.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="tech-section">
          <h4>🛠️ Construido con</h4>
          <div className="tech-stack">
            <span className="tech-item">React ⚛️</span>
            <span className="tech-item">FastAPI 🚀</span>
            <span className="tech-item">Python 🐍</span>
            <span className="tech-item">PokeAPI 🔴</span>
            <span className="tech-item">CSS3 🎨</span>
            <span className="tech-item">DevOps 🔧</span>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <div className="copyright">
            <p>
              © {new Date().getFullYear()} | Hecho con ❤️ durante el #90DaysOfDevOps
            </p>
            <p className="creator">
              Creado por <strong>Roxs</strong> - Transformando ideas en código
            </p>
          </div>
          
          <div className="footer-links">
            <a href="#top" className="footer-link">↑ Volver arriba</a>
            <span className="footer-separator">•</span>
            <a href="https://90daysdevops.295devops.com" className="footer-link" target="_blank" rel="noopener noreferrer">
              📚 Challenge Completo
            </a>
          </div>
        </div>

        <div className="motivational-message">
          <p>
            "El mejor momento para plantar un árbol fue hace 20 años. 
            El segundo mejor momento es ahora." 🌱
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;