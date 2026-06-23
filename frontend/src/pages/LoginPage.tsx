import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, Loader2, ArrowRight } from 'lucide-react';
import { apiClient } from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import { motion } from 'framer-motion';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(4, 'Password must be at least 4 characters')
});

type FormData = z.infer<typeof schema>;

export const LoginPage = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: 'admin@fincore.com',
      password: 'admin'
    }
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      setError('');
      const response = await apiClient.post('/auth/login', data);
      login(response.data.user, response.data.token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to authenticate');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-900">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/30 rounded-full blur-[120px] mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/20 rounded-full blur-[120px] mix-blend-screen" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10 mx-4"
      >
        <div className="bg-slate-800/60 backdrop-blur-2xl p-8 rounded-3xl border border-slate-700/50 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 mb-6 shadow-lg shadow-indigo-500/30">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">VaultShift FinCore</h2>
            <p className="text-slate-400 mt-2 font-medium">Secure Cloud Banking Access</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
              <Shield className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">Work Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input 
                  {...register('email')}
                  className="block w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                  placeholder="admin@fincore.com"
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input 
                  type="password"
                  {...register('password')}
                  className="block w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.password.message}</p>}
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-900 shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">
                    Secure Login
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-slate-500">Protected by VaultShift Enterprise Grade Security.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
