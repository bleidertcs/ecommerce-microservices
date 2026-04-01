import ProductDetailScreen from './ProductDetailScreen';

export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: { id: string } }) {
    const { id } = await params;
    return <ProductDetailScreen id={id} />;
}
