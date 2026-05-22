import { PIZZAS } from '../../data/pizzas';

function Menu({
  cart,
  adicionarAoCarrinho,
  removerDoCarrinho,
  ajustarQuantidade,
  totalAmount,
  setIsModalOpen
}) {
  return (
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
  );
}

export default Menu;
