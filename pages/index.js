import AppShell from '@/components/AppShell'
import ProductsGrid from '@/components/ProductsGrid'

const Home = ({ products }) => {
  return (
    <AppShell>
      <ProductsGrid products={products} />
    </AppShell>
  )
}

export async function getStaticProps () {
  const kittens = (await import('@/data/kittens.json')).data
  const products = kittens.map(({ id, price, ...kitten }, index) => {
    return {
      id,
      image: kitten.url,
      title: kitten.name,
      price
    }
  })
  return {
    props: {
      products
    }
  }
}

export default Home
