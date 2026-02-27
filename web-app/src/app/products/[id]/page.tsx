import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import ProductActions from '@/components/products/ProductActions';
import { ApiService } from '@/services/api.service';
import { Product } from '@/types/product.types';
import styles from './ProductDetail.module.css';

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  let product: Product | null = null;
  
  try {
    product = await ApiService.getProductById(id);
  } catch (error) {
    console.error('Error fetching product:', error);
  }

  if (!product) {
    return (
      <div className="container section-padding" style={{ textAlign: 'center' }}>
        <h1 className="display-medium" style={{ marginBottom: '24px' }}>Lost in the Nebula</h1>
        <p className="text-muted" style={{ marginBottom: '40px' }}>The item you are looking for has drifted away.</p>
        <Link href="/products"><Button variant="primary">Return to Catalog</Button></Link>
      </div>
    );
  }

  const image = product.images?.[0] || 'https://via.placeholder.com/1000x800?text=Lumina+Premium';

  return (
    <div className="container section-padding animate-fade-in">
      <Link href="/products" className="back-link">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        Back to Showcase
      </Link>
      
      <div className={styles.layout}>
        {/* Visual Side */}
        <div className={styles.visualColumn}>
          <div className={`${styles.mainImageGlass} glass`}>
            <img src={image} alt={product.name} className={styles.mainImage} />
            <div className={styles.imageOverlay}></div>
          </div>
          
          <div className={styles.specsGridMini}>
             <div className={`glass-card ${styles.specItemMini}`}>
               <span className={styles.specLabel}>Latency</span>
               <span className={styles.specVal}>0.02ms</span>
             </div>
             <div className={`glass-card ${styles.specItemMini}`}>
               <span className={styles.specLabel}>Battery</span>
               <span className={styles.specVal}>48h Elite</span>
             </div>
             <div className={`glass-card ${styles.specItemMini}`}>
               <span className={styles.specLabel}>Connection</span>
               <span className={styles.specVal}>Neural 5.0</span>
             </div>
          </div>
        </div>

        {/* Info Side */}
        <div className={styles.infoColumn}>
          <div className={`glass-card ${styles.infoCardPremium}`}>
            <div className={styles.productMetaTags}>
               <span className={styles.brandTag}>{product.brand || 'Lumina Elite'}</span>
               <span className={styles.categoryTagDetail}>{product.category}</span>
            </div>
            
            <h1 className={styles.productTitleDetail}>{product.name}</h1>
            
            <div className={styles.ratingRow}>
              <div className={styles.starsDetail}>
                {[1,2,3,4,5].map(s => (
                  <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill={s <= (product!.rating || 5) ? "#ffcc00" : "rgba(255,255,255,0.1)"}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                ))}
              </div>
              <span className={styles.reviewText}>({product.reviewCount || 0} reviews)</span>
            </div>

            <p className={styles.productDescDetail}>
              {product.description || 'Elevate your daily experience with the Lumina Aura. Precision-engineered for those who demand excellence in every detail. Limited availability.'}
            </p>
            
            <div className={styles.purchaseModulePremium}>
              <div className={styles.priceSection}>
                <span className={styles.investmentLabel}>Investment</span>
                <div className={styles.priceTagDetail}>
                  <span className={styles.priceSymbol}>$</span>
                  <span className={styles.priceAmount}>{Number(product.price).toFixed(2)}</span>
                </div>
              </div>

              <ProductActions 
                productId={product.id} 
                price={product.price} 
                productName={product.name}
                productImage={image}
              />
              
              <div className={styles.stockStatusDetail}>
                <div className={`${styles.statusDot} ${product.stock > 0 ? styles.inStock : styles.outOfStock}`}></div>
                <span>{product.stock > 0 ? `${product.stock} units in reserve` : 'Reserve Depleted'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
