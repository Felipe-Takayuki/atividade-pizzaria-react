function Contato({
  contactForm,
  formErrors,
  isContactSuccess,
  setIsContactSuccess,
  handleContactSubmit,
  handleContactChange
}) {
  return (
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
  );
}

export default Contato;
