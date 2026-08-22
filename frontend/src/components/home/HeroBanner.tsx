import { Link } from 'react-router-dom'

export default function HeroBanner() {
  return (
    <section className="bg-primary text-white">
      <div className="container flex min-h-[360px] items-center py-16">
        <div className="max-w-xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent">Tutsy Crown</p>
          <h1 className="text-4xl font-bold leading-tight md:text-6xl">Find your next favorite look.</h1>
          <p className="mt-5 text-lg text-gray-200">Curated fashion pieces for every version of you.</p>
          <Link to="/explore" className="mt-8 inline-block rounded bg-accent px-6 py-3 font-semibold text-white hover:opacity-90">
            Shop the collection
          </Link>
        </div>
      </div>
    </section>
  )
}
