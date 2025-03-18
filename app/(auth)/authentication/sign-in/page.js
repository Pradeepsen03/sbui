'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Row, Col, Card, Form, Button, Image, Alert } from 'react-bootstrap';
import Link from 'next/link';

const SignIn = () => {
  const router = useRouter();


  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include', // Ensure cookies are included
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Sign-in failed');
      }

      console.log("Login successful, role:", data.role); 

      router.replace('/'); // Redirect after successful login

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <Row className="align-items-center justify-content-center g-0 min-vh-100">
      <Col xxl={4} lg={6} md={8} xs={12} className="py-8 py-xl-0">
        <Card className="smooth-shadow-md">
          <Card.Body className="p-6">
            <div className="mb-4">
              <Link href="/"><Image src="/images/brand/logo/logo-primary.svg" className="mb-2" alt="" /></Link>
              <p className="mb-6">Please enter your user information.</p>
            </div>

            {/* Error Message */}
            {error && <Alert variant="danger">{error}</Alert>}

            {/* Form */}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control 
                  type="email" 
                  name="email" 
                  placeholder="Enter email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                  type="password" 
                  name="password" 
                  placeholder="**************" 
                  value={formData.password} 
                  onChange={handleChange} 
                  required 
                />
              </Form.Group>

              <div className="d-lg-flex justify-content-between align-items-center mb-4">
                <Form.Check type="checkbox" id="rememberme">
                  <Form.Check.Input type="checkbox" />
                  <Form.Check.Label>Remember me</Form.Check.Label>
                </Form.Check>
              </div>

              <div className="d-grid">
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </div>

              <div className="d-md-flex justify-content-between mt-4">
                <div className="mb-2 mb-md-0">
                  <Link href="/authentication/sign-up" className="fs-5">Create An Account</Link>
                </div>
                <div>
                  <Link href="/authentication/forget-password" className="text-inherit fs-5">Forgot your password?</Link>
                </div>
              </div>
            </Form>

          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default SignIn;
