import React,{useEffect,useMemo,useState} from 'react'
import {createRoot} from 'react-dom/client'
import {Home,Flame,Instagram,BarChart3,Settings,Sparkles,Plus,Search,Link2,ChevronRight,Bell,Menu,X,CheckCircle2} from 'lucide-react'
import './styles.css'

const demo=[
{id:1,name:'Air Fryer Digital 5L',store:'Achado demonstrativo',price:79.90,oldPrice:149.90,trend:97,commission:12,views:18400},
{id:2,name:'Fone Bluetooth Pro',store:'Achado demonstrativo',price:59.90,oldPrice:119.90,trend:91,commission:10,views:24800},
{id:3,name:'Organizador Multiuso',store:'Achado demonstrativo',price:29.90,oldPrice:49.90,trend:88,commission:15,views:9300}
]
const score=p=>Math.min(100,Math.round(Number(p.trend||0)*.6+Math.min(Math.max(0,Math.round((1-p.price/p.oldPrice)*100)),70)*.4))
const brl=n=>'R$ '+Number(n).toFixed(2).replace('.',',')
function App(){
 const [tab,setTab]=useState('home'),[products,setProducts]=useState(demo),[stories,setStories]=useState([]),[q,setQ]=useState(''),[menu,setMenu]=useState(false),[install,setInstall]=useState(null)
 useEffect(()=>{if('serviceWorker'in navigator)navigator.serviceWorker.register('/sw.js'); const h=e=>{e.preventDefault();setInstall(e)};window.addEventListener('beforeinstallprompt',h);return()=>window.removeEventListener('beforeinstallprompt',h)},[])
 const ranked=useMemo(()=>products.filter(p=>p.name.toLowerCase().includes(q.toLowerCase())).map(p=>({...p,discount:Math.round((1-p.price/p.oldPrice)*100),score:score(p)})).sort((a,b)=>b.score-a.score),[products,q])
 const createStory=p=>setStories(s=>[{...p,storyId:Date.now(),status:'Pendente'},...s])
 const nav=(x)=>{setTab(x);setMenu(false)}
 return <div className="phoneApp">
  <header className="top"><button className="icon" onClick={()=>setMenu(true)}><Menu/></button><div className="logo"><Sparkles/> <b>ACHADINHOS</b><span>IA</span></div><button className="icon"><Bell/></button></header>
  {menu&&<div className="drawer"><div className="drawerHead"><b>Menu</b><button className="icon" onClick={()=>setMenu(false)}><X/></button></div>{[['home','Início',Home],['products','Achadinhos',Flame],['stories','Stories',Instagram],['analytics','Resultados',BarChart3],['settings','Configurações',Settings]].map(([id,l,I])=><button onClick={()=>nav(id)} key={id}><I/>{l}<ChevronRight/></button>)}</div>}
  <main>
   {tab==='home'&&<><div className="welcome"><div><small>BOA NOITE</small><h1>Vamos vender hoje? 🔥</h1><p>Veja os achadinhos com maior potencial.</p></div></div>
    <div className="cards"><Card n={ranked.length} l="Achadinhos"/><Card n={stories.length} l="Stories prontos"/><Card n="97" l="Melhor score"/></div>
    <div className="sectionTitle"><h2>🔥 Top achadinhos</h2><button onClick={()=>nav('products')}>Ver todos</button></div>
    <div className="products">{ranked.slice(0,3).map(p=><Product p={p} onStory={createStory}/>)}</div>
    <div className="quick"><button onClick={()=>nav('products')}><Search/> Encontrar achadinhos</button><button onClick={()=>nav('stories')}><Sparkles/> Criar Stories</button></div>
   </>}
   {tab==='products'&&<><PageTitle title="Achadinhos"/><div className="search"><Search/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar produto"/></div><div className="products">{ranked.map(p=><Product p={p} onStory={createStory}/>)}</div></>}
   {tab==='stories'&&<><PageTitle title="Stories"/>{stories.length===0?<Empty icon={Instagram} text="Você ainda não preparou nenhum Story."/>:<div className="stories">{stories.map(s=><div className="story"><div className="storyCanvas"><small>ACHADINHO IA</small><h2>{s.name}</h2><del>{brl(s.oldPrice)}</del><strong>{brl(s.price)}</strong><p>⚡ OFERTA ENCONTRADA HOJE</p><span>ADICIONE O LINK</span></div><button className="publish" onClick={()=>alert('Fluxo assistido: abra o Instagram, adicione a figurinha LINK e cole seu link de afiliado.')}>📲 Publicar assistido</button></div>)}</div>}</>}
   {tab==='analytics'&&<><PageTitle title="Resultados"/><div className="bigMetric"><small>Potencial estimado</small><strong>R$ 436</strong><p>Quando conectarmos links e métricas reais, esta tela mostrará cliques, vendas, comissão e conversão.</p></div><div className="panel"><h3>📈 Próximos indicadores</h3><p>Visualizações · Cliques · CTR · Vendas · Comissão · ROI</p></div></>}
   {tab==='settings'&&<><PageTitle title="Configurações"/><div className="panel"><h3>📷 Instagram / Meta</h3><p>Conta profissional ainda não conectada.</p><button className="mainBtn" onClick={()=>alert('Na próxima etapa vamos configurar o OAuth oficial da Meta.')}>Conectar Meta</button></div><div className="panel"><h3>📱 Instalar aplicativo</h3><p>Esta é uma PWA. Quando hospedada, você poderá adicioná-la à tela inicial do celular.</p>{install&&<button className="mainBtn" onClick={async()=>{await install.prompt();setInstall(null)}}>Instalar agora</button>}</div></>}
  </main>
  <nav className="bottom">{[['home','Início',Home],['products','Achadinhos',Flame],['stories','Stories',Instagram],['analytics','Resultados',BarChart3],['settings','Ajustes',Settings]].map(([id,l,I])=><button className={tab===id?'selected':''} onClick={()=>nav(id)} key={id}><I/><small>{l}</small></button>)}</nav>
 </div>
}
function Card({n,l}){return <div className="card"><strong>{n}</strong><small>{l}</small></div>}
function PageTitle({title}){return <div className="pageTitle"><h1>{title}</h1><button className="icon"><Plus/></button></div>}
function Product({p,onStory}){return <article className="product"><div className="productIcon">🔥</div><div className="productInfo"><small>{p.store}</small><h3>{p.name}</h3><div><del>{brl(p.oldPrice)}</del> <b>{brl(p.price)}</b></div><div className="tags"><span>{p.discount}% OFF</span><span>Score {p.score}</span><span>{p.commission}% comissão</span></div></div><button className="storyBtn" onClick={()=>onStory(p)}><Sparkles/></button></article>}
function Empty({icon:Icon,text}){return <div className="empty"><Icon/><p>{text}</p></div>}
createRoot(document.getElementById('root')).render(<App/>)
