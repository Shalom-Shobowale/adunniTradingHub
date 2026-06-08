import { Card } from "../components/ui/Card";
import {
  Award,
  Target,
  Eye,
  Shield,
  Truck,
  Clock,
  Star,
  Users,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      {/* Hero Section with Overlay */}
      <div className="relative bg-gray-900 text-white py-24">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/5466808/pexels-photo-5466808.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="h-px w-12 bg-[#CA993B]"></div>
            <span className="text-[#CA993B] text-sm font-semibold tracking-wider mx-4">
              OUR STORY
            </span>
            <div className="h-px w-12 bg-[#CA993B]"></div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 font-serif tracking-tight">
            About Adunni Trading Hub
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Your trusted partner for premium quality dried cow skin in Nigeria
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20">
        {/* Main Story Card */}
        <Card className="overflow-hidden shadow-2xl border-0 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="relative h-96 lg:h-auto">
              <img
                src="https://images.pexels.com/photos/5466808/pexels-photo-5466808.jpeg"
                alt="About us"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-r from-black/20 to-transparent"></div>
            </div>
            <div className="p-8 md:p-12 bg-white">
              <div className="my-6">
                <span className="text-[#CA993B] text-sm font-semibold tracking-wider uppercase">
                  Our Heritage
                </span>
                <div className="w-16 h-0.5 bg-[#CA993B] mt-2"></div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif">
                Crafting Excellence Since Day One
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Adunni Trading Hub was founded with a simple mission: to provide
                the highest quality dried cow skin to customers across Nigeria.
                We understand the importance of quality and consistency in this
                essential product.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Over the years, we have built strong relationships with
                suppliers and customers alike, establishing ourselves as a
                trusted name in the industry. Whether you're a retail customer
                or a wholesale buyer, we are committed to serving you with
                excellence and integrity.
              </p>

              {/* Trust Badges */}
              <div className="flex gap-6 mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-[#CA993B] fill-[#CA993B]" />
                  <span className="text-sm text-gray-600">
                    50+ Happy Clients
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#CA993B]" />
                  <span className="text-sm text-gray-600">
                    10+ Years Experience
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Mission, Vision, Values Cards - Enhanced */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <Card className="text-center p-8 border-0 shadow-xl hover:shadow-2xl transition-shadow duration-300 group">
            <div className="flex justify-center mb-6">
              <div className="bg-[#CA993B] bg-opacity-10 p-4 rounded-2xl group-hover:bg-[#CA993B] group-hover:bg-opacity-20 transition-all duration-300">
                <Target className="h-10 w-10 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-4 font-serif">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed">
              To deliver premium quality dried cow skin with exceptional service
              and competitive pricing to all our customers across Nigeria.
            </p>
          </Card>

          <Card className="text-center p-8 border-0 shadow-xl hover:shadow-2xl transition-shadow duration-300 group transform md:-translate-y-4">
            <div className="flex justify-center mb-6">
              <div className="bg-[#CA993B] bg-opacity-10 p-4 rounded-2xl group-hover:bg-[#CA993B] group-hover:bg-opacity-20 transition-all duration-300">
                <Eye className="h-10 w-10 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-4 font-serif">Our Vision</h3>
            <p className="text-gray-600 leading-relaxed">
              To become Nigeria's leading supplier of dried cow skin, known for
              quality, reliability, and exceptional customer satisfaction.
            </p>
          </Card>

          <Card className="text-center p-8 border-0 shadow-xl hover:shadow-2xl transition-shadow duration-300 group">
            <div className="flex justify-center mb-6">
              <div className="bg-[#CA993B] bg-opacity-10 p-4 rounded-2xl group-hover:bg-[#CA993B] group-hover:bg-opacity-20 transition-all duration-300">
                <Award className="h-10 w-10 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-4 font-serif">Our Values</h3>
            <p className="text-gray-600 leading-relaxed">
              Quality, integrity, customer focus, and continuous improvement
              drive everything we do.
            </p>
          </Card>
        </div>

        {/* Why Choose Us - Enhanced Grid */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <span className="text-[#CA993B] text-sm font-semibold tracking-wider uppercase">
              Why Adunni?
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 font-serif">
              Why Choose Us?
            </h2>
            <div className="w-24 h-0.5 bg-[#CA993B] mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 bg-[#CA993B] bg-opacity-10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#CA993B] group-hover:bg-opacity-20 transition-all">
                <Truck className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">Fast Delivery</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Efficient logistics ensure your orders reach you quickly and
                safely nationwide.
              </p>
            </Card>

            <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 bg-[#CA993B] bg-opacity-10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#CA993B] group-hover:bg-opacity-20 transition-all">
                <Clock className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">24/7 Support</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Our dedicated team is always ready to assist you with your
                needs.
              </p>
            </Card>

            <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 bg-[#CA993B] bg-opacity-10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#CA993B] group-hover:bg-opacity-20 transition-all">
                <Target className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">Competitive Pricing</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                We offer fair prices for both retail and wholesale customers.
              </p>
            </Card>
            <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 bg-[#CA993B] bg-opacity-10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#CA993B] group-hover:bg-opacity-20 transition-all">
                <Star className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">Accountability</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                We are committed to transparency and integrity in all our dealings.
              </p>
            </Card>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gray-900 rounded-2xl p-8 md:p-12 mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-[#CA993B] mb-2">
                10+
              </div>
              <div className="text-gray-400 text-sm uppercase tracking-wide">
                Years Experience
              </div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-[#CA993B] mb-2">
                50+
              </div>
              <div className="text-gray-400 text-sm uppercase tracking-wide">
                Happy Clients
              </div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-[#CA993B] mb-2">
                36
              </div>
              <div className="text-gray-400 text-sm uppercase tracking-wide">
                States Covered
              </div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-[#CA993B] mb-2">
                100%
              </div>
              <div className="text-gray-400 text-sm uppercase tracking-wide">
                Satisfaction
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
