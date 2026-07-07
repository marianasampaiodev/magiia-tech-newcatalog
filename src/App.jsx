import { useState, useEffect, useRef } from "react";
import { Search, ArrowRight, Zap, Headphones, Smartphone, MessageCircle, Truck, Home, CreditCard, Camera } from "lucide-react";
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
  capas: [
    {
      nome: "Capa Silicone Premium",
      compat: "iPhone 12 · 13 · 14",
      desc: "Silicone premium com acabamento interno aveludado que evita riscos. Bordas elevadas protegem câmera e tela.",
      preco: "49,90",
      glyph: "📱",
      imagem: "/case.jpg",
      novo: true,
    },
    {
      nome: "Capa Antishock Reforçada",
      compat: "iPhone 12 · 13 · 14 · 15",
      desc: "Proteção reforçada contra quedas e impactos, sem perder o toque fino e confortável no dia a dia.",
      preco: "59,90",
      glyph: "🛡️",
      imagem: "/case.jpg",
    },
    {
      nome: "Capa MagSafe Transparente",
      compat: "iPhone 13 · 14 · 15",
      desc: "Compatível com carregamento magnético, mantém o design original visível com transparência cristalina.",
      preco: "69,90",
      glyph: "✨",
      imagem: "/case.jpg",
    },
    {
      nome: "Capa Aveludada Soft Touch",
      compat: "Samsung S23 · S24",
      desc: "Toque macio e sofisticado, com encaixe perfeito e excelente durabilidade no uso diário.",
      preco: "54,90",
      glyph: "🖤",
      imagem: "/case.jpg",
    },
    {
      nome: "Capa Transparente Anti-Amarelamento",
      compat: "iPhone 14 · 15",
      desc: "Material especial que não amarela com o tempo, mantendo a transparência por muito mais tempo.",
      preco: "44,90",
      glyph: "💎",
      imagem: "/case.jpg",
    },
  ],
  energia: [
    {
      nome: "Carregador Turbo 30W USB-C",
      compat: "Universal",
      desc: "Carregamento rápido e seguro para smartphones compatíveis, com proteção contra superaquecimento.",
      preco: "69,90",
      glyph: "⚡",
      imagem: "/charger.jpg",
      novo: true,
    },
    {
      nome: "Fonte Dupla USB 20W",
      compat: "Universal",
      desc: "Duas portas para carregar dois aparelhos ao mesmo tempo, com entrega de energia estável.",
      preco: "49,90",
      glyph: "🔌",
      imagem: "/charger.jpg",
    },
    {
      nome: "Cabo Lightning Reforçado 1m",
      compat: "iPhone",
      desc: "Trançado em nylon resistente a dobras, feito para durar muito mais que o cabo convencional.",
      preco: "34,90",
      glyph: "🔗",
      imagem: "/charger.jpg",
    },
    {
      nome: "Cabo USB-C Nylon Trançado",
      compat: "Universal",
      desc: "Transmissão rápida de dados e energia, com acabamento premium que resiste ao uso diário.",
      preco: "29,90",
      glyph: "🔗",
      imagem: "/charger.jpg",
    },
    {
      nome: "Carregador Veicular Turbo",
      compat: "Universal",
      desc: "Duas saídas USB para carregar rápido durante o trajeto, com encaixe firme na saída do veículo.",
      preco: "44,90",
      glyph: "🚗",
      imagem: "/charger.jpg",
    },
    {
      nome: "Power Bank 10000mAh",
      compat: "Universal",
      desc: "Autonomia extra para o dia todo, com design compacto que cabe fácil na bolsa ou mochila.",
      preco: "99,90",
      glyph: "🔋",
      imagem: "/charger.jpg",
    },
  ],
  audio: [
    {
      nome: "Fone Bluetooth TWS Pro",
      compat: "Universal",
      desc: "Som nítido, conexão estável e case compacto com carregamento portátil para o dia a dia.",
      preco: "129,90",
      glyph: "🎧",
      imagem: "/headphone.jpg",
      novo: true,
    },
    {
      nome: "Headset Gamer RGB",
      compat: "Universal",
      desc: "Áudio imersivo com microfone destacável, ideal para jogos e chamadas com alta clareza.",
      preco: "149,90",
      glyph: "🎮",
      imagem: "/headphone.jpg",
    },
    {
      nome: "Caixa de Som Bluetooth Portátil",
      compat: "Universal",
      desc: "Graves potentes em um corpo compacto, resistente a respingos e perfeita para qualquer ambiente.",
      preco: "89,90",
      glyph: "🔊",
      imagem: "/headphone.jpg",
    },
    {
      nome: "Fone Bluetooth Esportivo",
      compat: "Universal",
      desc: "Encaixe firme e resistente ao suor, pensado para treinos e atividades físicas intensas.",
      preco: "79,90",
      glyph: "🏃",
      imagem: "/headphone.jpg",
    },
  ],
};

const CATEGORIAS_INFO = {
  capas: {
    label: "Capas",
    emoji: "📱",
    desc: "Proteção premium para seu smartphone.",
    mediaBg: "linear-gradient(155deg,#F5F5F5 0%,#ECECEC 100%)",
  },
  energia: {
    label: "Carregadores",
    emoji: "⚡",
    desc: "Carregadores, cabos e fontes Turbo.",
    mediaBg: "linear-gradient(155deg,#F5EBFA 0%,#EDDCF6 100%)",
  },
  audio: {
    label: "Fones",
    emoji: "🎧",
    desc: "Fones Bluetooth e acessórios.",
    mediaBg: "linear-gradient(155deg,#F2ECFA 0%,#E9E0F6 100%)",
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
  const icons = { capas: Smartphone, energia: Zap, audio: Headphones };
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

  const sectionRefs = {
    capas: useRef(null),
    energia: useRef(null),
    audio: useRef(null),
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
              <small>Fortaleza · CE</small>
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => window.open(whatsappLink("Catálogo Magia Tech"), "_blank")}>
            <MessageCircle size={18} />
            Fazer Pedido
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="eyebrow">
            <span className="dot" /> Loja especializada em Fortaleza
          </div>
          <h1>
            Acessórios de <span className="accent-word">alta performance</span> para o seu smartphone.
          </h1>
          <p>Qualidade garantida, curadoria premium e entrega rápida. Peça em segundos, direto pelo WhatsApp.</p>
          <div className="hero-actions">
            <button
              className="btn btn-primary btn-lg"
              onClick={() => window.open(whatsappLink("Catálogo Magia Tech"), "_blank")}
            >
              <MessageCircle size={19} />
              Fazer Pedido
            </button>
            <div className="hero-meta">
              <strong>+30</strong> produtos disponíveis para pronta entrega
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
              placeholder="Buscar produto... (ex: capa, cabo, fone)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="filters">
            {["todos", "capas", "energia", "audio"].map((f) => (
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
              <p>Os melhores acessórios e produtos de tecnologia.</p>
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