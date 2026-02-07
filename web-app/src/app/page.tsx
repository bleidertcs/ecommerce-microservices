import Button from "@/components/ui/Button";
import Link from "next/link";

export default function Home() {
  return (
    <div style={{ padding: '48px 0' }}>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '64px 0', marginBottom: '64px' }}>
        <h1 style={{ fontSize: '48px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '16px', letterSpacing: '-1px' }}>
          Shop the Best Products
        </h1>
        <p style={{ fontSize: '18px', color: 'var(--muted)', maxWidth: '500px', margin: '0 auto 32px' }}>
          Discover our curated collection of premium products with fast shipping and secure payments.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link href="/products">
            <Button variant="primary" size="lg">
              Browse Products
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg">
              Sign In
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '64px' }}>
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🚚</div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Fast Delivery</h3>
          <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Free shipping on orders over $50. Track your orders in real-time.</p>
        </div>
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔒</div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Secure Payments</h3>
          <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Your transactions are protected with enterprise-grade security.</p>
        </div>
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>⭐</div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Quality Products</h3>
          <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Curated selection of top-rated products from trusted brands.</p>
        </div>
      </section>

      {/* CTA */}
      <section className="card" style={{ padding: '48px', textAlign: 'center', background: 'var(--secondary)' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '12px' }}>Ready to get started?</h2>
        <p style={{ color: 'var(--muted)', marginBottom: '24px' }}>Create an account and start shopping today.</p>
        <Link href="/products">
          <Button variant="primary">
            View Catalog
          </Button>
        </Link>
      </section>
    </div>
  );
}
