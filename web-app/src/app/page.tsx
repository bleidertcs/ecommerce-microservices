import Button from "@/components/ui/Button";
import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8010';

async function getFeaturedProducts() {
  try {
    const res = await fetch(`${API_BASE}/api/v1/products`, { 
      cache: 'no-store'
    });
    if (!res.ok) return [];
    const json = await res.json();
    const products = Array.isArray(json) ? json : (json.data || json.products || []);
    return products.slice(0, 4);
  } catch (error) {
    return [];
  }
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="section-padding" style={{ 
        textAlign: 'center',
        paddingTop: '160px',
        paddingBottom: '100px',
        position: 'relative'
      }}>
        <div className="container">
          <div className="badge badge-success" style={{ marginBottom: '24px' }}>New Generation of Tech</div>
          <h1 className="display-large" style={{ marginBottom: '24px' }}>
            Elevate Your <span className="text-primary text-glow">Lumina</span> Life
          </h1>
          <p style={{ 
            fontSize: '20px', 
            color: 'var(--muted)', 
            maxWidth: '700px', 
            margin: '0 auto 48px',
            fontWeight: '400'
          }}>
            Experience the intersection of luxury and technology. Curated premium electronics designed for the future.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <Link href="/products">
              <Button variant="primary" size="lg" glow>
                Explore Catalog
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="glass" size="lg">
                Join Lumina
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products (Bento Style) */}
      <section className="section-padding" style={{ background: 'rgba(255,255,255,0.01)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
            <div>
              <h2 className="display-medium" style={{ marginBottom: '12px' }}>Curated Picks</h2>
              <p className="text-muted">Hand-selected for the modern enthusiast.</p>
            </div>
            <Link href="/products" className="text-primary" style={{ fontWeight: '600' }}>
              View Showcase →
            </Link>
          </div>

          <div className="grid grid-cols-4" style={{ gap: '32px' }}>
            {featuredProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Lumina (Bento Grid Layout) */}
      <section className="section-padding">
        <div className="container">
          <h2 className="display-medium" style={{ textAlign: 'center', marginBottom: '64px' }}>The Lumina Standard</h2>
          
          <div className="bento-grid">
            <div className="glass-card bento-item-large" style={{ padding: '48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '24px' }}>✨</div>
              <h3 className="display-small" style={{ fontSize: '28px', marginBottom: '16px' }}>Impeccable Quality</h3>
              <p className="text-muted" style={{ fontSize: '18px' }}>Every product in our collection undergoes rigorous testing to meet the Lumina standard of excellence.</p>
            </div>
            
            <div className="glass-card" style={{ padding: '32px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>🛡️</div>
              <h4 style={{ fontSize: '18px', marginBottom: '12px' }}>Secure Core</h4>
              <p className="text-muted" style={{ fontSize: '14px' }}>Casdoor powered security for your peace of mind.</p>
            </div>
            
            <div className="glass-card" style={{ padding: '32px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>🚀</div>
              <h4 style={{ fontSize: '18px', marginBottom: '12px' }}>Elite Speed</h4>
              <p className="text-muted" style={{ fontSize: '14px' }}>Instant fulfillment and real-time tracking.</p>
            </div>
            
            <div className="glass-card bento-item-wide" style={{ padding: '40px', background: 'linear-gradient(90deg, var(--primary) 0%, #00d1ff 100%)', color: 'white', border: 'none' }}>
              <h3 style={{ fontSize: '24px', marginBottom: '12px' }}>Lumina Prime Support</h3>
              <p style={{ opacity: 0.9 }}>Concierge-level customer assistance available 24/7 for our elite members.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Break / Newsletter */}
      <section className="section-padding">
        <div className="container">
          <div className="glass-card" style={{ 
            padding: '80px', 
            textAlign: 'center',
            background: 'radial-gradient(circle at center, rgba(6, 127, 249, 0.15) 0%, transparent 70%)',
            border: '1px solid var(--primary)'
          }}>
            <h2 className="display-medium" style={{ marginBottom: '24px' }}>Stay Ahead</h2>
            <p className="text-muted" style={{ fontSize: '18px', maxWidth: '600px', margin: '0 auto 40px' }}>
              Get exclusive access to pre-orders and limited edition Lumina drops.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', maxWidth: '400px', margin: '0 auto' }}>
              <input type="email" placeholder="Your electronic mail" className="input" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }} />
              <Button variant="primary">Subscribe</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
