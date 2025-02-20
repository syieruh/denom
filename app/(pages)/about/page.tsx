export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8 pl-32">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white bg-opacity-5 backdrop-blur-sm rounded-xl p-8">
          <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl mb-4">Contact Information</h3>
              <div className="space-y-3 text-gray-300">
                <p>Email: shxaib@shxaib.com </p>
                <p>Phone: bruh </p>
                <p>Address: Ozone on weekdays, Moon on weekends. </p>
              </div>
            </div>
            <div>
              <h3 className="text-xl mb-4">Chillin Hours</h3>
              <div className="space-y-3 text-gray-300">
                <p>Monday - Sunday: 9:00 AM - 6:00 PM</p>
              
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
