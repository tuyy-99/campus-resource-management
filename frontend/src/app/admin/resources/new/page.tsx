'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/components/providers/AuthProvider';

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

// Debug logging
console.log('Cloudinary Config:', {
  CLOUD_NAME,
  UPLOAD_PRESET,
  env: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
});

export default function NewResourcePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [availability, setAvailability] = useState<'available' | 'unavailable'>('available');
  const [selectedEmoji, setSelectedEmoji] = useState('📚');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<(string | null)[]>([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_SIZE = 500 * 1024 * 1024; // 500MB
  const MAX_FILES = 10;

  // Cleanup preview URLs
  useEffect(() => {
    return () => previewUrls.forEach(url => url && URL.revokeObjectURL(url));
  }, [previewUrls]);

  if (authLoading) {
    return (
      <div className="relative min-h-[calc(100vh-5rem)] bg-mesh-admin">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5" />
        <div className="relative flex items-center justify-center py-20">
          <div className="spinner mx-auto" />
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') {
    router.replace('/login');
    return null;
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    let skipped = 0;

    const validFiles = files.filter(file => {
      if (file.size > MAX_SIZE) {
        skipped++;
        return false;
      }
      return true;
    });

    if (skipped) setError(`${skipped} file(s) exceeded the 500MB limit`);
    else setError('');

    const combined = [...selectedFiles, ...validFiles].slice(0, MAX_FILES);
    setSelectedFiles(combined);

    const previews = combined.map(file =>
      file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    );

    previewUrls.forEach(url => url && URL.revokeObjectURL(url));
    setPreviewUrls(previews);
  };

  const removeFile = (index: number) => {
    if (previewUrls[index]) URL.revokeObjectURL(previewUrls[index]!);
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return '🖼️';
    if (type.includes('pdf')) return '📄';
    if (type.includes('presentation')) return '📊';
    if (type.includes('excel')) return '📈';
    if (type.startsWith('video/')) return '🎬';
    if (type.startsWith('audio/')) return '🎵';
    return '📁';
  };

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) throw new Error('Cloudinary upload failed');

    const data = await res.json();

    return {
      name: file.name,
      type: file.type,
      size: file.size,
      url: data.secure_url,
      public_id: data.public_id,
    };
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !category.trim()) {
      setError('Name and category are required');
      return;
    }

    setSubmitting(true);
    try {
      const uploadedFiles = await Promise.all(selectedFiles.map(uploadToCloudinary));

      await api.post('/resources', {
        name,
        category,
        description,
        availability,
        files: uploadedFiles,
      });

      router.push('/admin/resources');
    } catch (err) {
      setError('Upload failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-5rem)] bg-mesh-admin">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5" />
      <div className="relative mx-auto max-w-4xl px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl mb-8 shadow-lg">
            <span className="text-3xl text-white">➕</span>
          </div>
          
          {/* Title */}
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-6">
            <span className="gradient-text-admin">Add New Resource</span>
          </h1>
          
          {/* Description */}
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Create a new resource for students and faculty to access. Upload files, set availability, and organize your resource catalog.
          </p>
          
          {/* Back Link */}
          <Link 
            href="/admin/resources" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors font-medium text-lg"
          >
            ← Back to Resource Management
          </Link>
        </div>

        {/* Main Form Card */}
        <div className="card-admin">
          {error && (
            <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 dark:bg-red-900/20 dark:border-red-800/50">
              <div className="flex items-center gap-3">
                <span className="text-red-500 text-xl">⚠️</span>
                <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-3">
                Basic Information
              </h2>
              
              <div className="form-row">
                <div className="form-field">
                  <label className="form-label">Resource Name *</label>
                  <input 
                    className="input" 
                    placeholder="Enter resource name" 
                    value={name} 
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-row horizontal">
                <div className="form-field">
                  <label className="form-label">Category *</label>
                  <input 
                    className="input" 
                    placeholder="e.g., Books, Equipment, Software" 
                    value={category} 
                    onChange={e => setCategory(e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-field">
                  <label className="form-label">Availability</label>
                  <select 
                    className="input" 
                    value={availability} 
                    onChange={e => setAvailability(e.target.value as any)}
                  >
                    <option value="available">✅ Available</option>
                    <option value="unavailable">❌ Unavailable</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label className="form-label">Description</label>
                  <textarea 
                    className="textarea" 
                    placeholder="Provide a detailed description of the resource..."
                    value={description} 
                    onChange={e => setDescription(e.target.value)}
                    rows={4}
                  />
                  <p className="form-help">
                    Include details about the resource, its purpose, and any usage instructions.
                  </p>
                </div>
              </div>
            </div>

            {/* File Upload Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-3">
                Files & Attachments
              </h2>
              
              <div
                onClick={() => fileInputRef.current?.click()}
                className="group relative overflow-hidden rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/50 p-8 text-center cursor-pointer transition-all duration-300 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="text-4xl text-slate-400 dark:text-slate-500 group-hover:text-blue-500 transition-colors">
                    📁
                  </div>
                  <div>
                    <p className="text-lg font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      Click to upload files
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Maximum {MAX_FILES} files, up to 500MB each
                    </p>
                  </div>
                </div>
              </div>

              <input 
                ref={fileInputRef} 
                type="file" 
                multiple 
                className="hidden" 
                onChange={handleFileSelect} 
              />

              {/* Selected Files */}
              {selectedFiles.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                    Selected Files ({selectedFiles.length}/{MAX_FILES})
                  </h3>
                  <div className="space-y-3">
                    {selectedFiles.map((file, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-4">
                          <span className="text-2xl">{getFileIcon(file.type)}</span>
                          <div>
                            <div className="font-medium text-slate-900 dark:text-white">
                              {file.name}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                              {formatFileSize(file.size)} • {file.type}
                            </div>
                          </div>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => removeFile(i)} 
                          className="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="form-actions pt-6 border-t border-slate-200 dark:border-slate-700">
              <Link 
                href="/admin/resources"
                className="btn-secondary"
              >
                Cancel
              </Link>
              <button 
                type="submit" 
                disabled={submitting || !name.trim() || !category.trim()} 
                className="btn-primary"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Uploading...
                  </span>
                ) : (
                  'Create Resource'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
