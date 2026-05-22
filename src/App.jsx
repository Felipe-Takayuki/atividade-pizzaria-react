import { useState, useEffect } from 'react';
import './App.css';

// 1. Dados do Cardápio Simplificados (Conforme INSTRUCOES_INTERFACE.md)
const PIZZAS = [
  {
    id: 1,
    name: "Calabresa",
    description: "Molho de tomate artesanal, mozzarella premium, calabresa defumada fatiada e cebola fresca com um toque de orégano.",
    price: 45.00,
    image: "/assets/pepperoni.png"
  },
  {
    id: 2,
    name: "Margherita",
    description: "Molho de tomate italiano, mozzarella de búfala fresca, folhas de manjericão gigante e um fio de azeite extra virgem.",
    price: 50.00,
    image: "/assets/margherita.png"
  },
  {
    id: 3,
    name: "Frango",
    description: "Frango desfiado temperado, mozzarella cremosa, catupiry original e milho verde selecionado.",
    price: 55.00,
    image: "/assets/mushroom.png"
  }
];

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
          <div>
            <h2 className="secao-titulo">Escolha sua Pizza</h2>
            
            {/* B. Grade de Pizzas / Cardápio */}
            <div className="grade-de-pizzas">
              {PIZZAS.map((pizza) => (
                <div key={pizza.id} className="cartao-pizza">
                  <img src={pizza.image} alt={pizza.name} />
                  <h3>{pizza.name}</h3>
                  <p className="pizza-descricao">{pizza.description}</p>
                  <span className="preco">
                    R$ {pizza.price.toFixed(2).replace('.', ',')}
                  </span>
                  
                  {/* Botão Pedir Agora */}
                  <button 
                    className="botao-pedir"
                    data-sabor={pizza.name}
                    data-preco={pizza.price}
                    onClick={(e) => {
                      e.preventDefault();
                      adicionarAoCarrinho(pizza.name, pizza.price, pizza.image);
                    }}
                  >
                    Pedir Agora
                  </button>
                </div>
              ))}
            </div>

            {/* C. Seção do Carrinho Dinâmico */}
            <section id="carrinho-container">
              <h2>🛒 Carrinho de Compras</h2>
              
              <div className="carrinho-lista">
                {cart.length === 0 ? (
                  <div className="carrinho-vazio">
                    Seu carrinho está vazio. Adicione pizzas do cardápio!
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.name} className="item-carrinho">
                      <div className="item-info">
                        <span className="item-nome">{item.name}</span>
                        <span className="item-detalhe">
                          R$ {item.price.toFixed(2).replace('.', ',')} cada
                        </span>
                      </div>
                      
                      <div className="item-acoes">
                        {/* Controles de Quantidade */}
                        <div className="controles-quantidade">
                          <button 
                            className="btn-qty" 
                            onClick={() => ajustarQuantidade(item.name, -1)}
                          >
                            -
                          </button>
                          <span className="qty-display">{item.quantidade}</span>
                          <button 
                            className="btn-qty" 
                            onClick={() => ajustarQuantidade(item.name, 1)}
                          >
                            +
                          </button>
                        </div>
                        
                        {/* Botão Remover */}
                        <button 
                          className="btn-remove"
                          onClick={() => removerDoCarrinho(item.name)}
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div>
                  <div className="carrinho-total-secao">
                    <span>Total do Pedido:</span>
                    <span id="total">R$ {totalAmount.toFixed(2).replace('.', ',')}</span>
                  </div>
                  
                  {/* Botão Finalizar Pedido */}
                  <button 
                    id="botao-finalizar"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Finalizar Pedido
                  </button>
                </div>
              )}
            </section>
          </div>
        ) : (
          // Página de Contato
          <section className="contato-secao">
            <h2 className="secao-titulo">Fale Conosco</h2>
            
            {isContactSuccess ? (
              <div className="sucesso-contato-card">
                <div className="sucesso-badge">✓</div>
                <h3>Sua mensagem foi enviada!</h3>
                <p>Obrigado pelo contato! Nossa equipe responderá o mais breve possível.</p>
                <button 
                  className="btn-voltar" 
                  onClick={() => setIsContactSuccess(false)}
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              // Formulário de Contato
              <form id="form-contato" onSubmit={handleContactSubmit} noValidate>
                {/* Nome */}
                <div className="campo">
                  <label htmlFor="name">Nome Completo</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    placeholder="Seu Nome Completo"
                    className={formErrors.name ? 'input-error' : ''}
                    value={contactForm.name}
                    onChange={handleContactChange}
                  />
                  <span 
                    className="erro" 
                    style={{ display: formErrors.name ? 'block' : 'none' }}
                  >
                    {formErrors.name}
                  </span>
                </div>

                {/* E-mail */}
                <div className="campo">
                  <label htmlFor="email">E-mail</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    placeholder="seuemail@exemplo.com"
                    className={formErrors.email ? 'input-error' : ''}
                    value={contactForm.email}
                    onChange={handleContactChange}
                  />
                  <span 
                    className="erro" 
                    style={{ display: formErrors.email ? 'block' : 'none' }}
                  >
                    {formErrors.email}
                  </span>
                </div>

                {/* Mensagem */}
                <div className="campo">
                  <label htmlFor="message">Mensagem</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows="5"
                    placeholder="Sua mensagem"
                    className={formErrors.message ? 'input-error' : ''}
                    value={contactForm.message}
                    onChange={handleContactChange}
                  ></textarea>
                  <span 
                    className="erro" 
                    style={{ display: formErrors.message ? 'block' : 'none' }}
                  >
                    {formErrors.message}
                  </span>
                </div>

                {/* Botão Enviar */}
                <button type="submit" className="botao-enviar">
                  Enviar Mensagem
                </button>
              </form>
            )}
          </section>
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
