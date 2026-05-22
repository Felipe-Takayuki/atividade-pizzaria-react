import { useState, useEffect } from 'react';
import './App.css';
import Menu from './pages/Menu/Menu';
import Contato from './pages/Contato/Contato';

// --- 💾 Persistência de Dados (localStorage) ---
const salvarNoLocalStorage = (carrinho) => {
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
};

const carregarDoLocalStorage = () => {
  const dadosSalvos = localStorage.getItem('carrinho');
  try {
    return dadosSalvos ? JSON.parse(dadosSalvos) : [];
  } catch (error) {
    console.error("Erro ao carregar do LocalStorage:", error);
    return [];
  }
};

function App() {
  // --- Estados ---
  const [currentTab, setCurrentTab] = useState('menu'); // 'menu' ou 'contato'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  
  // Carrinho de Compras
  const [cart, setCart] = useState(() => carregarDoLocalStorage());

  // Formulário de Contato
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [formErrors, setFormErrors] = useState({});
  const [isContactSuccess, setIsContactSuccess] = useState(false);

  // --- Efeitos ---
  useEffect(() => {
    salvarNoLocalStorage(cart);
  }, [cart]);

  // --- Notificação Toast ---
  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // --- Atividade 1 - Adicionar Itens ao Carrinho ---
  const adicionarAoCarrinho = (sabor, preco, imagem) => {
    setCart((prevCart) => {
      const itemIndex = prevCart.findIndex((item) => item.name === sabor);
      if (itemIndex > -1) {
        const novoCarrinho = [...prevCart];
        novoCarrinho[itemIndex] = {
          ...novoCarrinho[itemIndex],
          quantidade: novoCarrinho[itemIndex].quantidade + 1
        };
        return novoCarrinho;
      } else {
        return [...prevCart, { name: sabor, price: preco, image: imagem, quantidade: 1 }];
      }
    });
    showToast(`"${sabor}" adicionada ao carrinho!`);
  };

  // --- Atividade 2 - Remover Itens do Carrinho ---
  const removerDoCarrinho = (sabor) => {
    setCart((prevCart) => prevCart.filter((item) => item.name !== sabor));
    showToast(`"${sabor}" removida com sucesso!`, 'info');
  };

  // Ajuste de Quantidade reativo
  const ajustarQuantidade = (sabor, delta) => {
    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.name === sabor) {
          const novaQtd = item.quantidade + delta;
          return novaQtd >= 1 ? { ...item, quantidade: novaQtd } : item;
        }
        return item;
      });
    });
  };

  // --- Cálculos ---
  const totalAmount = cart.reduce((soma, item) => soma + (item.price * item.quantidade), 0);
  const totalQuantity = cart.reduce((soma, item) => soma + item.quantidade, 0);

  // --- Atividade 5 - Validar Formulário de Contato ---
  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
    
    // Limpa o erro ao digitar
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // 1. Nome: não pode estar em branco
    if (!contactForm.name.trim()) {
      errors.name = "! O nome é obrigatório.";
    }
    
    // 2. E-mail: deve obedecer à regex
    if (!contactForm.email.trim()) {
      errors.email = "! Insira um e-mail válido.";
    } else if (!emailRegex.test(contactForm.email)) {
      errors.email = "! Insira um e-mail válido.";
    }
    
    // 3. Mensagem: mínimo de 10 caracteres
    if (!contactForm.message.trim()) {
      errors.message = "! A mensagem deve ter pelo menos 10 caracteres.";
    } else if (contactForm.message.trim().length < 10) {
      errors.message = "! A mensagem deve ter pelo menos 10 caracteres.";
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showToast("Por favor, corrija os erros no formulário.", "error");
      return;
    }
    
    // Sucesso
    alert("Mensagem enviada com sucesso!");
    setContactForm({ name: '', email: '', message: '' });
    setFormErrors({});
    setIsContactSuccess(true);
  };

  // --- Atividade 3 - Modal de Resumo do Pedido ---
  const handleConfirmarPedido = () => {
    // Limpa o carrinho e LocalStorage
    setCart([]);
    localStorage.removeItem('carrinho');
    setIsModalOpen(false);
    
    // Alerta de sucesso
    alert("Pedido confirmado com sucesso! Prepare o paladar, sua pizza já está a caminho!");
  };

  return (
    <div className="app-container">
      
      {/* A. Cabeçalho Principal */}
      <header className="cabecalho-principal">
        <h1>🍕 Pizzaria Fatec</h1>
        <nav className="nav-links">
          <button 
            className={currentTab === 'menu' ? 'active' : ''}
            onClick={() => setCurrentTab('menu')}
          >
            Cardápio
          </button>
          <button 
            className={currentTab === 'contato' ? 'active' : ''}
            onClick={() => {
              setCurrentTab('contato');
              setIsContactSuccess(false);
            }}
          >
            Contato
          </button>
          
          {/* Indicador de Carrinho */}
          <div className="nav-cart-indicator">
            🛒 <span className="cart-badge">{totalQuantity}</span>
          </div>
        </nav>
      </header>

      {/* Hero Banner Decorativo */}
      <section className="pizzaria-hero">
        <h2>Sabores que Apaixonam</h2>
        <p>A verdadeira pizza artesanal napolitana com ingredientes nobres assada no forno de pedra.</p>
      </section>

      {/* Conteúdo Principal */}
      <main>
        {currentTab === 'menu' ? (
          <Menu
            cart={cart}
            adicionarAoCarrinho={adicionarAoCarrinho}
            removerDoCarrinho={removerDoCarrinho}
            ajustarQuantidade={ajustarQuantidade}
            totalAmount={totalAmount}
            setIsModalOpen={setIsModalOpen}
          />
        ) : (
          <Contato
            contactForm={contactForm}
            formErrors={formErrors}
            isContactSuccess={isContactSuccess}
            setIsContactSuccess={setIsContactSuccess}
            handleContactSubmit={handleContactSubmit}
            handleContactChange={handleContactChange}
          />
        )}
      </main>

      {/* D. Modal de Resumo do Pedido */}
      <div 
        className={`modal-overlay ${isModalOpen ? 'active' : ''}`}
        onClick={() => setIsModalOpen(false)}
      >
        <div 
          className={`modal ${isModalOpen ? 'active' : ''}`}
          onClick={(e) => e.stopPropagation()} // Impede o fechamento ao clicar dentro da caixa
        >
          <div className="modal-cabecalho">
            <h3>🔥 Resumo do seu Pedido</h3>
            <span 
              style={{ cursor: 'pointer', fontSize: '1.5rem', fontWeight: 'bold' }}
              onClick={() => setIsModalOpen(false)}
            >
              ×
            </span>
          </div>
          
          <div className="modal-corpo">
            {/* Lista detalhada */}
            <div className="modal-resumo-lista">
              {cart.map((item) => (
                <div key={item.name} className="modal-resumo-item">
                  <span className="resumo-nome">
                    {item.quantidade}x {item.name}
                  </span>
                  <span>
                    R$ {(item.price * item.quantidade).toFixed(2).replace('.', ',')}
                  </span>
                </div>
              ))}
            </div>

            {/* Caixa de Resumo e Soma Final */}
            <div className="modal-resumo-total-box">
              <div className="modal-info-row">
                <span>Quantidade total de pizzas:</span>
                <span style={{ fontWeight: 'bold' }}>{totalQuantity}</span>
              </div>
              <div className="modal-info-row">
                <span>Tempo de Entrega Estimado:</span>
                <span style={{ color: 'var(--cor-sucesso)', fontWeight: 'bold' }}>30 a 45 min</span>
              </div>
              <div className="modal-info-row soma-final">
                <span>Soma Final:</span>
                <span>R$ {totalAmount.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
          </div>
          
          <div className="modal-rodape">
            {/* Botão Fechar Modal */}
            <button 
              className="modal-btn modal-btn-fechar"
              onClick={() => setIsModalOpen(false)}
            >
              Fechar Modal
            </button>
            
            {/* Botão Confirmar */}
            <button 
              className="modal-btn modal-btn-confirmar"
              onClick={handleConfirmarPedido}
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>

      {/* Toast flutuante de feedback */}
      {notification && (
        <div className={`toast-notificacao ${notification.type === 'error' ? 'error' : 'success'}`}>
          <span>{notification.type === 'error' ? '⚠' : '✓'}</span>
          <span>{notification.message}</span>
        </div>
      )}

    </div>
  );
}

export default App;
