import Footer from "@/ui/Footer";
import Header from "@/ui/Header";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      <section className="my-24">
        {children}
      </section>
      <Footer />
    </div>
  );
}
