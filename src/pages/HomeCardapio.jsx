import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, LogIn, ArrowRight,
  Star, UtensilsCrossed, MapPin, Clock, 
  ChevronDown, Award 
} from 'lucide-react';
import CARDAPIO, { IMAGES } from '../data/cardapio';

const HomeCardapio = () => {
  const navigate = useNavigate();

  const fadeUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.6 },
  };

  return (
    <div style={{ minHeight: '100vh', background: '#faf9f7' }}>
      {/* ===== RESPONSIVE STYLES ===== */}
      <style>{`
        @media (max-width: 768px) {
          .hero-min { min-height: 100dvh !important; height: 100dvh !important; }
          .hero-pad { padding: 0 1.25rem !important; }
          .hero-title { font-size: clamp(1.8rem, 7vw, 2.5rem) !important; }
          .hero-icon { width: 60px !important; height: 60px !important; border-radius: 18px !important; }
          .hero-desc { font-size: 0.9rem !important; }
          .hdr { display: none !important; }
          .hdr-spacer { display: none !important; }
          .sec-pad { padding: 2.5rem 1.25rem 4rem !important; }
          .sec-title { font-size: 1.6rem !important; }
          .sec-banner { height: 140px !important; }
          .sec-banner h3 { font-size: 1.2rem !important; }
          .sec-banner-pad { padding: 0 1.25rem !important; }
          .sec-banner-icon { width: 44px !important; height: 44px !important; font-size: 1.25rem !important; border-radius: 12px !important; }
          .info-pad { display: none !important; }
          .info-gap { gap: 0.75rem !important; }
          .info-item { font-size: 0.72rem !important; }
          .cta-pad { padding: 4rem 1.25rem !important; }
          .footer-pad { padding: 2rem 1.25rem !important; }
        }
        @media (max-width: 480px) {
          .hero-min { min-height: 100dvh !important; }
          .hero-title { font-size: clamp(1.5rem, 8vw, 2rem) !important; }
          .hdr { display: none !important; }
          .hdr-spacer { display: none !important; }
          .hero-btn-lg { padding: 0.85rem 1.5rem !important; font-size: 0.9rem !important; }
          .hero-btn-sm { padding: 0.75rem 1.25rem !important; font-size: 0.85rem !important; }
          .sec-banner { height: 120px !important; }
          .sec-banner h3 { font-size: 1.1rem !important; }
          .sec-pad { padding: 2rem 1rem 3rem !important; }
          .nav-btn { padding: 0.45rem 0.85rem !important; font-size: 0.75rem !important; }

        }
      `}</style>

      {/* ===== HEADER ===== */}
      <header className="hdr" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(28,25,23,0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '0 2rem',
        height: 60,
        display: 'flex',
        alignItems: 'center',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <div style={{
              width: 30, height: 30,
              background: 'linear-gradient(135deg, #f59e0b, #f97316)',
              borderRadius: 7,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <UtensilsCrossed size={14} color="white" strokeWidth={2.5} />
            </div>
            <span style={{ fontFamily: 'Sora, sans-serif', fontSize: '0.9rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>
              Fino Sabor
            </span>
          </motion.div>

          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/order')}
              className="hdr-btn"
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                border: 'none',
                borderRadius: 9999,
                padding: '0.4rem 1rem',
                fontWeight: 700,
                fontSize: '0.78rem',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(245,158,11,0.35)',
              }}
            >
              <ShoppingBag size={13} />
              <span className="hdr-btn-text">Pedir</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/login')}
              className="hdr-btn"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 9999,
                padding: '0.4rem 0.9rem',
                fontWeight: 600,
                fontSize: '0.78rem',
                color: 'rgba(255,255,255,0.7)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                cursor: 'pointer',
              }}
            >
              <LogIn size={13} />
              <span>Sistema</span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className="hero-min" style={{
        position: 'relative',
        height: '100vh',
        minHeight: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `url(${IMAGES.hero}) center/cover no-repeat`,
          filter: 'brightness(0.35) saturate(1.2)',
          transform: 'scale(1.05)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(28,25,23,0.3) 0%, rgba(28,25,23,0.85) 70%, #1c1917 100%)',
        }} />

        {[20, 40, 60].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.12, 0.25, 0.12] }}
            transition={{ duration: 4 + i, repeat: Infinity, delay: i }}
            style={{
              position: 'absolute',
              width: s, height: s,
              borderRadius: '50%',
              background: 'rgba(245,158,11,0.15)',
              filter: 'blur(20px)',
              top: `${30 + i * 20}%`,
              left: `${20 + i * 25}%`,
            }}
          />
        ))}

        <div className="hero-pad" style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 2rem', maxWidth: 600 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="hero-title" style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              fontWeight: 800,
              color: 'white',
              letterSpacing: '-0.03em',
              lineHeight: 1.08,
              marginBottom: '0.85rem',
            }}>
              Churrascaria<br/>
              <span style={{ background: 'linear-gradient(135deg, #fbbf24, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Fino Sabor
              </span>
            </h1>

            <p className="hero-desc" style={{
              color: 'rgba(255,255,255,0.55)',
              fontSize: 'clamp(0.85rem, 1.5vw, 1rem)',
              lineHeight: 1.6,
              marginBottom: '2rem',
              maxWidth: 440,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
              Prazer em servi-los onde a qualidade faz a diferença.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/order')}
                className="hero-btn-lg"
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                  border: 'none',
                  borderRadius: 9999,
                  padding: '0.9rem 2rem',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 8px 32px rgba(245,158,11,0.4)',
                }}
              >
                <ShoppingBag size={18} />
                Fazer Pedido
                <ArrowRight size={16} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('cardapio')?.scrollIntoView({ behavior: 'smooth' })}
                className="hero-btn-sm"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 9999,
                  padding: '0.9rem 1.5rem',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: 'rgba(255,255,255,0.8)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                Ver Cardápio
                <ChevronDown size={15} />
              </motion.button>
            </div>


          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ position: 'absolute', bottom: 24, left: '50%', marginLeft: -12, color: 'rgba(255,255,255,0.15)' }}
        >
          <ChevronDown size={22} />
        </motion.div>
      </section>

      {/* ===== INFO BAR ===== */}
      <motion.section {...fadeUp} className="info-pad" style={{
        background: 'white',
        borderBottom: '1px solid var(--border)',
        padding: '1rem 2rem',
        position: 'relative',
        zIndex: 2,
      }}>
        <div className="info-gap" style={{
          maxWidth: 900, margin: '0 auto',
          display: 'flex', justifyContent: 'center', gap: '2rem',
          flexWrap: 'wrap',
        }}>
          {[
            { icon: <Clock size={14} />, label: 'Seg-Sáb: 18h-23h • Dom: 12h-22h' },
            { icon: <MapPin size={14} />, label: 'Endereço: consulte o cardápio' },
            { icon: <Star size={14} />, label: '4.8' },
          ].map((info, i) => (
            <div key={i} className="info-item" style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 500,
            }}>
              <span style={{ color: 'var(--primary)', flexShrink: 0 }}>{info.icon}</span>
              {info.label}
            </div>
          ))}
        </div>
      </motion.section>

          {/* ===== CARDAPIO ===== */}
          <section id="cardapio" className="sec-pad" style={{ padding: '3.5rem 2rem 5rem', position: 'relative' }}>
            <div style={{ maxWidth: 900, margin: '0 auto' }}>
              <motion.div {...fadeUp} style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <h2 className="sec-title" style={{
                  fontFamily: 'Sora, sans-serif',
                  fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                  marginBottom: '0.4rem',
                }}>
                  Nosso Cardápio
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Confira todas as opções do nosso cardápio
                </p>
              </motion.div>

              {CARDAPIO.map((section) => (
                <div
                  key={section.category}
                  id={`cat-${section.category.replace(/\s+/g, '-')}`}
                  style={{ marginBottom: '3rem' }}
                >
                  <div className="sec-banner" style={{
                    position: 'relative',
                    height: 180,
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    marginBottom: '1.25rem',
                  }}>
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: `url(${section.image}) center/cover no-repeat`,
                      filter: 'brightness(0.45) saturate(1.3)',
                    }} />
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(90deg, rgba(28,25,23,0.8) 0%, rgba(28,25,23,0.1) 100%)',
                    }} />
                    <div className="sec-banner-pad" style={{
                      position: 'relative', zIndex: 2,
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 2rem',
                    }}>
                      <div>
                        <h3 style={{
                          fontFamily: 'Sora, sans-serif',
                          fontSize: '1.4rem',
                          fontWeight: 800,
                          color: 'white',
                          letterSpacing: '-0.02em',
                        }}>
                          {section.category}
                        </h3>
                        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem', fontWeight: 500 }}>
                          {section.items.length} {section.items.length === 1 ? 'opção' : 'opções'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '0.65rem',
                  }}>
                    {section.items.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          background: 'white',
                          borderRadius: 'var(--radius-lg)',
                          border: '1px solid var(--border)',
                          overflow: 'hidden',
                          display: 'flex',
                          transition: 'all 0.25s ease',
                          boxShadow: 'var(--shadow-sm)',
                        }}
                      >
                        <div style={{
                          flex: 1,
                          padding: '0.85rem',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          minWidth: 0,
                        }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.35rem' }}>
                            <span style={{
                              fontSize: '0.85rem',
                              fontWeight: 700,
                              color: 'var(--text-primary)',
                              lineHeight: 1.2,
                            }}>
                              {item.name}
                            </span>
                          </div>
                          {item.desc && (
                            <p style={{
                              fontSize: '0.72rem',
                              color: 'var(--text-secondary)',
                              lineHeight: 1.4,
                              marginTop: '0.25rem',
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}>
                              {item.desc}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

          <motion.div {...fadeUp} style={{
            textAlign: 'center',
            marginTop: '1.5rem',
            padding: '1.5rem',
            background: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid #fde68a',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
              <Award size={28} color="#d97706" />
              <div>
                <h4 style={{ fontWeight: 800, fontSize: '0.9rem', color: '#92400e' }}>
                  Cardápio Completo
                </h4>
                <p style={{ fontSize: '0.78rem', color: '#a16207' }}>
                  Todos os itens disponíveis para pedido
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="cta-pad" style={{
        position: 'relative',
        padding: '5rem 2rem',
        overflow: 'hidden',
        background: '#1c1917',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `url(${IMAGES.banner}) center/cover no-repeat`,
          opacity: 0.08,
          filter: 'brightness(0.5)',
        }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 500, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: 'clamp(1.4rem, 3vw, 2rem)',
              fontWeight: 800,
              color: 'white',
              marginBottom: '0.85rem',
              letterSpacing: '-0.02em',
            }}>
              Sua Experiência Começa Aqui
            </h2>
            <p style={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: '0.9rem',
              lineHeight: 1.6,
              marginBottom: '1.5rem',
            }}>
              Faça seu pedido agora e deixe o Fino Sabor cuidar do resto.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/order')}
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                border: 'none',
                borderRadius: 9999,
                padding: '0.9rem 2rem',
                fontWeight: 800,
                fontSize: '0.95rem',
                color: 'white',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                boxShadow: '0 8px 32px rgba(245,158,11,0.4)',
              }}
            >
              <ShoppingBag size={18} />
              Fazer Pedido
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer-pad" style={{
        background: '#151210',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        padding: '2rem',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginBottom: '0.65rem' }}>
            <div style={{
              width: 26, height: 26,
              background: 'linear-gradient(135deg, #f59e0b, #f97316)',
              borderRadius: 7,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <UtensilsCrossed size={13} color="white" strokeWidth={2.5} />
            </div>
            <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, color: 'white', fontSize: '0.9rem' }}>Fino Sabor</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.72rem', marginBottom: '0.4rem' }}>
             Fino Sabor · Churrascaria & Lanchone
          </p>
          <p style={{ color: 'rgba(255,255,255,0.18)', fontSize: '0.68rem' }}>
            © 2026 Fino Sabor · Todos os direitos reservados
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomeCardapio;
