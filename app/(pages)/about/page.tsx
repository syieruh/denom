import Link from 'next/link'

export default function About() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-2xl px-6 py-16 text-center space-y-8">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
          Chillin' 
        </h1>
        
        <p className="text-lg text-gray-300 leading-relaxed">
          Big dawg moves.Feel right?
        </p>
        
        <div className="text-sm text-gray-400 italic">
          zuzu
        </div>
        
        <div className="pt-8">
          <Link 
            href="/"
            className="inline-block px-6 py-3 text-sm font-medium text-gray-400 hover:text-white border border-gray-800 rounded-full hover:border-gray-600 transition-all duration-300"
          >
            Back to Vibing
          </Link>
        </div>
      </div>
    </div>
  )
}