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
    return products.filter((p: any) => p.featured).slice(0, 4);
  } catch (error) {
    return [];
  }
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div style={{ padding: '0 0 48px' }}>
      {/* Hero Section */}
      <section style={{ 
        textAlign: 'center', 
        padding: '80px 0', 
        marginBottom: '48px', 
        background: 'linear-gradient(135deg, var(--card-bg) 0%, var(--background) 100%)',
        borderRadius: '0 0 32px 32px',
        borderBottom: '1px solid var(--border)'
      }}>
        <h1 style={{ 
          fontSize: '56px', 
          fontWeight: '800', 
          color: 'var(--foreground)', 
          marginBottom: '20px', 
          letterSpacing: '-2px',
          lineHeight: '1.1'
        }}>
          Premium Tech & Style <br />
          <span style={{ color: 'var(--primary)' }}>Delivered to You</span>
        </h1>
        <p style={{ fontSize: '20px', color: 'var(--muted)', maxWidth: '600px', margin: '0 auto 32px', lineHeight: '1.6' }}>
          Discover our curated collection of premium products. Experience seamless shopping with Lumina.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link href="/products">
            <Button variant="primary" size="lg" style={{ padding: '12px 32px' }}>
              Shop Catalog
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" size="lg" style={{ padding: '12px 32px' }}>
              Join Community
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section style={{ marginBottom: '80px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
            <div>
              <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>Featured Collections</h2>
              <p style={{ color: 'var(--muted)' }}>Hand-picked premium items for your lifestyle.</p>
            </div>
            <Link href="/products" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>
              View all products →
            </Link>
          </div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', 
            gap: '24px' 
          }}>
            {featuredProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Features Grid */}
      <section style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '24px', 
        marginBottom: '80px' 
      }}>
        <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>🚚</div>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>Worldwide Shipping</h3>
          <p style={{ color: 'var(--muted)', fontSize: '15px', lineHeight: '1.6' }}>Free shipping on all orders over $50. Track your items from warehouse to doorstep.</p>
        </div>
        <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>🔒</div>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>Secure Verification</h3>
          <p style={{ color: 'var(--muted)', fontSize: '15px', lineHeight: '1.6' }}>Authenticated via Casdoor. Your data privacy and payment security are our top priorities.</p>
        </div>
        <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>⭐</div>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>Top Tier Support</h3>
          <p style={{ color: 'var(--muted)', fontSize: '15px', lineHeight: '1.6' }}>24/7 customer assistance. We are here to ensure you have the best shopping experience.</p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="card" style={{ 
        padding: '64px', 
        textAlign: 'center', 
        background: 'var(--primary)', 
        color: 'white', 
        borderRadius: '24px',
        boxShadow: '0 20px 40px rgba(var(--primary-rgb), 0.2)'
      }}>
        <h2 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '16px' }}>Start Your Experience Today</h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '18px', marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px' }}>
          Join thousands of satisfied customers and get access to exclusive deals.
        </p>
        <Link href="/products">
          <Button variant="secondary" size="lg" style={{ background: 'white', color: 'var(--primary)', fontWeight: '700', padding: '12px 48px' }}>
            Explore Full Catalog
          </Button>
        </Link>
      </section>
    </div>
  );
}
