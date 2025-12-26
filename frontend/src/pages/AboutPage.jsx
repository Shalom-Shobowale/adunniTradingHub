import { Card } from "../components/ui/Card";
import { Award, Target, Eye } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 ">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-vibes">
            About Adunni Trading Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your trusted partner for premium quality dried cow skin in Nigeria
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <img
              src="https://images.pexels.com/photos/5466808/pexels-photo-5466808.jpeg"
              alt="About us"
              className="rounded-xl shadow-lg w-full"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-6 font-vibes">Our Story</h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              Adunni Trading Hub was founded with a simple mission: to provide
              the highest quality dried cow skin to customers across Nigeria. We
              understand the importance of quality and consistency in this
              essential product.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              Over the years, we have built strong relationships with suppliers
              and customers alike, establishing ourselves as a trusted name in
              the industry. Whether you're a retail customer or a wholesale
              buyer, we are committed to serving you with excellence.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-[#CA993B] bg-opacity-10 p-4 rounded-full">
                <Target className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-3">Our Mission</h3>
            <p className="text-gray-600">
              To deliver premium quality dried cow skin with exceptional service
              and competitive pricing to all our customers.
            </p>
          </Card>

          <Card className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-[#CA993B] bg-opacity-10 p-4 rounded-full">
                <Eye className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-3">Our Vision</h3>
            <p className="text-gray-600">
              To become Nigeria's leading supplier of dried cow skin, known for
              quality, reliability, and customer satisfaction.
            </p>
          </Card>

          <Card className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-[#CA993B] bg-opacity-10 p-4 rounded-full">
                <Award className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-3">Our Values</h3>
            <p className="text-gray-600">
              Quality, integrity, customer focus, and continuous improvement
              drive everything we do.
            </p>
          </Card>
        </div>

        <Card>
          <h2 className="text-3xl font-bold mb-6 text-center font-vibes">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-lg mb-2">Quality Assurance</h3>
              <p className="text-gray-600">
                Every product is carefully selected and inspected to meet our
                high standards.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Competitive Pricing</h3>
              <p className="text-gray-600">
                We offer fair prices for both retail and wholesale customers.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Efficient logistics ensure your orders reach you quickly and
                safely.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Excellent Service</h3>
              <p className="text-gray-600">
                Our dedicated team is always ready to assist you with your
                needs.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
