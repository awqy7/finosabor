import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  Plus,
  Minus,
  Search,
  ShoppingCart,
  Printer,
  X,
  CheckCircle,
  UtensilsCrossed,
  Bike,
  Hash,
  MessageSquare,
  RotateCcw,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PRODUCTS, CATEGORIES } from '../data/cardapio';

const ORDER_TYPES = [
  { id: 'mesa',    label: 'Mesa',     icon: UtensilsCrossed, desc: 'Consumo no local' },
  { id: 'balcao',  label: 'Balcão',   icon: ShoppingCart,    desc: 'Retirada no caixa' },
  { id: 'entrega', label: 'Entrega',  icon: Bike,            desc: 'Envio ao cliente'  },
];

const POS = () => {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('Todas');
  const [dailySpecials, setDailySpecials] = useState([]);
  const [showCart, setShowCart] = useState(false);

  // Fetch Daily Specials
  useEffect(() => {
    const fetchSpecials = async () => {
      const { data } = await supabase.from('configuracoes').select('valor').eq('chave', 'pratos_do_dia').single();
      if (data && data.valor) setDailySpecials(data.valor);
    };
    fetchSpecials();

    const channel = supabase
      .channel('config_updates_pos')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'configuracoes', filter: "chave=eq.pratos_do_dia" }, (payload) => {
        if (payload.new && payload.new.valor) setDailySpecials(payload.new.valor);
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  // Close cart drawer on resize to desktop
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 769px)');
    const handler = (e) => { if (e.matches) setShowCart(false); };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const [orderType, setOrderType] = useState('mesa');
  const [mesa, setMesa] = useState('');
  const [obs, setObs] = useState('');
  const [step, setStep] = useState('cart');

  const products = PRODUCTS;
  const categories = CATEGORIES;

  const filteredProducts = products.filter(p =>
    (category === 'Todas' || p.category === category) &&
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(i => {
      if (i.id !== id) return i;
      const q = i.quantity + delta;
      return q < 1 ? null : { ...i, quantity: q };
    }).filter(Boolean));
  };

  const total = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const itemCount = cart.reduce((acc, i) => acc + i.quantity, 0);

  const canFinalize = cart.length > 0 && (orderType !== 'mesa' || mesa.trim() !== '');

  const handleFinalize = () => {
    if (!canFinalize) return;
    setStep('finalized');
  };

  const handlePrint = () => window.print();

  const handleNovoPedido = () => {
    setCart([]);
    setMesa('');
    setObs('');
    setOrderType('mesa');
    setStep('cart');
    setSearchTerm('');
    setCategory('Todas');
  };

  const clearCart = () => {
    setCart([]);
    setObs('');
  };

  const orderTypeLabel = ORDER_TYPES.find(t => t.id === orderType)?.label;

  // ─── Shared Cart Content ──────────────────────────────────────────────────
  const CartContent = ({ isSheet }) => (
    <>
      <div className="cart-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <ShoppingCart size={18} color="var(--text-secondary)" strokeWidth={2} />
          <span className="cart-title">Pedido</span>
          {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
        </div>
        {cart.length > 0 && (
          <button className="btn btn-ghost btn-sm" onClick={clearCart} style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>
            Limpar
          </button>
        )}
      </div>

      <div className="cart-order-type">
        <span className="cart-section-label">Tipo de Pedido</span>
        <div className="order-type-row">
          {ORDER_TYPES.map(t => {
            const Icon = t.icon;
            const active = orderType === t.id;
            return (
              <motion.button
                key={t.id}
                onClick={() => setOrderType(t.id)}
                whileTap={{ scale: 0.95 }}
                className={`order-type-btn${active ? ' active' : ''}`}
              >
                <Icon size={16} color={active ? 'var(--amber-700)' : 'var(--text-muted)'} />
                <span>{t.label}</span>
              </motion.button>
            );
          })}
        </div>
        <AnimatePresence>
          {orderType === 'mesa' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden' }}
            >
              <div className={`mesa-input${mesa ? ' filled' : ''}`}>
                <Hash size={14} color="var(--text-muted)" />
                <input
                  type="number" min="1" placeholder="Número da mesa"
                  value={mesa} onChange={e => setMesa(e.target.value)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="cart-items">
        <AnimatePresence mode="popLayout">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">
                <ShoppingCart size={22} color="var(--text-muted)" />
              </div>
              <div className="cart-empty-title">Carrinho vazio</div>
              <div className="cart-empty-desc">Toque nos itens do cardápio para adicionar</div>
            </div>
          ) : (
            cart.map(item => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="cart-item"
              >
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">R$ {(item.price * item.quantity).toFixed(2)}</div>
                </div>
                <div className="qty-control">
                  <button className="qty-btn" onClick={() => updateQuantity(item.id, -1)}>
                    <Minus size={10} />
                  </button>
                  <span className="qty-value">{item.quantity}</span>
                  <button className="qty-btn" onClick={() => updateQuantity(item.id, 1)}>
                    <Plus size={10} />
                  </button>
                </div>
                <button className="cart-remove-btn" onClick={() => removeFromCart(item.id)}>
                  <X size={14} />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {cart.length > 0 && (
        <div className="cart-obs">
          <div className="cart-obs-header">
            <MessageSquare size={13} color="var(--text-muted)" />
            <span className="cart-section-label">Observação</span>
          </div>
          <textarea
            rows={isSheet ? 2 : 1}
            placeholder="Ex: sem cebola, ponto da carne..."
            value={obs}
            onChange={e => setObs(e.target.value)}
            className="obs-textarea"
          />
        </div>
      )}

      <div className="cart-footer">
        {cart.length > 0 && (
          <>
            <div className="cart-subtotal">
              <span>{itemCount} {itemCount === 1 ? 'item' : 'itens'}</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
            <div className="divider" />
          </>
        )}
        <div className="cart-total-row">
          <span className="cart-total-label">Total</span>
          <span className="cart-total-value">R$ {total.toFixed(2)}</span>
        </div>
        {cart.length > 0 && orderType === 'mesa' && !mesa.trim() && (
          <p className="cart-hint"><Hash size={11} /> Informe o número da mesa</p>
        )}
        <motion.button
          className="btn btn-primary btn-finalize"
          disabled={!canFinalize}
          onClick={() => { handleFinalize(); if (isSheet) setShowCart(false); }}
          whileTap={{ scale: canFinalize ? 0.97 : 1 }}
          whileHover={canFinalize ? { scale: 1.01 } : {}}
        >
          <ChevronRight size={16} />
          Finalizar Pedido
        </motion.button>
      </div>
    </>
  );

  // ─── FINALIZED SCREEN ─────────────────────────────────────────────────────
  if (step === 'finalized') {
    return (
      <div className="pos-container no-print">
        <div className="pos-left">
          <div>
            <h1 className="pos-title">Cardápio</h1>
            <p className="pos-subtitle">Pedido finalizado</p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="finalized-card"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.15 }}
              className="finalized-icon"
            >
              <CheckCircle size={42} color="#059669" strokeWidth={2} />
            </motion.div>
            <div className="finalized-text">
              <h2 className="finalized-title">Pedido Finalizado!</h2>
              <p className="finalized-desc">
                {orderType === 'mesa' ? `Mesa ${mesa}` : orderTypeLabel}
              </p>
            </div>
            <motion.button
              className="btn btn-secondary"
              style={{ gap: '0.5rem', marginTop: '0.5rem' }}
              onClick={handleNovoPedido}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <RotateCcw size={15} />
              Novo Pedido
            </motion.button>
          </motion.div>
        </div>

        <div className="pos-right">
          <div className="cart-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <CheckCircle size={18} color="#059669" />
              <span className="cart-title" style={{ color: '#059669' }}>Pedido Confirmado</span>
            </div>
            <span className="cart-time">
              {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div className="cart-meta">
            <span className="order-type-tag">
              {orderType === 'mesa' && <><UtensilsCrossed size={12} /> Mesa {mesa}</>}
              {orderType === 'balcao' && <><ShoppingCart size={12} /> Balcão</>}
              {orderType === 'entrega' && <><Bike size={12} /> Entrega</>}
            </span>
            {obs && <span className="obs-tag"><MessageSquare size={12} /> {obs}</span>}
          </div>
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.id} className="cart-item finalized-item">
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">R$ {(item.price * item.quantity).toFixed(2)}</div>
                </div>
                <span className="cart-item-qty">×{item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="cart-footer">
            <div className="cart-total-row">
              <span className="cart-total-label">Total</span>
              <span className="cart-total-value">R$ {total.toFixed(2)}</span>
            </div>
            <motion.button
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.8rem', fontSize: '0.9rem', borderRadius: 'var(--radius-lg)' }}
              onClick={handlePrint}
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.01 }}
            >
              <Printer size={16} />
              Imprimir Comprovante
            </motion.button>
          </div>
        </div>

        {/* Printable receipt */}
        <div id="printable-receipt" className="print-only" style={{ padding: 20, fontFamily: 'monospace', color: 'black', fontSize: 13 }}>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <h1 style={{ margin: 0, fontSize: 20 }}>Fino Sabor</h1>
            <p style={{ margin: '4px 0' }}>Churrascaria</p>
            <p style={{ margin: '4px 0', fontSize: 11 }}>{new Date().toLocaleString('pt-BR')}</p>
            <hr />
          </div>
          <p style={{ fontWeight: 700, marginBottom: 4 }}>
            Tipo: {orderType === 'mesa' ? `Mesa ${mesa}` : orderTypeLabel}
          </p>
          {obs && <p style={{ marginBottom: 8, fontStyle: 'italic' }}>Obs: {obs}</p>}
          <hr />
          <table style={{ width: '100%', marginBottom: 12 }}>
            <tbody>
              {cart.map(item => (
                <tr key={item.id}>
                  <td>{item.quantity}x {item.name}</td>
                  <td style={{ textAlign: 'right' }}>R$ {(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <hr />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 15, marginTop: 8 }}>
            <span>TOTAL:</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 11 }}>
            <p>Obrigado pela preferência!</p>
          </div>
        </div>
      </div>
    );
  }

  // ─── CART SCREEN ──────────────────────────────────────────────────────────
  return (
    <div className="pos-container no-print">
      {/* LEFT: products */}
      <div className="pos-left">
        <div className="pos-header">
          <div>
            <h1 className="pos-title">Cardápio</h1>
            <p className="pos-subtitle">{filteredProducts.length} itens disponíveis</p>
          </div>
          <motion.button
            className="pos-cart-btn-desktop"
            onClick={() => setShowCart(true)}
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingCart size={18} />
            {itemCount > 0 && <span className="pos-cart-btn-badge">{itemCount}</span>}
          </motion.button>
        </div>

        <div className="search-bar">
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Buscar prato, bebida..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="search-clear">
              <X size={14} />
            </button>
          )}
        </div>

        <div className="tabs">
          {categories.map(cat => (
            <button
              key={cat}
              className={`tab-btn${category === cat ? ' active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {category === 'Todas' && dailySpecials.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 className="section-title">Pratos do Dia</h2>
            <div className="products-grid">
              {products.filter(p => dailySpecials.includes(p.id)).map(product => {
                const inCart = cart.find(i => i.id === product.id);
                return (
                  <motion.div
                    key={`dia-${product.id}`}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="product-card special-card"
                    onClick={() => addToCart(product)}
                  >
                    <div className="product-info">
                      <div className="product-category">{product.category}</div>
                      <div className="product-name">{product.name}</div>
                      <div className="product-bottom">
                        <span className="product-price">R$ {product.price.toFixed(2)}</span>
                        <motion.button
                          className="product-add-btn"
                          onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                          whileTap={{ scale: 0.85 }}
                        >
                          {inCart ? <span className="product-qty-badge">{inCart.quantity}</span> : <Plus size={14} />}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}

        <h2 className="section-title">
          {category === 'Todas' ? 'Cardápio Completo' : category}
        </h2>
        <div className="products-grid">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map(product => {
              const inCart = cart.find(i => i.id === product.id);
              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="product-card"
                  onClick={() => addToCart(product)}
                >
                  <div className="product-info">
                    <div className="product-category">{product.category}</div>
                    <div className="product-name">{product.name}</div>
                    <div className="product-bottom">
                      <span className="product-price">R$ {product.price.toFixed(2)}</span>
                      <motion.button
                        className="product-add-btn"
                        whileTap={{ scale: 0.85 }}
                        onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                      >
                        {inCart ? <span className="product-qty-badge">{inCart.quantity}</span> : <Plus size={14} />}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {filteredProducts.length === 0 && (
            <div className="products-empty">
              <div>Nenhum item encontrado</div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: cart sidebar (desktop) */}
      <div className="pos-right">
        <CartContent isSheet={false} />
      </div>

      {/* Mobile FAB */}
      {itemCount > 0 && (
        <motion.button
          className="pos-fab"
          onClick={() => setShowCart(true)}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ShoppingCart size={22} />
          <span className="pos-fab-badge">{itemCount}</span>
        </motion.button>
      )}

      {/* Mobile cart overlay + sheet */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div
              className="pos-sheet-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCart(false)}
            />
            <motion.div
              className="pos-sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300, mass: 0.8 }}
            >
              <div className="pos-sheet-handle" onClick={() => setShowCart(false)}>
                <div className="pos-sheet-handle-bar" />
              </div>
              <CartContent isSheet={true} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default POS;
