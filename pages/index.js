import AppShell from '@/components/AppShell'
import PhotosGrid from '@/components/PhotosGrid'

const Home = ({ photos }) => {
  return (
    <AppShell>
      <PhotosGrid photos={photos} />
    </AppShell>
  )
}

export async function getStaticProps () {
  const photos = (await import('@/data/photos.json')).data
  return {
    props: { photos }
  }
}

export default Home
