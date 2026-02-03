"use client";

import { useState } from 'react';
import { Input, Textarea, Select } from '@/components/ui';

export default function ThemeDemoPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    message: '',
    priority: 'medium'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo validation
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      alert('Form submitted successfully! Check the console for data.');
      console.log('Form data:', formData);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-5rem)] bg-mesh">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-purple-500/5" />
      
      <div className="relative mx-auto max-w-4xl px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mx-auto mb-6 w-20 h-20 rounded-3xl bg-gradient-to-r from-violet-500 to-purple-500 p-5 shadow-xl shadow-violet-500/30 float-animation">
            <span className="text-3xl">🎨</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            <span className="gradient-text">Theme Demo</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            All text fields automatically support both light and dark themes
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Form Demo */}
          <div className="card">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Form Components
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Full Name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={errors.name}
                helpText="This field is required"
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
              />

              <Input
                label="Category"
                placeholder="Enter a category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                helpText="Optional field"
              />

              <Select
                label="Priority Level"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                options={[
                  { value: 'low', label: 'Low Priority' },
                  { value: 'medium', label: 'Medium Priority' },
                  { value: 'high', label: 'High Priority' },
                  { value: 'urgent', label: 'Urgent' }
                ]}
              />

              <Textarea
                label="Message"
                placeholder="Enter your message here..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                helpText="Describe your request in detail"
              />

              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  Submit Form
                </button>
                <button 
                  type="button" 
                  onClick={() => setFormData({ name: '', email: '', category: '', message: '', priority: 'medium' })}
                  className="btn-secondary"
                >
                  Clear Form
                </button>
              </div>
            </form>
          </div>

          {/* Theme Info */}
          <div className="card">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Theme Features
            </h2>
            
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">🌙 Dark Mode Support</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  All input fields have dark backgrounds (slate-800) in dark mode with proper contrast and readability.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">🎯 Consistent Styling</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Unified design system with consistent spacing, borders, and focus states across all components.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">♿ Accessibility</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Proper labels, error states, and keyboard navigation support for all form elements.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">🔧 Reusable Components</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Input, Textarea, and Select components with built-in error handling and help text support.
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">💡 Usage</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                Import components from the UI library:
              </p>
              <code className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded text-slate-800 dark:text-slate-200">
                import {`{ Input, Textarea, Select }`} from '@/components/ui';
              </code>
              
              {/* Debug info */}
              <div className="mt-4 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                <p className="text-xs text-yellow-800 dark:text-yellow-200">
                  <strong>Debug:</strong> If inputs still appear white in dark mode, try refreshing the page or clearing browser cache.
                  The dark class should be applied to the html element.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}