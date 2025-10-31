import { FC } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';

const LandingPage: FC = () => {
  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <Header />

      {/* Hero Section */}
      <section
        style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          backgroundColor: '#f5f5f5',
        }}
      >
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          Welcome to Euonroia
        </h1>
        <p style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>
          Learn to code, even without a laptop. Start your journey today!
        </p>
        <Link
          to="/signup"
          style={{
            padding: '0.75rem 2rem',
            backgroundColor: '#007bff',
            color: 'white',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: 'bold',
          }}
        >
          Get Started
        </Link>
      </section>

      {/* Features Section */}
      <section
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          padding: '4rem 2rem',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ maxWidth: '300px', margin: '1rem', textAlign: 'center' }}>
          <h2>Learn Web Development</h2>
          <p>Hands-on lessons on HTML, CSS, JavaScript, and more.</p>
        </div>
        <div style={{ maxWidth: '300px', margin: '1rem', textAlign: 'center' }}>
          <h2>Access Anywhere</h2>
          <p>All you need is a device with a browser. No powerful laptop required.</p>
        </div>
        <div style={{ maxWidth: '300px', margin: '1rem', textAlign: 'center' }}>
          <h2>Community Support</h2>
          <p>Join a growing community of learners and mentors to guide you.</p>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section style={{ textAlign: 'center', padding: '2rem' }}>
        <Link
          to="/signup"
          style={{
            padding: '0.75rem 2rem',
            backgroundColor: '#28a745',
            color: 'white',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: 'bold',
          }}
        >
          Join Now
        </Link>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
