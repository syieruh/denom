export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#000020] to-black text-white p-8 pl-32">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">About Us</h1>
        
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="bg-white bg-opacity-5 backdrop-blur-sm rounded-xl p-8 mb-12">
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <div className="aspect-video w-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mb-6" />
            <p className="text-gray-300 leading-relaxed">
              Founded in 2020, we've been pushing the boundaries of musical expression through innovative digital experiences. 
              Our platform combines cutting-edge technology with artistic vision to create immersive musical journeys that 
              resonate with audiences worldwide.
            </p>
          </div>

          {/* Mission Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white bg-opacity-5 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">Our Mission</h3>
              <p className="text-gray-300">
                To revolutionize how people experience and interact with music in the digital age, 
                creating meaningful connections between artists and audiences through innovative technology.
              </p>
            </div>
            <div className="bg-white bg-opacity-5 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">Our Vision</h3>
              <p className="text-gray-300">
                To become the leading platform for immersive musical experiences, where technology 
                and artistry converge to create unforgettable moments.
              </p>
            </div>
          </div>

          {/* Team Section */}
          <div className="bg-white bg-opacity-5 backdrop-blur-sm rounded-xl p-8">
            <h2 className="text-2xl font-semibold mb-6">Meet the Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'Alex Rivers', role: 'Creative Director', image: '/team1.jpg' },
                { name: 'Sarah Chen', role: 'Lead Developer', image: '/team2.jpg' },
                { name: 'Marcus Kim', role: 'Music Curator', image: '/team3.jpg' }
              ].map((member, index) => (
                <div key={index} className="text-center">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4" />
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-gray-400">{member.role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-white bg-opacity-5 backdrop-blur-sm rounded-xl p-8">
            <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl mb-4">Contact Information</h3>
                <div className="space-y-3 text-gray-300">
                  <p>Email: contact@example.com</p>
                  <p>Phone: (555) 123-4567</p>
                  <p>Address: 123 Music Street, Digital City</p>
                </div>
              </div>
              <div>
                <h3 className="text-xl mb-4">Business Hours</h3>
                <div className="space-y-3 text-gray-300">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 4:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
