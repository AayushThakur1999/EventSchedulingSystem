import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-cover bg-center text-white">
      {/* Gradient overlay for better text readability */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1484591974057-265bb767ef71?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
          opacity: 1,
        }}
      />

      <header className="relative text-center z-10">
        <h1 className="text-5xl font-bold mb-4">Welcome to Event Scheduler</h1>
        <p className="text-lg mb-8">
          Effortlessly manage your events and meetings, all in one place.
        </p>
      </header>

      <main className="relative z-10 flex flex-col items-center">
        <section className="bg-white p-8 rounded-lg shadow-lg text-black max-w-lg mb-6 opacity-90">
          <h2 className="text-2xl font-semibold mb-4">Why Choose Us?</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Easy-to-use scheduling tools</li>
            <li>Real-time updates and notifications</li>
            <li>Secure data handling</li>
            <li>Personalized experience for your events</li>
          </ul>
        </section>

        <Link to="/login">
          <button className="btn btn-accent text-white text-base hover:bg-gradient-to-r from-lime-600 to-pink-500 hover:border-none px-6 py-2 rounded-lg shadow-lg">
            Get Started
          </button>
        </Link>
      </main>

      <footer className="absolute z-10 bottom-4 text-sm">
        <p>
          &copy; {new Date().getFullYear()} Event Scheduler. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
};
export default Landing;
