import Link from 'next/link';
import ProductCard from '@/components/products/ProductCard';
import HeroImage from '@/components/layout/HeroImage';
import { API_BASE_URL } from '@/lib/config';

async function getFeaturedProducts() {
    try {
        const res = await fetch(`${API_BASE_URL}/api/v1/products`, {
            next: { revalidate: 3600 } // Revalidate every hour
        });
        if (!res.ok) return [];
        const json = await res.json();
        const products = Array.isArray(json) ? json : json.data || json.products || [];
        return products.slice(0, 4);
    } catch (error) {
        console.error("Error fetching featured products:", error);
        return [];
    }
}

export default async function HomeScreen() {
    const featuredProducts = await getFeaturedProducts();

    return (
        <div className="animate-fade-in relative">
            {/* Hero Section */}
            <section className="pt-28 sm:pt-36 lg:pt-44 pb-12 sm:pb-16 text-center relative max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold leading-[1.1] tracking-tight mb-4 text-foreground uppercase">
                    The Digital<br />Monolith Series
                </h1>
                <p className="text-sm sm:text-base lg:text-sm text-foreground font-semibold max-w-[500px] mx-auto mb-8 tracking-wide">
                    Engineered Performance. Uncompromising Design.
                </p>
                <div className="flex justify-center items-center mb-16">
                    <Link href="/products">
                        <button className="bg-primary text-background hover:bg-foreground transition-colors duration-300 font-bold text-[11px] uppercase tracking-widest px-8 py-3.5 rounded-full border border-transparent">
                            Explore Devices
                        </button>
                    </Link>
                </div>
                
                {/* Hero Image */}
                <div className="relative w-full max-w-[800px] mx-auto bg-surface-elevated rounded-2xl flex items-center justify-center overflow-hidden shadow-2xl aspect-[16/9] sm:aspect-[2/1] border border-border">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 dark:to-white/5 z-0" />
                    <HeroImage 
                      src="/images/hero-server.png" 
                      alt="Monolith X-1" 
                      fallbackSrc="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=2000"
                      className="w-full h-full object-cover z-10"
                    />
                </div>
            </section>

            {/* Product Grid */}
            <section className="py-8 sm:py-12 bg-surface-elevated/30">
                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {featuredProducts.map((product: any) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
