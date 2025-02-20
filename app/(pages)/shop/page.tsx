import Image from 'next/image'

const products = [
  {
    id: 1,
    name: 'Limited Edition Vinyl',
    price: '$29.99',
    image: '/vinyl-record.jpg',
    description: 'Exclusive vinyl pressing with custom artwork'
  },
  {
    id: 2,
    name: 'Artist T-Shirt',
    price: '$24.99',
    image: '/tshirt.jpg',
    description: 'Premium cotton t-shirt with album artwork'
  },
  {
    id: 3,
    name: 'Collector\'s Edition Box Set',
    price: '$79.99',
    image: '/boxset.jpg',
    description: 'Complete discography with bonus material'
  },
  // Add more products as needed
]

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8 pl-32">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Shop</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div 
              key={product.id}
              className="bg-white bg-opacity-5 backdrop-blur-sm rounded-xl p-6 hover:bg-opacity-10 transition-all duration-300"
            >
              <div className="aspect-square relative mb-4 bg-gray-800 rounded-lg overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 animate-gradient" />
              </div>
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-400 mb-4">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">{product.price}</span>
                <button className="bg-white bg-opacity-10 hover:bg-opacity-20 px-4 py-2 rounded-full transition-all duration-200">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
