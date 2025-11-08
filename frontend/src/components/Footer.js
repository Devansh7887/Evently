import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-4 mt-8">
      <div className="container mx-auto text-center">
        <p>Copyright &copy; {new Date().getFullYear()} EventApp. All Rights Reserved.</p>
      </div>
    </footer>
  );
}