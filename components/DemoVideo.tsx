export default function DemoVideo() {
  return (
    <section id="demo" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4">See ContractBuddy in Action</h2>
          <p className="text-xl text-gray-500">
            Watch our demo to see how easy it is to analyze and manage your contracts.
          </p>
        </div>
        <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-2xl">
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/u9m6cah1HME"
            title="Contract-AI Demo Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>
      </div>
    </section>
  )
}

