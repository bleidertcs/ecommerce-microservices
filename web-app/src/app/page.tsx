import Button from "@/components/ui/Button";
import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8010";

async function getFeaturedProducts() {
    try {
        const res = await fetch(`${API_BASE}/api/v1/products`, {
            cache: "no-store",
        });
        if (!res.ok) return [];
        const json = await res.json();
        const products = Array.isArray(json) ? json : json.data || json.products || [];
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
            <section className="pt-24 sm:pt-32 lg:pt-[160px] pb-16 sm:pb-20 lg:pb-[100px] text-center relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="badge badge-success mb-6">New Generation of Tech</div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-heading font-extrabold leading-[1.05] tracking-tight mb-6">
                    Elevate Your <span className="text-primary text-glow">Lumina</span> Life
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-muted max-w-[700px] mx-auto mb-8 sm:mb-12 font-normal px-2">
                    Experience the intersection of luxury and technology. Curated premium
                    electronics designed for the future.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center items-center">
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
            </section>

            {/* Featured Products (Bento Style alternative) */}
            <section className="py-12 sm:py-16 lg:py-24 bg-white/[0.01]">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 sm:mb-12">
                        <div>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold leading-tight tracking-tight mb-3">
                                Curated Picks
                            </h2>
                            <p className="text-muted">Hand-selected for the modern enthusiast.</p>
                        </div>
                        <Link href="/products" className="text-primary font-semibold hover:underline">
                            View Showcase →
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {featuredProducts.map((product: any) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Lumina (Bento Grid Layout) */}
            <section className="py-12 sm:py-16 lg:py-24">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold text-center mb-10 sm:mb-16">
                        The Lumina Standard
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 auto-rows-[minmax(180px,auto)]">
                        <div className="glass-card col-span-1 sm:col-span-2 md:col-span-2 row-span-2 p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
                            <div className="text-5xl mb-6">✨</div>
                            <h3 className="text-3xl font-heading font-bold mb-4">
                                Impeccable Quality
                            </h3>
                            <p className="text-muted text-lg">
                                Every product in our collection undergoes rigorous testing to meet
                                the Lumina standard of excellence.
                            </p>
                        </div>

                        <div className="glass-card p-6 sm:p-8 text-center flex flex-col items-center justify-center">
                            <div className="text-4xl mb-4">🛡️</div>
                            <h4 className="text-lg font-bold mb-3">Secure Core</h4>
                            <p className="text-muted text-sm">
                                Casdoor powered security for your peace of mind.
                            </p>
                        </div>

                        <div className="glass-card p-6 sm:p-8 text-center flex flex-col items-center justify-center">
                            <div className="text-4xl mb-4">🚀</div>
                            <h4 className="text-lg font-bold mb-3">Elite Speed</h4>
                            <p className="text-muted text-sm">
                                Instant fulfillment and real-time tracking.
                            </p>
                        </div>

                        <div className="glass-card col-span-1 sm:col-span-2 md:col-span-2 p-8 sm:p-10 bg-gradient-to-r from-primary to-[#00d1ff] text-white border-none flex flex-col justify-center">
                            <h3 className="text-2xl font-bold mb-3">Lumina Prime Support</h3>
                            <p className="opacity-90">
                                Concierge-level customer assistance available 24/7 for our elite
                                members.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Visual Break / Newsletter */}
            <section className="py-12 sm:py-16 lg:py-24">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="glass-card p-10 sm:p-16 lg:p-20 text-center bg-[radial-gradient(circle_at_center,rgba(6,127,249,0.15)_0%,transparent_70%)] border-primary/50">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold mb-4 sm:mb-6">Stay Ahead</h2>
                        <p className="text-muted text-lg max-w-[600px] mx-auto mb-10">
                            Get exclusive access to pre-orders and limited edition Lumina drops.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-[450px] mx-auto">
                            <input
                                type="email"
                                placeholder="Your electronic mail"
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-3 outline-none focus:border-primary/50 transition-all text-sm"
                            />
                            <Button variant="primary">Subscribe</Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

