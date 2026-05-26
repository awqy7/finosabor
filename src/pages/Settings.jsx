import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Database, Palette, ChevronRight, Utensils, Check, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { PRODUCTS } from '../data/cardapio';

const sections = [
  {
    title: 'Perfil do Restaurante',
    description: 'Nome, CNPJ, endereço e contato do estabelecimento',
    icon: User,
    iconBg: '#fef3c7',
    iconColor: '#b45309',
    badge: null,
  },
  {
    title: 'Notificações',
    description: 'Alertas de pedidos, fechamento de caixa e avisos do sistema',
    icon: Bell,
    iconBg: '#eff6ff',
    iconColor: '#2563eb',
    badge: '2 novas',
  },
  {
    title: 'Segurança',
    description: 'Gerenciamento de senhas, acessos e permissões de usuário',
    icon: Shield,
    iconBg: '#f0fdf4',
    iconColor: '#16a34a',
    badge: null,
  },
];

const Settings = () => {
  const [dailySpecials, setDailySpecials] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    fetchDailySpecials();
  }, []);

  const fetchDailySpecials = async () => {
    try {
      const { data, error } = await supabase
        .from('configuracoes')
        .select('valor')
        .eq('chave', 'pratos_do_dia')
        .single();
      
      if (data && data.valor) {
        setDailySpecials(data.valor);
      }
    } catch (err) {
      console.error("Erro ao carregar pratos do dia:", err);
    }
  };

  const toggleSpecial = (id) => {
    setDailySpecials(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const saveSpecials = async () => {
    setIsSaving(true);
    setSaveMessage('');
    try {
      const { error } = await supabase
        .from('configuracoes')
        .upsert({ chave: 'pratos_do_dia', valor: dailySpecials });
        
      if (error) throw error;
      setSaveMessage('Cardápio do dia atualizado com sucesso!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      console.error("Erro ao salvar:", err);
      setSaveMessage('Erro ao salvar. Verifique se você rodou o SQL de configurações.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ paddingBottom: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, letterSpacing: '-0.025em' }}>Configurações</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Gerencie as preferências e configurações do sistema
        </p>
      </div>

      {/* Profile quick info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
        style={{ 
          marginBottom: '1.5rem', 
          background: 'linear-gradient(135deg, #1c1917 0%, #292524 100%)',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          padding: '1.5rem 2rem',
          maxWidth: '720px'
        }}
      >
        <div style={{ 
          width: 64, height: 64,
          background: 'linear-gradient(135deg, var(--amber-500), var(--terra-500))',
          borderRadius: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2rem',
          flexShrink: 0
          }}>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: '1.1rem', color: 'white', marginBottom: '0.25rem' }}>
            Fino Sabor
          </div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
            Plano Premium · Ativo desde 2024
          </div>
        </div>
        <button className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.15)', fontSize: '0.8rem' }}>
          Editar perfil
        </button>
      </motion.div>

      {/* Cardápio do Dia Config */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
        style={{ marginBottom: '1.5rem', maxWidth: '720px', border: '1.5px solid var(--primary)', background: 'var(--amber-50)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ background: 'var(--primary-light)', padding: '0.5rem', borderRadius: 'var(--radius-md)', color: 'var(--amber-700)' }}>
            <Utensils size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>Cardápio do Dia</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Selecione os pratos que estarão em destaque hoje no cardápio dos clientes.</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
          {PRODUCTS.map(product => {
            const isSelected = dailySpecials.includes(product.id);
            return (
              <button
                key={product.id}
                onClick={() => toggleSpecial(product.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)',
                  background: isSelected ? 'var(--primary)' : 'var(--surface)',
                  color: isSelected ? 'white' : 'var(--text-secondary)',
                  border: `1.5px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                  fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                  <span>{product.name}</span>
                {isSelected && <Check size={14} />}
              </button>
            )
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: saveMessage.includes('Erro') ? 'var(--danger)' : 'var(--success)' }}>
            {saveMessage}
          </span>
          <button 
            className="btn btn-primary" 
            onClick={saveSpecials}
            disabled={isSaving}
          >
            {isSaving ? 'Salvando...' : <><Save size={16} /> Salvar Cardápio de Hoje</>}
          </button>
        </div>
      </motion.div>

      {/* Settings list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', maxWidth: '720px' }}>
        {sections.map((section, i) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 + 0.2 }}
              className="card"
              style={{ 
                display: 'flex', alignItems: 'center', gap: '1.125rem',
                cursor: 'pointer', padding: '1.125rem 1.25rem',
                transition: 'all 0.15s'
              }}
              whileHover={{ x: 4 }}
            >
              <div style={{ 
                width: 44, height: 44, borderRadius: 12,
                background: section.iconBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>
                <Icon size={20} color={section.iconColor} strokeWidth={2} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.2rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{section.title}</span>
                  {section.badge && (
                    <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>{section.badge}</span>
                  )}
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{section.description}</p>
              </div>
              <ChevronRight size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
            </motion.div>
          );
        })}
      </div>

      {/* Footer info */}
      <div style={{ marginTop: '2rem', padding: '1rem 0', borderTop: '1px solid var(--border)', display: 'flex', gap: '2rem', maxWidth: 720 }}>
        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
            Versão do sistema
          </div>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, marginTop: '0.25rem' }}>v2.1.0</div>
        </div>
        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
            Última atualização
          </div>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, marginTop: '0.25rem' }}>Hoje, 20:45</div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
