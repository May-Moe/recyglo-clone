import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Thank you for your message. We will get back to you soon!');
    setFormData({ name: '', email: '', company: '', message: '' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero */}
      <section className="py-20 md:py-32 bg-primary text-white">
        <div className="container">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Get in Touch</h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Have questions about our services? We'd love to hear from you. Contact us today to discuss how RecyGlo can help your business achieve its sustainability goals.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-foreground mb-8">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Full Name
                    </label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                      className="w-full"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Company Name
                  </label>
                  <Input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Your company"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Message
                  </label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your sustainability needs..."
                    required
                    rows={6}
                    className="w-full"
                  />
                </div>
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg"
                >
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-8">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <Mail className="text-primary flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="font-bold text-foreground mb-1">Email</h3>
                    <a href="mailto:Contact@recyglo.com" className="text-muted-foreground hover:text-primary">
                      Contact@recyglo.com
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Phone className="text-primary flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="font-bold text-foreground mb-1">Phone</h3>
                    <a href="tel:+66814126842" className="text-muted-foreground hover:text-primary">
                      (+66) 81 412 6842
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <MapPin className="text-primary flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="font-bold text-foreground mb-1">Locations</h3>
                    <p className="text-muted-foreground">
                      Thailand, Vietnam, Myanmar, Indonesia, South Korea, Singapore, Malaysia
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Clock className="text-primary flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="font-bold text-foreground mb-1">Business Hours</h3>
                    <p className="text-muted-foreground">
                      Monday to Friday<br />
                      8:30 AM - 5:30 PM
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-8 pt-8 border-t border-border">
                <h3 className="font-bold text-foreground mb-4">Follow Us</h3>
                <a
                  href="https://instagram.com/recyglo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold"
                >
                  @RecyGlo on Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
