import { useState, useEffect, useRef } from "react";
import { Search, ArrowRight, Zap, Headphones, Cable, MessageCircle, Truck, Home, CreditCard, Camera, Sun, Moon } from "lucide-react";
import "./App.css"; // <-- Importação do CSS adicionada aqui

/* ==========================================================
   CONFIGURAÇÃO GERAL
   Troque o número abaixo pelo WhatsApp real da loja
   (formato: código do país + DDD + número, apenas dígitos).
========================================================== */
const WHATSAPP_NUMBER = "5585989466760"; // <-- SUBSTITUA PELO SEU NÚMERO

// Cole aqui o link (ou caminho) da logo real da loja.
// Enquanto estiver vazio, o quadrado com as iniciais "MT" é usado no lugar.
const LOGO_URL = "/logo.png"; // <-- SUBSTITUA PELO SEU NÚMERO

function whatsappLink(productName) {
  const mensagem = `Olá! Gostaria de comprar o produto ${productName}. Ainda está disponível?`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
}

/* ==========================================================
   BASE DE PRODUTOS
   Estrutura pensada para crescer facilmente: basta adicionar
   novos objetos a cada array para incluir mais produtos.
   O campo "imagem" fica vazio até você ter fotos reais —
   quando preenchido, a foto substitui o ícone automaticamente.
========================================================== */
const PRODUTOS = {
  carregadores: [
    {
      nome: "Carregador USB-C 45W",
      compat: "iPhone 15 ou superior, Samsung Galaxy, Motorola, Xiaomi",
      desc: "Carregador com tecnologia PD e PPS, pensado para recargas mais rápidas e eficientes. Acompanha cabo USB-C para USB-C, ideal para quem quer praticidade em um único kit.",
      preco: "32,00",
      glyph: "⚡",
      imagem: "/Carregador tipo c 45w.png",
    },
    {
      nome: "Carregador Turbo 5.1A com Cabo USB-C",
      compat: "iPhone 15 ou superior, Samsung Galaxy, Motorola, Xiaomi",
      desc: "Kit com carregador turbo e cabo USB-C de 1 metro, ideal para quem busca recargas rápidas e praticidade em um só conjunto.",
      preco: "28,00",
      glyph: "⚡",
      imagem: "/carregador tipo c turbo 1m.png",
      
    }
    
  ],
  cabos: [
    {
      nome: "Cabo Micro USB V8 ",
      compat: "Galaxy J2/J5/J7, Moto G",
      desc: "Cabo de 1 metro para carregamento rápido e transferência de dados, prático para usar no dia a dia.",
      preco: "10,00",
      glyph: "🔗",
      imagem: "/cabo v8.png",
    },
    {
      nome: "Cabo Carregador USB-C",
      compat: "iPhone 15 ou superior, Samsung Galaxy e outros",
      desc: "Conexão USB-C prática e versátil para manter seus dispositivos carregados em casa, no trabalho ou onde precisar.",
      preco: "10,00",
      glyph: "🔗",
      imagem: "/Cabo tipo c soltoo.png",
    },
  ],
  fones: [
    {
      nome: "Fone Bluetooth M1",
      compat: "Universal",
      desc: "Fone sem fio com Bluetooth 5.3 e estojo com display digital, ideal para músicas, chamadas e uso no dia a dia.",
      preco: "60,00",
      glyph: "🎧",
      imagem: "/fone azul sem fio azul.png",
       novo: true,
      
    },
    {
      nome: "Fone Gamer Bluetooth",
      compat: "Universal",
      desc: "Fone sem fio com visual gamer, estojo com display de bateria e encaixe compacto para jogar, ouvir música e usar no dia a dia.",
      preco: "44,00",
      glyph: "🎮",
      imagem: "/fone gamer.png",
     
    },
    {
      nome: "Fone Bluetooth Esportivo",
      compat: "Universal",
      desc: "Fone estéreo sem fio com Bluetooth 5.1 e estojo com visor digital, oferecendo praticidade para músicas, chamadas e uso diário.",
      preco: "70,00",
      glyph: "🏃",
      imagem: "/fonr estereo.png",
    },
  ],
};

const CATEGORIAS_INFO = {
  carregadores: {
    label: "Carregadores",
    emoji: "⚡",
    mediaBg: "linear-gradient(155deg,#F5EBFA 0%,#EDDCF6 100%)",
  },
  cabos: {
    label: "Cabos",
    emoji: "🔌",
    mediaBg: "linear-gradient(155deg,#F2ECFA 0%,#E9E0F6 100%)",
  },
  fones: {
    label: "Fones",
    emoji: "🎧",
    mediaBg: "linear-gradient(155deg,#F5F5F5 0%,#ECECEC 100%)",
  },
};

/* ==========================================================
   HOOK: revela o card com fade-in assim que ele entra na tela
========================================================== */
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}

/* ==========================================================
   COMPONENTE: Card de produto
========================================================== */
function ProductCard({ produto, categoria }) {
  const [ref, inView] = useInView();
  const info = CATEGORIAS_INFO[categoria];

  return (
    <div
      ref={ref}
      className="product-card"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(22px)",
        transition: "opacity .7s cubic-bezier(.2,.8,.2,1), transform .7s cubic-bezier(.2,.8,.2,1), box-shadow .4s ease",
      }}
    >
      <div className="card-media" style={{ background: info.mediaBg }}>
        {produto.novo && <span className="tag-new">Novidade</span>}
        {produto.imagem ? (
          <img src={produto.imagem} alt={produto.nome} className="card-img" />
        ) : (
          <span className="glyph">{produto.glyph}</span>
        )}
      </div>
      <div className="card-body">
        <h4>{produto.nome}</h4>
        <span className="compat">{produto.compat}</span>
        <p className="desc">{produto.desc}</p>
        <div className="price-row">
          <div className="price">
            R$ {produto.preco}
            <small>à vista</small>
          </div>
        </div>
        <button className="btn btn-primary btn-buy" onClick={() => window.open(whatsappLink(produto.nome), "_blank")}>
          <MessageCircle size={17} />
          Comprar pelo WhatsApp
        </button>
      </div>
    </div>
  );
}

/* ==========================================================
   COMPONENTE: Marca (logo)
   Mostra a imagem da logo real quando LOGO_URL estiver
   preenchida; caso contrário, cai no quadrado com "MT".
========================================================== */
function BrandMark() {
  return (
    <div className={`brand-mark ${LOGO_URL ? 'has-logo' : ''}`}>
      {LOGO_URL ? <img src={LOGO_URL} alt="Logo Magia Tech" className="brand-mark-img" /> : <span>MT</span>}
    </div>
  );
}

/* ==========================================================
   COMPONENTE: Cartão de categoria (topo da página)
========================================================== */
function CategoryCard({ id, categoria, onClick }) {
  const info = CATEGORIAS_INFO[categoria];
  const icons = { carregadores: Zap, cabos: Cable, fones: Headphones };
  const Icon = icons[categoria];

  return (
    <button className="cat-card" onClick={() => onClick(id)}>
      <div className="cat-icon">
        <Icon size={24} strokeWidth={2} />
      </div>
      <h3>{info.label}</h3>
      <p>{info.desc}</p>
      <span className="go">
        Explorar <ArrowRight size={15} />
      </span>
    </button>
  );
}

/* ==========================================================
   COMPONENTE PRINCIPAL
========================================================== */
export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [search, setSearch] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const sectionRefs = {
    carregadores: useRef(null),
    cabos: useRef(null),
    fones: useRef(null),
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const irParaCategoria = (categoria) => {
    sectionRefs[categoria].current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const termoBusca = search.trim().toLowerCase();

  // Retorna a lista filtrada (por busca) de uma categoria específica
  const listaFiltrada = (categoria) =>
    PRODUTOS[categoria].filter((p) => termoBusca === "" || p.nome.toLowerCase().includes(termoBusca));

  const categoriasVisiveis = Object.keys(PRODUTOS).filter(
    (categoria) => filtro === "todos" || filtro === categoria
  );

  const totalVisivel = categoriasVisiveis.reduce((acc, categoria) => acc + listaFiltrada(categoria).length, 0);

  return (
    <div className="catalogo-root">
      {/* CABEÇALHO */}
      <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
        <div className="container header-inner">
          <div className="brand">
            <BrandMark />
            <div className="brand-name">
              Magia Tech
            
            </div>
          </div>
          <div className="header-actions">
            <button
              className="btn theme-toggle"
              onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
              aria-label={theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}
              title={theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="btn btn-primary" onClick={() => window.open(whatsappLink("Catálogo Magia Tech"), "_blank")}>
              <MessageCircle size={18} />
              Fazer Pedido
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="container hero-inner">
          
          <h1>
            Seu próximo <span className="accent-word">acessório </span> favorito está aqui.
          </h1>
          <p>Fones, cabos, carregadores e muito mais para facilitar seu dia. Role e encontre o seu.</p>
          <div className="hero-actions">
            <button
              className="btn btn-primary btn-lg"
              onClick={() => window.open(whatsappLink("Catálogo Magia Tech"), "_blank")}
            >
              <MessageCircle size={19} />
              Fazer Pedido
            </button>
            <div className="hero-meta">
              <strong>+10</strong> itens disponíveis para pronta entrega
            </div>
          </div>
        </div>
      </section>

      {/* CARTÕES DE CATEGORIA */}
      <section className="categories">
        <div className="container cat-grid">
          {Object.keys(PRODUTOS).map((categoria) => (
            <CategoryCard key={categoria} id={categoria} categoria={categoria} onClick={irParaCategoria} />
          ))}
        </div>
      </section>

      {/* BARRA DE PESQUISA + FILTROS */}
      <div className="toolbar-wrap">
        <div className="container toolbar">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Buscar produto... (ex: fone, cabo, carregador)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="filters">
            {["todos", "carregadores", "cabos", "fones"].map((f) => (
              <button key={f} className={`chip ${filtro === f ? "active" : ""}`} onClick={() => setFiltro(f)}>
                {f === "todos" ? "Todos" : CATEGORIAS_INFO[f].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container">
        {totalVisivel === 0 && (
          <div className="no-results">
            <div className="em">🔍</div>
            <p>Nenhum produto encontrado. Tente outro termo de busca.</p>
          </div>
        )}
      </div>

      {/* VITRINES */}
      {categoriasVisiveis.map((categoria) => {
        const produtos = listaFiltrada(categoria);
        if (produtos.length === 0) return null;
        const info = CATEGORIAS_INFO[categoria];
        return (
          <section className="section" id={`cat-${categoria}`} key={categoria} ref={sectionRefs[categoria]}>
            <div className="container">
              <div className="section-head">
                <h2>
                  {info.emoji} {info.label} <span className="badge-count">{produtos.length} modelos</span>
                </h2>
                <p>{info.desc}</p>
              </div>
              <div className="grid-products">
                {produtos.map((produto) => (
                  <ProductCard key={produto.nome} produto={produto} categoria={categoria} />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* RODAPÉ */}
      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="brand">
                <BrandMark />
                <div className="brand-name" style={{ color: "#fff" }}>
                  Magia Tech
                </div>
              </div>
              <p>Fones, cabos e carregadores com qualidade e atendimento rápido.</p>
            </div>

            <div className="footer-col">
              <h5>Meios de pagamentos</h5>
              <div className="pay-icons">
                <span className="pay-badge">Pix</span>
              </div>
            </div>

            <div className="footer-col">
              <h5>Contato</h5>
              <div className="footer-item">
                <MessageCircle size={17} />
                <button onClick={() => window.open(whatsappLink("Catálogo Magia Tech"), "_blank")} style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", padding: 0, font: "inherit" }}>
                  (85) 98946-6760
                </button>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© 2026 Magia Tech. Todos os direitos reservados.</span>
          </div>
        </div>
      </footer>

      {/* BOTÃO FLUTUANTE DO WHATSAPP */}
      <button
        className="float-whats"
        aria-label="Fale pelo WhatsApp"
        onClick={() => window.open(whatsappLink("Catálogo Magia Tech"), "_blank")}
      >
        <MessageCircle size={28} color="#fff" />
      </button>
    </div>
  );
}